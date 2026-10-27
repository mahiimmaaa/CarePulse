import { DOCTORS } from '../server/apiRouter.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { doctorId, patientName, patientPhone, patientEmail, date, timeSlot, type } = req.body || {};

  if (!doctorId || !patientName || !patientPhone || !date || !timeSlot) {
    return res.status(400).json({
      success: false,
      error: 'Missing required appointment details (doctorId, patientName, patientPhone, date, timeSlot).',
    });
  }

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ success: false, error: 'Doctor not found.' });
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

  return res.status(201).json({
    success: true,
    message: 'Appointment scheduled successfully!',
    appointment: newAppointment,
  });
}
