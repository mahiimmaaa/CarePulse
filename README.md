# CarePulse Healthcare Platform with Integrated AI Chatbot

A Practo-inspired full-stack healthcare web application with doctor discovery, appointment booking, certified doorstep diagnostic lab tests, medical health guides, and a real-time AI healthcare assistant powered by your backend.

---

## 🚀 Features

1. **Modern Practo-Inspired Design**:
   - Clean white background with medical blue and teal accents.
   - Comprehensive navigation bar with logo, city selector (Mumbai, Bangalore, Delhi NCR, Hyderabad, Pune), dark/light mode toggle, and login portal.
   - Prominent search bar for doctors, specialties, clinics, and health conditions with autocomplete suggestions.
   - Hero section with the headline *"Your Health, One Conversation Away"*, subtitle, and direct CTAs.
   - 6 Core Healthcare Service cards: Instant Video Consult, In-Clinic Visits, Lab Tests & Checkups, 24/7 AI Health Assistant, Health Library, and Surgeries Guidance.
   - Doctor Discovery directory: filter by specialty, rating, experience, consultation fee, and "Available Today" status.
   - NABL-certified doorstep lab test catalog with price comparisons and home collection scheduling.
   - Medical knowledge library with expandable clinical takeaways and one-click AI query triggers.
   - Verified patient & doctor testimonials, interactive FAQ accordion, and comprehensive footer.

2. **Full-Featured AI Health Assistant**:
   - Welcome message: *"Hi! I'm your healthcare assistant. How can I help you today?"*
   - Real-time text-based conversation with animated typing indicator.
   - Preserves session history and conversation IDs (`conversation_id`).
   - Suggested quick prompts:
     - *"How can I find a doctor?"*
     - *"Explain a medical term"*
     - *"Help me understand a lab test"*
     - *"Find healthcare information"*
   - Copy response, retry on error, clear conversation history, minimize/expand, and responsive mobile sheet.
   - Medical disclaimer banner & automated emergency symptom detection (advises dialing 112/911/999 immediately).

3. **Secure Backend Integration**:
   - Modular backend adapter in `server/chatService.ts` and API routes in `server/apiRouter.ts`.
   - Connected directly to Dify Chat Messages API (`POST /v1/chat-messages`).
   - Secret API key kept strictly server-side (never exposed to client bundle, browser storage, or network inspector).

---

## 🛠️ Environment Configuration

Set the following environment variables (defined in `.env` / `.env.example`):

| Variable | Default Value | Description |
|---|---|---|
| `CHAT_API_URL` | `https://api.dify.ai/v1` | Base URL of your chatbot backend |
| `CHAT_API_KEY` | `app-pszv9m8ElDoTtnrUWkFeXLHw` | Secret API key for Dify/chatbot provider |
| `PORT` | `3000` | Port for the web server |

---

## 💻 Local Development & Deployment

### 1. Install dependencies:
```bash
npm install
```

### 2. Start Development Server:
```bash
npm run dev
```
Runs Vite on `http://localhost:3000` with the server-side `/api` plugin mounted.

### 3. Build & Run Production Full-Stack Server:
```bash
npm run build
npm run start
```
Starts Express production server serving both the `/api` endpoints and static frontend assets.

---

## 🧪 Testing Checklist

- [x] **Desktop & Mobile Responsiveness**: Verified navbar, hero search, service cards, doctor listings, and chat sheet across all viewport widths.
- [x] **Dark & Light Mode**: Toggled via header icon, persisted in `localStorage`.
- [x] **Chatbot Launch**: Opens from floating button in bottom-right corner and hero CTA buttons.
- [x] **Live Backend Connectivity**: Real responses from Dify API verified via `curl` and frontend interface.
- [x] **Context Preservation**: Verified multi-turn conversations maintain `conversation_id`.
- [x] **Security**: API key verified to never leak to client bundle or client-side HTTP requests.
- [x] **Healthcare Safety**: Prominent medical disclaimers and immediate referral for acute emergency symptoms.
