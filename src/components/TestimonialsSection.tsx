import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya Deshmukh',
    role: 'Patient, Mumbai',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    comment:
      'I was confused about which specialist to visit for chronic joint pain. The CarePulse AI assistant guided me to an Orthopedist and explained what diagnostic scans might be needed. The clinic booking was completely hassle-free!',
    service: 'Doctor Appointment & AI Triaging',
  },
  {
    id: 2,
    name: 'Rohit K. Verma',
    role: 'Patient, Bangalore',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    comment:
      'Home blood collection for my parents’ full body checkup was executed smoothly. The phlebotomist arrived right at 7:30 AM with a sterile kit, and reports were available online before midnight. Exceptional experience.',
    service: 'Home Lab Test & Health Checkup',
  },
  {
    id: 3,
    name: 'Dr. Sameer Patel',
    role: 'Cardiologist, Delhi NCR',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
    comment:
      'CarePulse provides a remarkably organized patient intake workflow. Patients come in better informed about their symptoms, which makes the in-clinic consultation far more productive.',
    service: 'Verified Doctor Partner',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Patient Stories & Doctor Trust
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trusted by Thousands Across the Country
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Real feedback from patients and medical professionals using CarePulse daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                />
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                    <span>{item.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
