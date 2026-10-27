import React, { useState } from 'react';
import { X, User, Stethoscope, Phone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otp, setOtp] = useState(['4', '8', '2', '1']);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 8) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('phone');
      setPhoneNumber('');
    }, 1500);
  };

  const handleDemoLogin = (userRole: 'patient' | 'doctor') => {
    setRole(userRole);
    setPhoneNumber('+91 98765 00000');
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('phone');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {role === 'patient' ? 'Patient Portal' : 'Doctor Practice Portal'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-5">
            <button
              onClick={() => {
                setRole('patient');
                setStep('phone');
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'patient'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Patients</span>
            </button>
            <button
              onClick={() => {
                setRole('doctor');
                setStep('phone');
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'doctor'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>For Doctors</span>
            </button>
          </div>

          {step === 'success' ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Successfully Logged In!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Welcome back to CarePulse Healthcare.
              </p>
            </div>
          ) : step === 'otp' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter 4-digit verification code sent to <strong>{phoneNumber}</strong>
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Change Phone Number
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Instant 1-Click Demo Login */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-2">Or test instantly:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('patient')}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Demo Patient Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('doctor')}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Demo Doctor Login
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Encrypted session with HIPAA & data privacy compliance</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
