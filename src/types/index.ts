export interface Doctor {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  hospital: string;
  consultationFee: number;
  availableToday: boolean;
  nextAvailableSlot: string;
  languages: string[];
  avatar: string;
  tags: string[];
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  includes: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  fastingRequired: boolean;
  fastingHours: string;
  reportTime: string;
  sampleType: string;
  popular: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isEmergencyAlert?: boolean;
  provider?: 'dify' | 'fallback' | 'gemini';
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  date: string;
  timeSlot: string;
  type: 'in-clinic' | 'video';
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export type City = 'All Cities' | 'Mumbai' | 'Bangalore' | 'Delhi NCR' | 'Hyderabad' | 'Pune';
