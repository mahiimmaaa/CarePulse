import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { Doctor, Appointment } from '../../types/index.ts';

interface AppointmentModalProps {
  doctor: Doctor | null;
  initialType?: 'in-clinic' | 'video';
  onClose: () => void;
}

const AVAILABLE_DATES = [
  { label: 'Today', date: '2026-10-27', sub: 'Oct 27' },
  { label: 'Tomorrow', date: '2026-10-28', sub: 'Oct 28' },
  { label: 'Day After', date: '2026-10-29', sub: 'Oct 29' },
];

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '02:30 PM',
  '04:15 PM',
  '05:30 PM',
  '06:45 PM',
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  doctor,
  initialType = 'in-clinic',
  onClose,
}) => {
  if (!doctor) return null;

  const [appointmentType, setAppointmentType] = useState<'in-clinic' | 'video'>(initialType);
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0].date);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setErrorMessage('Please fill in your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          patientName,
          patientPhone,
          patientEmail,
          date: selectedDate,
          timeSlot: selectedSlot,
          type: appointmentType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to book appointment.');
      }

      setConfirmedAppointment(data.appointment);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error scheduling appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {confirmedAppointment ? 'Appointment Confirmed!' : 'Book Doctor Consultation'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {doctor.name} • {doctor.specialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {confirmedAppointment ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Booking ID: {confirmedAppointment.id}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                Your {confirmedAppointment.type === 'video' ? 'online video consultation' : 'in-clinic visit'} with{' '}
                <strong>{doctor.name}</strong> is confirmed.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Date & Time:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Patient Name:</span>
                  <strong className="text-slate-900 dark:text-white">{confirmedAppointment.patientName}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Consultation Type:</span>
                  <strong className="text-slate-900 dark:text-white capitalize">
                    {confirmedAppointment.type}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Clinic / Hospital:</span>
                  <strong className="text-slate-900 dark:text-white truncate max-w-[200px]">
                    {doctor.hospital}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Consultation Fee:</span>
                  <strong className="text-teal-600 dark:text-teal-400">₹{doctor.consultationFee}</strong>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setAppointmentType('in-clinic')}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    appointmentType === 'in-clinic'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>In-Clinic Visit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentType('video')}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    appointmentType === 'video'
                      ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online Video</span>
                </button>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_DATES.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => setSelectedDate(item.date)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDate === item.date
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs'
                      }`}
                    >
                      <span className="block text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Contact Info */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reason for Visit / Symptoms
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly describe what symptoms you'd like the doctor to review..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <span>Confirm Consultation (₹{doctor.consultationFee})</span>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  No advance payment needed. Pay directly at clinic or during video consultation.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
