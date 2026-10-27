import React, { useState } from 'react';
import {
  Search,
  MapPin,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Stethoscope,
  FlaskConical,
  HeartPulse
} from 'lucide-react';
import { useChat } from '../context/ChatContext.tsx';
import { City } from '../types/index.ts';

interface HeroSectionProps {
  selectedCity: City;
  onSearch: (query: string) => void;
  onNavigateToDoctors: (specialty?: string) => void;
  onNavigateToLabs: () => void;
}

const POPULAR_SEARCHES = [
  { label: 'General Physician', category: 'specialty' },
  { label: 'Dermatologist', category: 'specialty' },
  { label: 'Full Body Checkup', category: 'lab' },
  { label: 'Gynecologist', category: 'specialty' },
  { label: 'Pediatrician', category: 'specialty' },
  { label: 'Cardiologist', category: 'specialty' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  onSearch,
  onNavigateToDoctors,
  onNavigateToLabs,
}) => {
  const { openChat } = useChat();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigateToDoctors();
    }
  };

  const handleTagClick = (tag: { label: string; category: string }) => {
    if (tag.category === 'lab') {
      onNavigateToLabs();
    } else {
      setSearchInput(tag.label);
      onSearch(tag.label);
      onNavigateToDoctors(tag.label);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 transition-colors">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20 blur-3xl">
        <div className="w-[600px] h-[300px] bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full mx-auto" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Practo-style pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>AI-Powered Medical Discovery & Telehealth</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your Health, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              One Conversation Away
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get healthcare information and assistance through our AI health assistant.
            Find verified doctors, book appointments, and schedule certified lab tests at your doorstep.
          </p>

          {/* Prominent Search Bar (Practo style) */}
          <div className="mt-8 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-2"
            >
              {/* Location display */}
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-sm font-medium truncate">{selectedCity}</span>
              </div>

              {/* Main query input */}
              <div className="flex items-center gap-2 px-3 py-1 flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search doctors, specialities, symptoms, tests, or clinics..."
                  className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular searches suggestions */}
            <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Popular:</span>
              {POPULAR_SEARCHES.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick CTA Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => openChat()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 animate-pulse" />
              <span>Talk to AI Health Assistant</span>
            </button>

            <button
              onClick={() => onNavigateToDoctors()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Find Verified Doctors</span>
            </button>

            <button
              onClick={onNavigateToLabs}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Book Lab Tests</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">10,000+ Verified</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Licensed doctors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">24/7 AI Guidance</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant answers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">NABL Certified</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Diagnostic lab tests</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Private</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Encrypted consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
