import React from 'react';
import { Activity, ShieldCheck, HeartPulse, PhoneCall, AlertCircle, Mail, MapPin } from 'lucide-react';
import { useChat } from '../context/ChatContext.tsx';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectSpecialty: (specialty: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectSpecialty }) => {
  const { openChat } = useChat();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Healthcare Safety & Emergency Notice Box */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 text-red-400 border border-red-800/80 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Emergency Medical Notice & General Disclaimer</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-3xl">
                CarePulse provides healthcare information, appointment scheduling, and AI-assisted educational guidance. It is NOT a replacement for qualified in-person medical evaluation, diagnosis, or emergency intervention. If experiencing severe chest pain, breathing difficulties, stroke symptoms, or acute trauma, dial emergency services (<strong>112</strong> / <strong>911</strong> / <strong>999</strong>) immediately.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-400">Emergency Helpline:</span>
            <span className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 font-bold border border-red-500/30 text-xs">
              112 / 108
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CarePulse</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              Your trusted Practo-inspired healthcare companion. Connecting patients with verified medical doctors, certified doorstep diagnostic testing, and 24/7 intelligent AI assistance.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>NABL Partnered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-cyan-400" />
                <span>Verified Practitioners</span>
              </span>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Specialties</h5>
            <ul className="space-y-2 text-xs">
              {['General Physician', 'Dermatologist', 'Gynecologist', 'Pediatrician', 'Orthopedist', 'Cardiologist'].map(
                (spec) => (
                  <li key={spec}>
                    <button
                      onClick={() => {
                        onSelectSpecialty(spec);
                        onNavigate('doctors');
                      }}
                      className="hover:text-teal-400 transition-colors cursor-pointer text-left"
                    >
                      {spec}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Platform Services */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Doctor Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Online Video Consults
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lab-tests')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Doorstep Lab Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => openChat()}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  AI Health Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('health-info')}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Medical Library
                </button>
              </li>
            </ul>
          </div>

          {/* Cities & Support */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Cities</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Mumbai</li>
              <li>Bangalore</li>
              <li>Delhi NCR</li>
              <li>Hyderabad</li>
              <li>Pune</li>
              <li>Chennai</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CarePulse Healthcare Prototype. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Editorial Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">HIPAA & Consent</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
