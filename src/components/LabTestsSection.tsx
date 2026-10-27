import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Clock,
  ShieldCheck,
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { LabTest } from '../types/index.ts';
import { useChat } from '../context/ChatContext.tsx';

interface LabTestsProps {
  onBookTest: (test: LabTest) => void;
}

export const LabTestsSection: React.FC<LabTestsProps> = ({ onBookTest }) => {
  const { openChat } = useChat();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabTests() {
      try {
        const res = await fetch('/api/lab-tests');
        const data = await res.json();
        if (data.success && Array.isArray(data.tests)) {
          setTests(data.tests);
        }
      } catch (err) {
        console.warn('Could not fetch lab tests:', err);
      } finally {
        setLoading(false);
      }
    }
    void fetchLabTests();
  }, []);

  return (
    <section id="lab-tests" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>NABL Certified Diagnostic Tests</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Diagnostic Lab Tests & Health Checkups
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Safe, sterile home sample collection by trained phlebotomists. Accurate digital reports delivered in 12–24 hours.
            </p>
          </div>

          <button
            onClick={() => openChat('Help me understand what lab test I need for my symptoms')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Need advice on lab tests? Ask AI</span>
          </button>
        </div>

        {/* Home Sample Collection Assurance Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Free Doorstep Pickup</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">On-time certified phlebotomist visit</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Sterile & Barcoded</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero sample mix-up guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rapid Digital Reports</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Available online within 12–24h</p>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading certified lab tests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      {test.category}
                    </span>
                    {test.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {test.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{test.reportTime}</span>
                    </div>
                    <span>•</span>
                    <span>Sample: {test.sampleType}</span>
                  </div>

                  {/* Fasting Requirement */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{test.fastingHours}</span>
                  </div>

                  {/* Included Tests List */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                      Includes {test.includes.length} Key Parameters:
                    </span>
                    <ul className="space-y-1">
                      {test.includes.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {test.includes.length > 4 && (
                        <li className="text-[11px] text-slate-500 dark:text-slate-400 pl-4.5">
                          + {test.includes.length - 4} more parameters
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer and Price */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₹{test.discountedPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2">
                        ₹{test.originalPrice}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {test.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openChat(`Please explain what the test "${test.name}" measures and what the normal ranges mean.`)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                      title="Ask AI to explain test"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                    </button>

                    <button
                      onClick={() => onBookTest(test)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Book Home Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
