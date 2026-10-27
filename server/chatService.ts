/**
 * CarePulse Chat Service
 * Supports dual-model configurations (e.g. gpt-4o-mini for quick triage + gpt-4o for deep medical guides),
 * Dify integration, conversation memory, emergency screening, and safe healthcare fallbacks.
 */

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId?: string;
  modelPreference?: 'fast' | 'detailed' | string;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  message_id?: string;
  created_at?: number;
  provider: 'chatgpt' | 'dify' | 'fallback' | 'gemini';
  model_used?: string;
  isEmergencyAlert?: boolean;
}

// Conversation history buffer for ChatGPT sessions
interface MessageRecord {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const sessionStore = new Map<string, MessageRecord[]>();

const SYSTEM_HEALTHCARE_PROMPT = `You are CarePulse AI, an intelligent, empathetic, and professional healthcare assistant inspired by Practo.
Your goal is to assist patients by providing clear, evidence-based healthcare education, medical terminology explanations, doctor specialty recommendations, and lab test guidance.

CRITICAL HEALTHCARE SAFETY & SCOPE:
1. You provide general educational healthcare guidance, NOT definitive diagnoses.
2. Never tell a patient to start, stop, or adjust prescription medications (e.g. antibiotics, heart medication) without direct consultation with a licensed doctor.
3. If the user mentions emergency warning signs (chest pressure/pain, stroke symptoms, severe breathing difficulties, uncontrolled bleeding, suicidal thoughts), immediately advise them to contact emergency medical services (911, 112, 999) or visit the nearest emergency room without delay.
4. Always conclude symptom reviews with a brief recommendation to consult a verified doctor for a clinical evaluation.
5. Keep explanations warm, accessible, well-structured, and easy to read.`;

// Emergency symptom keywords that require immediate referral to emergency services
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'difficulty breathing',
  'cannot breathe',
  'severe bleeding',
  'unconscious',
  'overdose',
  'anaphylaxis',
  'suicide',
  'kill myself',
  'coughing up blood',
  'sudden numbness',
  'face drooping',
];

const EMERGENCY_NOTICE = `🚨 **URGENT MEDICAL NOTICE**:
The symptoms you described may require immediate emergency medical evaluation. Please do NOT wait:
- Call your local emergency helpline immediately (e.g., **911** in the US/Canada, **112** in the EU/India, **999** in the UK, or **108** for ambulance).
- Go to the nearest Hospital Emergency Department right away.
- If you are experiencing thoughts of self-harm, please reach out to 988 (Suicide & Crisis Lifeline) or your local crisis helpline.

---
`;

export class ChatService {
  private difyBaseUrl: string;
  private difyApiKey: string;
  private openAiApiKey: string;
  private openAiPrimaryModel: string;
  private openAiAdvancedModel: string;
  private openAiBaseUrl: string;

  constructor() {
    this.difyBaseUrl = process.env.CHAT_API_URL || 'https://api.dify.ai/v1';
    this.difyApiKey = process.env.CHAT_API_KEY || '';
    
    // Check for OpenAI / ChatGPT API keys in OPENAI_API_KEY or CHAT_API_KEY (if user used sk-...)
    const envOpenAiKey = process.env.OPENAI_API_KEY || '';
    const isSkKey = (process.env.CHAT_API_KEY || '').startsWith('sk-');
    
    this.openAiApiKey = envOpenAiKey || (isSkKey ? (process.env.CHAT_API_KEY || '') : '');
    
    // Dual Model Support:
    // Model 1: Fast triage / standard questions
    this.openAiPrimaryModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    // Model 2: Advanced deep reasoning / complex clinical queries
    this.openAiAdvancedModel = process.env.OPENAI_MODEL_ADVANCED || process.env.OPENAI_MODEL_SECOND || 'gpt-4o';
    
    this.openAiBaseUrl = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
  }

  /**
   * Determine whether ChatGPT or Dify is the active provider
   */
  public getActiveProvider(): 'chatgpt' | 'dify' | 'fallback' {
    if (this.openAiApiKey && this.openAiApiKey.length > 5) {
      return 'chatgpt';
    }
    if (this.difyApiKey && this.difyApiKey.length > 5) {
      return 'dify';
    }
    return 'fallback';
  }

  public getStatus() {
    const provider = this.getActiveProvider();
    const activeKey = provider === 'chatgpt' ? this.openAiApiKey : this.difyApiKey;
    return {
      provider,
      configured: Boolean(activeKey && activeKey.length > 5),
      primaryModel: this.openAiPrimaryModel,
      advancedModel: this.openAiAdvancedModel,
      models: [
        { id: 'fast', name: this.openAiPrimaryModel, label: 'Fast Triage (Model 1)' },
        { id: 'detailed', name: this.openAiAdvancedModel, label: 'In-Depth Medical Guide (Model 2)' },
      ],
      maskedKey: activeKey
        ? `${activeKey.substring(0, 7)}...${activeKey.substring(activeKey.length - 4)}`
        : 'Not configured',
    };
  }

  public async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const trimmedMessage = request.message.trim();
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) =>
      trimmedMessage.toLowerCase().includes(kw)
    );

    const provider = this.getActiveProvider();

    // 1. Try ChatGPT / OpenAI
    if (provider === 'chatgpt') {
      try {
        const response = await this.callOpenAiChat(
          trimmedMessage,
          request.conversationId,
          request.modelPreference,
          isEmergency
        );
        return response;
      } catch (err: unknown) {
        console.warn('[ChatService] OpenAI ChatGPT call failed:', err);
        return this.generateHealthcareFallback(
          trimmedMessage,
          request.conversationId,
          isEmergency,
          `OpenAI Error: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // 2. Try Dify
    if (provider === 'dify') {
      try {
        const response = await this.callDifyChat(trimmedMessage, request.conversationId, request.userId, isEmergency);
        return response;
      } catch (err: unknown) {
        console.warn('[ChatService] Dify call failed:', err);
        return this.generateHealthcareFallback(
          trimmedMessage,
          request.conversationId,
          isEmergency,
          `Dify Error: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // 3. Fallback
    return this.generateHealthcareFallback(trimmedMessage, request.conversationId, isEmergency);
  }

  /**
   * OpenAI / ChatGPT API Call with dual-model resolution
   */
  private async callOpenAiChat(
    message: string,
    existingConvId?: string,
    modelPreference?: string,
    isEmergency = false
  ): Promise<ChatResponse> {
    const convId = existingConvId || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Choose model based on preference or query complexity
    let targetModel = this.openAiPrimaryModel;
    if (modelPreference === 'detailed' || modelPreference === this.openAiAdvancedModel) {
      targetModel = this.openAiAdvancedModel;
    } else if (
      !modelPreference &&
      (message.length > 250 ||
        message.toLowerCase().includes('diagnosis') ||
        message.toLowerCase().includes('lab test') ||
        message.toLowerCase().includes('symptoms'))
    ) {
      // Auto-route complex queries to advanced model if configured
      targetModel = this.openAiAdvancedModel;
    }

    // Retrieve previous messages for conversation context
    let history = sessionStore.get(convId);
    if (!history) {
      history = [{ role: 'system', content: SYSTEM_HEALTHCARE_PROMPT }];
    }

    history.push({ role: 'user', content: message });
    // Keep last 12 messages for token economy
    if (history.length > 13) {
      history = [history[0], ...history.slice(-12)];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    const endpoint = `${this.openAiBaseUrl.replace(/\/+$/, '')}/chat/completions`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: targetModel,
        messages: history,
        temperature: 0.35,
        max_tokens: 850,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    let answer = data.choices?.[0]?.message?.content || 'Thank you for your inquiry. A healthcare assistant is reviewing your question.';

    if (isEmergency && !answer.toLowerCase().includes('emergency')) {
      answer = `${EMERGENCY_NOTICE}\n${answer}`;
    }

    // Save assistant reply in session store
    history.push({ role: 'assistant', content: answer });
    sessionStore.set(convId, history);

    return {
      answer,
      conversation_id: convId,
      message_id: data.id || `msg-${Date.now()}`,
      created_at: data.created || Math.floor(Date.now() / 1000),
      provider: 'chatgpt',
      model_used: targetModel,
      isEmergencyAlert: isEmergency,
    };
  }

  /**
   * Dify Chat Messages API Call
   */
  private async callDifyChat(
    message: string,
    existingConvId?: string,
    userId?: string,
    isEmergency = false
  ): Promise<ChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000);

    const endpoint = `${this.difyBaseUrl.replace(/\/+$/, '')}/chat-messages`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: existingConvId || '',
        user: userId || 'carepulse-patient',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dify HTTP ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      answer?: string;
      conversation_id?: string;
      id?: string;
      created_at?: number;
    };

    let answer = data.answer || 'Thank you for your question.';
    if (isEmergency && !answer.toLowerCase().includes('emergency')) {
      answer = `${EMERGENCY_NOTICE}\n${answer}`;
    }

    return {
      answer,
      conversation_id: data.conversation_id || existingConvId || `conv-${Date.now()}`,
      message_id: data.id || `msg-${Date.now()}`,
      created_at: data.created_at || Math.floor(Date.now() / 1000),
      provider: 'dify',
      model_used: 'dify-app',
      isEmergencyAlert: isEmergency,
    };
  }

  /**
   * Safe, evidence-based healthcare educational fallback
   */
  private generateHealthcareFallback(
    message: string,
    existingConvId?: string,
    isEmergency = false,
    debugReason?: string
  ): ChatResponse {
    const convId = existingConvId || `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const lower = message.toLowerCase();

    let answer = '';

    if (isEmergency) {
      answer = `${EMERGENCY_NOTICE}\n**Immediate Action Needed:** Please seek urgent emergency medical attention right away. Do not rely on digital applications during life-threatening emergencies.`;
    } else if (lower.includes('find a doctor') || lower.includes('find doctor') || lower.includes('specialist') || lower.includes('appointment')) {
      answer = `### 🩺 How to Find & Consult a Doctor on CarePulse:

1. **Search by Specialty or Symptom**: Use the search bar above to type symptoms (*"skin rash"*, *"back pain"*, *"fever"*) or specialties (*Dermatologist*, *Cardiologist*, *General Physician*).
2. **Filter & Select**: Filter by consultation fee, clinic location, years of experience, and patient satisfaction ratings.
3. **Choose Consultation Type**:
   - **Video Consultation**: Connect privately with a verified specialist via video.
   - **Clinic Visit**: Choose a convenient time slot and book a confirmed in-person appointment.
4. **Appointment Confirmation**: You will receive an instant digital confirmation with doctor clinic directions and prep instructions.

*Disclaimer: CarePulse helps you locate verified professionals. All treatment and prescription choices are made directly between you and your licensed healthcare provider.*`;
    } else if (lower.includes('lab test') || lower.includes('blood test') || lower.includes('health checkup')) {
      answer = `### 🧪 Understanding & Booking Lab Tests:

Routine lab tests provide critical diagnostic insights into metabolic health and organ function:

- **Complete Blood Count (CBC)**: Measures red blood cells, white blood cells, and platelets. Evaluates anemia, infections, and immune health.
- **Lipid Profile**: Evaluates total cholesterol, HDL ("good"), LDL ("bad"), and triglycerides for cardiovascular assessment.
- **HbA1c & Fasting Glucose**: Gold standard tests for screening and monitoring diabetes over 3 months.
- **Thyroid Panel (TSH, Free T3, Free T4)**: Evaluates thyroid gland activity.

💡 **Home Sample Collection**: Our certified phlebotomists follow 100% sterile protocols and collect samples directly from your home, with digital reports delivered in 12–24 hours.`;
    } else if (lower.includes('medical term') || lower.includes('explain') || lower.includes('terminology')) {
      answer = `### 📚 Medical Terminology Guide:

Medical terms often sound intimidating because they are derived from Latin and Greek roots:

- **Hypertension**: High blood pressure in the arteries (consistently above 130/80 mmHg).
- **Benign vs. Malignant**: *Benign* refers to non-cancerous conditions; *malignant* indicates cancerous tissue.
- **Acute vs. Chronic**: *Acute* conditions arise suddenly (e.g. sprain); *chronic* conditions persist over 3 months or longer (e.g. asthma, diabetes).

If you have a specific term or lab report metric you'd like explained in plain English, feel free to reply with the exact term!`;
    } else {
      answer = `### 🏥 CarePulse Health Assistant

Hello! I am here to assist your healthcare journey:

1. **Doctor Discovery**: Guiding you to the right medical specialty based on your symptoms (e.g., ENT, Orthopedics, Dermatology).
2. **Lab Diagnostic Guidance**: Explaining routine screenings, fasting requirements, and test meanings.
3. **Medical Terms & Explanations**: Translating medical jargon into simple, patient-friendly concepts.
4. **General Wellness**: Evidence-based healthy habits, preventive screenings, and appointment preparation tips.

*Medical Disclaimer: I am an AI-powered educational assistant and do not provide definitive diagnoses or prescribe medications. For personalized care or severe symptoms, please consult a licensed medical professional.*`;
    }

    return {
      answer,
      conversation_id: convId,
      message_id: `fallback-${Date.now()}`,
      created_at: Math.floor(Date.now() / 1000),
      provider: 'fallback',
      model_used: 'carepulse-medical-fallback',
      isEmergencyAlert: isEmergency,
    };
  }
}

export const chatService = new ChatService();
