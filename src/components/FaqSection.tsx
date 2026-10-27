import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Does the CarePulse AI Assistant replace seeing a doctor?',
    answer:
      'No. The CarePulse AI Assistant is strictly an educational and triaging companion. It helps you understand medical terminology, prepare for consultations, and identify appropriate medical specialties. It cannot provide a definitive diagnosis or replace the hands-on clinical evaluation of a licensed physician.',
  },
  {
    question: 'Can the chatbot prescribe medications or change my prescriptions?',
    answer:
      'Never. Under healthcare safety standards, our AI cannot and will not issue prescription medications, alter dosage schedules, or recommend prescription antibiotics. All prescription therapies must be prescribed directly by a licensed medical practitioner after a formal consultation.',
  },
  {
    question: 'What should I do during an acute medical emergency?',
    answer:
      'If you or someone around you is suffering from severe chest pressure, sudden numbness, difficulty breathing, profuse bleeding, or loss of consciousness, do NOT wait for a digital response. Dial your national emergency helpline immediately (e.g., 112 in India/Europe, 911 in the US/Canada, 999 in the UK) or proceed directly to the nearest hospital casualty emergency ward.',
  },
  {
    question: 'How does home sample collection for lab tests work?',
    answer:
      'Once you book a test, a certified, vaccinated phlebotomist visits your specified home or office address at your selected time slot. All samples are collected using single-use vacuum tubes with unique barcodes. Samples are transported in temperature-controlled carriers to NABL-accredited diagnostic labs, and your digital report is uploaded securely within 12–24 hours.',
  },
  {
    question: 'How is patient data and conversation privacy handled?',
    answer:
      'We treat patient privacy with utmost care. Chat interactions are processed through secure server-side adapters without exposing secret backend keys to the client browser. No personal health records are shared with unverified third parties.',
  },
  {
    question: 'How do I consult a doctor online via video consultation?',
    answer:
      'Select any doctor with "Online Video" availability, choose your preferred slot, and complete the booking. You will receive a secure video consultation link via SMS and email. At the appointed time, click the link to start your confidential, high-definition video call with the doctor.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Learn more about how our healthcare platform, verified doctors, and AI assistant operate.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
