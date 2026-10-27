import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  Clock,
  Home,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Calendar
} from 'lucide-react';
import { LabTest } from '../../types/index.ts';

interface LabTestModalProps {
  test: LabTest | null;
  onClose: () => void;
}

const SAMPLE_SLOTS = [
  '06:30 AM - 07:30 AM (Fasting Preferred)',
  '07:30 AM - 08:30 AM (Fasting Preferred)',
  '08:30 AM - 09:30 AM',
  '10:00 AM - 11:30 AM',
  '04:00 PM - 05:30 PM',
];

export const LabTestModal: React.FC<LabTestModalProps> = ({ test, onClose }) => {
  if (!test) return null;

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(SAMPLE_SLOTS[1]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !address.trim()) return;

    setBookingId(`LAB-${Date.now().toString(36).toUpperCase()}`);
    setBookingConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {bookingConfirmed ? 'Lab Test Scheduled!' : 'Book Home Sample Collection'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NABL Certified Diagnostic Partner
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {bookingConfirmed ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Booking ID: {bookingId}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                A certified phlebotomist will arrive at your home during the selected slot.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Package:</span>
                  <strong className="text-slate-900 dark:text-white truncate max-w-[220px]">
                    {test.name}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Slot:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlot}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Doorstep Address:</span>
                  <strong className="text-slate-900 dark:text-white truncate max-w-[200px]">{address}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Digital Report:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{test.reportTime}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Payable at Collection:</span>
                  <strong className="text-cyan-600 dark:text-cyan-400">₹{test.discountedPrice}</strong>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Test summary card */}
              <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {test.name}
                  </h4>
                  <p className="text-[11px] text-cyan-800 dark:text-cyan-300 mt-0.5">
                    {test.fastingHours} • Digital report {test.reportTime}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ₹{test.discountedPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through block">
                    ₹{test.originalPrice}
                  </span>
                </div>
              </div>

              {/* Home collection slot picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Phlebotomist Arrival Slot
                </label>
                <div className="space-y-1.5">
                  {SAMPLE_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        selectedSlot === slot
                          ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/50 text-cyan-900 dark:text-cyan-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="lab-slot"
                          checked={selectedSlot === slot}
                          onChange={() => setSelectedSlot(slot)}
                          className="w-3.5 h-3.5 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{slot}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Patient Contact Info */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Suman Sen"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Complete Pickup Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat/House no., Apartment name, Street, Landmark, Pincode"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm Free Doorstep Sample Pickup
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Sample collected in 100% sterile barcoded vacuum tubes.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
