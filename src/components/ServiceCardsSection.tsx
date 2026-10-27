import React from 'react';
import {
  Video,
  UserCheck,
  FlaskConical,
  BookOpen,
  Sparkles,
  Scissors,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useChat } from '../context/ChatContext.tsx';

interface ServiceCardsProps {
  onNavigateToDoctors: (specialty?: string) => void;
  onNavigateToLabs: () => void;
  onNavigateToHealthInfo: () => void;
}

export const ServiceCardsSection: React.FC<ServiceCardsProps> = ({
  onNavigateToDoctors,
  onNavigateToLabs,
  onNavigateToHealthInfo,
}) => {
  const { openChat } = useChat();

  const services = [
    {
      id: 'instant-video',
      title: 'Instant Video Consult',
      description: 'Connect with a verified specialist in under 60 seconds from the comfort of your home.',
      icon: Video,
      badge: 'Available Now',
      color: 'teal',
      actionText: 'Consult Online',
      onClick: () => onNavigateToDoctors(),
    },
    {
      id: 'find-doctors',
      title: 'In-Clinic Appointments',
      description: 'Book confirmed, queue-free appointments with verified doctors in top clinics and hospitals.',
      icon: UserCheck,
      badge: 'Zero Wait Time',
      color: 'blue',
      actionText: 'Find Doctors Near You',
      onClick: () => onNavigateToDoctors(),
    },
    {
      id: 'lab-tests',
      title: 'Lab Tests & Checkups',
      description: 'Certified phlebotomists collect blood & urine samples right at your doorstep. Fast digital reports.',
      icon: FlaskConical,
      badge: 'Up to 60% Off',
      color: 'cyan',
      actionText: 'Explore Lab Packages',
      onClick: onNavigateToLabs,
    },
    {
      id: 'ai-assistant',
      title: 'AI Healthcare Assistant',
      description: 'Chat 24/7 with our intelligent health assistant for symptom guidance and lab report explanations.',
      icon: Sparkles,
      badge: '24/7 Live AI',
      color: 'indigo',
      actionText: 'Start AI Conversation',
      onClick: () => openChat(),
    },
    {
      id: 'health-library',
      title: 'Health Information',
      description: 'Read peer-reviewed medical articles, disease management guides, and symptom explanations.',
      icon: BookOpen,
      badge: 'Medically Reviewed',
      color: 'emerald',
      actionText: 'Browse Health Articles',
      onClick: onNavigateToHealthInfo,
    },
    {
      id: 'surgeries',
      title: 'Surgeries & Procedures',
      description: 'End-to-end surgical care, personal care coordinator, and complete cashless insurance assistance.',
      icon: Scissors,
      badge: 'Cashless Support',
      color: 'amber',
      actionText: 'Check Surgery Guidance',
      onClick: () => openChat('Tell me about surgical care, second opinions, and procedure assistance.'),
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Healthcare at Your Fingertips
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From instant AI consultations to confirmed hospital visits and diagnostic tests.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-50/70 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-500/40 dark:hover:border-teal-500/40 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={service.onClick}
                    className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-300 cursor-pointer"
                  >
                    <span>{service.actionText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
