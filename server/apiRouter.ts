import { Router, Request, Response } from 'express';
import { chatService } from './chatService.ts';

export const apiRouter = Router();

// In-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // 30 requests per minute

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Mock doctors database inspired by Practo
export const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Arjun Mehta',
    degree: 'MBBS, MD - Dermatology, Venereology & Leprosy',
    specialty: 'Dermatologist',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 540,
    location: 'Koramangala 4th Block, Bangalore',
    city: 'Bangalore',
    hospital: 'Skin & Laser Wellness Center',
    consultationFee: 900,
    availableToday: true,
    nextAvailableSlot: 'Today, 04:30 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    tags: ['Acne Treatment', 'Hair Fall', 'Cosmetic Dermatology'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sen',
    degree: 'MBBS, MS - Obstetrics & Gynaecology',
    specialty: 'Gynecologist',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 680,
    location: '100ft Road, Indiranagar, Bangalore',
    city: 'Bangalore',
    hospital: 'Fortis La Femme',
    consultationFee: 1000,
    availableToday: true,
    nextAvailableSlot: 'Today, 05:15 PM',
    languages: ['English', 'Hindi', 'Bengali', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1594824813515-888914c62c95?auto=format&fit=crop&w=300&q=80',
    tags: ['Pregnancy Care', 'PCOS/PCOD', 'Women Health'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Sharma',
    degree: 'MBBS, MD - General Medicine',
    specialty: 'General Physician',
    experienceYears: 14,
    rating: 4.85,
    reviewCount: 420,
    location: 'HSR Layout Sector 2, Bangalore',
    city: 'Bangalore',
    hospital: 'Apollo Clinic',
    consultationFee: 700,
    availableToday: true,
    nextAvailableSlot: 'Today, 06:00 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    tags: ['Fever & Infections', 'Diabetes Care', 'Hypertension'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajesh Nair',
    degree: 'MBBS, MS - Orthopaedics, Fellowship in Joint Replacement',
    specialty: 'Orthopedist',
    experienceYears: 19,
    rating: 4.8,
    reviewCount: 310,
    location: 'ITPL Main Road, Whitefield, Bangalore',
    city: 'Bangalore',
    hospital: 'Manipal Hospital Whitefield',
    consultationFee: 1100,
    availableToday: false,
    nextAvailableSlot: 'Tomorrow, 10:30 AM',
    languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    tags: ['Knee Pain', 'Joint Replacement', 'Sports Injury'],
  },
  {
    id: 'doc-5',
    name: 'Dr. Sarah Verghese',
    degree: 'MBBS, MD - Pediatrics',
    specialty: 'Pediatrician',
    experienceYears: 13,
    rating: 4.95,
    reviewCount: 460,
    location: '4th Block, Jayanagar, Bangalore',
    city: 'Bangalore',
    hospital: 'Rainbow Children’s Hospital',
    consultationFee: 800,
    availableToday: true,
    nextAvailableSlot: 'Today, 03:45 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
    tags: ['Child Vaccination', 'Newborn Care', 'Growth Assessment'],
  },
  {
    id: 'doc-6',
    name: 'Dr. Vikramaditya Kulkarni',
    degree: 'MBBS, DM - Cardiology',
    specialty: 'Cardiologist',
    experienceYears: 22,
    rating: 4.92,
    reviewCount: 510,
    location: 'Margosa Road, Malleshwaram, Bangalore',
    city: 'Bangalore',
    hospital: 'Aster CMI Hospital',
    consultationFee: 1400,
    availableToday: false,
    nextAvailableSlot: 'Tomorrow, 11:30 AM',
    languages: ['English', 'Hindi', 'Kannada', 'Marathi'],
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
    tags: ['Heart Disease', 'ECG / Echo', 'Preventive Cardiology'],
  },
];

export const LAB_TESTS = [
  {
    id: 'test-1',
    name: 'Comprehensive Full Body Checkup (72 Parameters)',
    category: 'Preventive Health',
    includes: ['CBC', 'Lipid Profile', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)'],
    originalPrice: 2499,
    discountedPrice: 999,
    discountPercent: 60,
    fastingRequired: true,
    fastingHours: '10-12 hours fasting required',
    reportTime: 'Within 24 Hours',
    sampleType: 'Blood & Urine',
    popular: true,
  },
  {
    id: 'test-2',
    name: 'Complete Blood Count (CBC) with ESR',
    category: 'Diagnostic Blood Test',
    includes: ['Hemoglobin', 'RBC Count', 'WBC Total & Differential Count', 'Platelet Count', 'ESR'],
    originalPrice: 450,
    discountedPrice: 299,
    discountPercent: 33,
    fastingRequired: false,
    fastingHours: 'No fasting required',
    reportTime: 'Same Day (6 Hours)',
    sampleType: 'Blood',
    popular: true,
  },
  {
    id: 'test-3',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    category: 'Endocrinology',
    includes: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
    originalPrice: 650,
    discountedPrice: 399,
    discountPercent: 38,
    fastingRequired: false,
    fastingHours: 'Fasting preferred in morning',
    reportTime: 'Within 12 Hours',
    sampleType: 'Blood',
    popular: true,
  },
  {
    id: 'test-4',
    name: 'Lipid Profile Screen (Cardio Risk Assessment)',
    category: 'Cardiology',
    includes: ['Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'VLDL', 'Triglycerides'],
    originalPrice: 850,
    discountedPrice: 499,
    discountPercent: 41,
    fastingRequired: true,
    fastingHours: '12 hours overnight fasting mandatory',
    reportTime: 'Within 12 Hours',
    sampleType: 'Blood',
    popular: false,
  },
  {
    id: 'test-5',
    name: 'HbA1c Glycated Hemoglobin (Diabetes 3-Month Average)',
    category: 'Diabetes Screening',
    includes: ['HbA1c percentage', 'Estimated Average Glucose (eAG)'],
    originalPrice: 600,
    discountedPrice: 380,
    discountPercent: 36,
    fastingRequired: false,
    fastingHours: 'No fasting required',
    reportTime: 'Within 8 Hours',
    sampleType: 'Blood',
    popular: true,
  },
  {
    id: 'test-6',
    name: 'Vitamin D3 & Vitamin B12 Duo',
    category: 'Vitamins & Minerals',
    includes: ['25-Hydroxy Vitamin D3', 'Cyanocobalamin Vitamin B12'],
    originalPrice: 1600,
    discountedPrice: 799,
    discountPercent: 50,
    fastingRequired: false,
    fastingHours: 'No fasting required',
    reportTime: 'Within 24 Hours',
    sampleType: 'Blood',
    popular: true,
  },
];

// In-memory appointments list
const appointmentsStore: Array<{
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  type: 'in-clinic' | 'video';
  status: 'confirmed' | 'pending';
  createdAt: string;
}> = [];

// POST /api/chat - Main chatbot interaction endpoint
apiRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please pause for a moment before sending another message.',
      });
      return;
    }

    const { message, conversationId, userId, modelPreference } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'A non-empty "message" string is required.',
      });
      return;
    }

    if (message.length > 2000) {
      res.status(400).json({
        success: false,
        error: 'Message length exceeds the 2,000 character limit.',
      });
      return;
    }

    const result = await chatService.sendMessage({
      message,
      conversationId,
      userId,
      modelPreference,
    });

    res.json({
      success: true,
      answer: result.answer,
      conversation_id: result.conversation_id,
      message_id: result.message_id,
      created_at: result.created_at,
      provider: result.provider,
      model_used: result.model_used,
      isEmergencyAlert: result.isEmergencyAlert,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[API /api/chat] Error:', errorMsg);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while communicating with the healthcare assistant. Please try again.',
      details: errorMsg,
    });
  }
});

// GET /api/health - Diagnostic status for backend
apiRouter.get('/health', (_req: Request, res: Response) => {
  const status = chatService.getStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CarePulse Healthcare Platform',
    chatbot: status,
  });
});

// GET /api/doctors - Fetch doctor directory (Bangalore active, others coming soon)
apiRouter.get('/doctors', (req: Request, res: Response) => {
  const { specialty, city, query } = req.query;
  const targetCity = (typeof city === 'string' && city) ? city : 'Bangalore';
  const isBangalore = targetCity.toLowerCase() === 'bangalore' || targetCity.toLowerCase() === 'all cities';

  if (!isBangalore) {
    res.json({
      success: true,
      count: 0,
      citySupported: false,
      message: `Doctors in ${targetCity} are launching soon! We currently support verified doctors in Bangalore.`,
      doctors: [],
    });
    return;
  }

  let filtered = [...DOCTORS];

  if (specialty && typeof specialty === 'string' && specialty !== 'All Specialties' && specialty !== 'all') {
    filtered = filtered.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  if (query && typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: filtered.length, citySupported: true, doctors: filtered });
});

// GET /api/lab-tests - Fetch lab test catalog
apiRouter.get('/lab-tests', (_req: Request, res: Response) => {
  res.json({ success: true, count: LAB_TESTS.length, tests: LAB_TESTS });
});

// POST /api/appointments - Book an appointment
apiRouter.post('/appointments', (req: Request, res: Response): Promise<void> => {
  const { doctorId, patientName, patientPhone, patientEmail, date, timeSlot, type } = req.body;

  if (!doctorId || !patientName || !patientPhone || !date || !timeSlot) {
    res.status(400).json({
      success: false,
      error: 'Missing required appointment details (doctorId, patientName, patientPhone, date, timeSlot).',
    });
    return Promise.resolve();
  }

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  if (!doctor) {
    res.status(404).json({ success: false, error: 'Doctor not found.' });
    return Promise.resolve();
  }

  const newAppointment = {
    id: `APT-${Date.now().toString(36).toUpperCase()}`,
    doctorId,
    doctorName: doctor.name,
    patientName,
    patientPhone,
    patientEmail: patientEmail || '',
    date,
    timeSlot,
    type: (type as 'in-clinic' | 'video') || 'in-clinic',
    status: 'confirmed' as const,
    createdAt: new Date().toISOString(),
  };

  appointmentsStore.push(newAppointment);

  res.status(201).json({
    success: true,
    message: 'Appointment scheduled successfully!',
    appointment: newAppointment,
  });
  return Promise.resolve();
});
