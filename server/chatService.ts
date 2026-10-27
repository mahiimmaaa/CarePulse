/**
 * CarePulse Chat Service
 * Handles communication with Dify chatbot backend and fallback healthcare intelligence
 */

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  message_id?: string;
  created_at?: number;
  provider: 'dify' | 'fallback' | 'gemini';
  isEmergencyAlert?: boolean;
}

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

  constructor() {
    this.difyBaseUrl = process.env.CHAT_API_URL || 'https://api.dify.ai/v1';
    this.difyApiKey = process.env.CHAT_API_KEY || 'app-pszv9m8ElDoTtnrUWkFeXLHw';
  }

  public getStatus() {
    return {
      provider: 'dify',
      configured: Boolean(this.difyApiKey && this.difyApiKey.length > 5),
      baseUrl: this.difyBaseUrl,
      maskedKey: this.difyApiKey
        ? `${this.difyApiKey.substring(0, 7)}...${this.difyApiKey.substring(this.difyApiKey.length - 4)}`
        : 'Not configured',
    };
  }

  public async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const trimmedMessage = request.message.trim();
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) =>
      trimmedMessage.toLowerCase().includes(kw)
    );

    // Call Dify API backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 28000); // 28s timeout

      const endpoint = `${this.difyBaseUrl.replace(/\/+$/, '')}/chat-messages`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.difyApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: trimmedMessage,
          response_mode: 'blocking',
          conversation_id: request.conversationId || '',
          user: request.userId || 'carepulse-patient',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as {
          answer?: string;
          conversation_id?: string;
          id?: string;
          created_at?: number;
        };

        let answer = data.answer || 'Thank you for your inquiry. A healthcare assistant is reviewing your question.';
        if (isEmergency && !answer.toLowerCase().includes('emergency')) {
          answer = `${EMERGENCY_NOTICE}\n${answer}`;
        }

        return {
          answer,
          conversation_id: data.conversation_id || request.conversationId || `conv-${Date.now()}`,
          message_id: data.id || `msg-${Date.now()}`,
          created_at: data.created_at || Math.floor(Date.now() / 1000),
          provider: 'dify',
          isEmergencyAlert: isEmergency,
        };
      }

      const errorText = await response.text();
      console.warn(`[ChatService] Dify API responded with status ${response.status}: ${errorText}`);

      // If Dify returned an error (e.g. 401 unauthorized, 404, or rate limit), use safe intelligent fallback
      return this.generateHealthcareFallback(trimmedMessage, request.conversationId, isEmergency, `Dify API status: ${response.status}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[ChatService] Failed to connect to Dify backend: ${errorMsg}`);
      return this.generateHealthcareFallback(trimmedMessage, request.conversationId, isEmergency, errorMsg);
    }
  }

  /**
   * Safe, evidence-based healthcare educational fallback responses
   * Designed to provide general medical education, explain lab tests, doctors, and terminology
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
      answer = `${EMERGENCY_NOTICE}\n**Immediate Action Needed:** Please seek urgent medical attention right away. Do not rely on digital tools during life-threatening emergencies.`;
    } else if (lower.includes('find a doctor') || lower.includes('find doctor') || lower.includes('specialist') || lower.includes('appointment')) {
      answer = `### 🩺 How to Find & Consult a Doctor on CarePulse:

1. **Search by Specialty or Symptom**: Use the search bar above to type symptoms (e.g., *"skin rash"*, *"back pain"*, *"fever"*) or specialties (e.g., *Dermatologist*, *Cardiologist*, *General Physician*).
2. **Filter & Select**: Filter by consultation fee, clinic location, years of experience, and patient satisfaction ratings.
3. **Choose Consultation Type**:
   - **Video Consultation**: Connect instantly or schedule a 1-on-1 private video call with a verified specialist.
   - **Clinic Visit**: Choose a convenient time slot and book a confirmed in-person appointment.
4. **Appointment Confirmation**: You will receive an instant digital confirmation with doctor clinic directions and prep instructions.

*Disclaimer: CarePulse helps you locate verified professionals. All treatment and prescription choices are made directly between you and your licensed healthcare provider.*`;
    } else if (lower.includes('lab test') || lower.includes('blood test') || lower.includes('health checkup')) {
      answer = `### 🧪 Understanding & Booking Lab Tests:

Routine lab tests provide critical diagnostic insights into metabolic health, organ function, and preventive wellness:

- **Complete Blood Count (CBC)**: Measures red blood cells, white blood cells, and platelets. Evaluates anemia, infections, and immune health.
- **Lipid Profile**: Evaluates total cholesterol, HDL ("good"), LDL ("bad"), and triglycerides for cardiovascular assessment.
- **HbA1c & Fasting Glucose**: Gold standard tests for screening and monitoring prediabetes and type 2 diabetes over 3 months.
- **Thyroid Panel (TSH, Free T3, Free T4)**: Evaluates thyroid gland activity (hypo- or hyper-thyroidism).
- **Kidney & Liver Function Tests (KFT/LFT)**: Assesses BUN, Creatinine, Bilirubin, SGOT, and SGPT.

💡 **Home Sample Collection**: Our certified phlebotomists follow 100% sterile protocols and collect samples directly from your home, with digital reports delivered in 12–24 hours.`;
    } else if (lower.includes('medical term') || lower.includes('explain') || lower.includes('terminology')) {
      answer = `### 📚 Medical Terminology Guide:

Medical terms often sound intimidating because they are derived from Latin and Greek roots:

- **Hypertension**: High blood pressure in the arteries (consistently above 130/80 mmHg).
- **Benign vs. Malignant**: *Benign* refers to non-cancerous conditions that do not spread; *malignant* indicates cancerous tissue capable of invading surrounding structures.
- **Acute vs. Chronic**: *Acute* conditions arise suddenly and resolve relatively quickly (e.g., common cold, sprain); *chronic* conditions persist over 3 months or longer (e.g., asthma, arthritis).
- **Prophylaxis**: Preventive treatment or measures taken to ward off disease.

If you have a specific term or lab report metric you'd like explained in plain English, feel free to reply with the exact term!`;
    } else if (lower.includes('fever') || lower.includes('cold') || lower.includes('headache') || lower.includes('cough')) {
      answer = `### 🌡️ Managing Common Symptoms:

- **Stay Hydrated**: Drink water, herbal teas, broths, or electrolyte solutions to replenish lost fluids.
- **Adequate Rest**: Sleep enables your immune system to repair and generate defensive cytokines.
- **Monitor Vital Signs**: Track body temperature with an oral digital thermometer. Note any chills, stiff neck, or shortness of breath.
- **When to Seek Immediate Care**:
  - High fever exceeding 103°F (39.4°C) or lasting more than 3 consecutive days.
  - Stiff neck, severe light sensitivity, or persistent vomiting.
  - Shortness of breath or chest tightness.

*Note: Never start or alter prescription medications (e.g., antibiotics) without a doctor's consultation. Over-the-counter pain relievers should be taken strictly as directed by packaging or your pharmacist.*`;
    } else {
      answer = `### 🏥 CarePulse Health Assistant

Thank you for your question. Here is how I can support your healthcare journey today:

1. **Doctor Discovery**: Guiding you to the right medical specialty based on your symptoms (e.g., ENT, Orthopedics, Cardiology).
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
      isEmergencyAlert: isEmergency,
    };
  }
}

export const chatService = new ChatService();
