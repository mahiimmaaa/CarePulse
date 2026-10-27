import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useChat } from '../context/ChatContext.tsx';

interface HealthArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  keyPoints: string[];
  aiPrompt: string;
}

const ARTICLES: HealthArticle[] = [
  {
    id: 'cholesterol-guide',
    title: 'Deciphering Your Lipid Panel: HDL, LDL, and Heart Health',
    category: 'Cardiovascular Wellness',
    readTime: '4 min read',
    summary:
      'Cholesterol is essential for building cells and producing hormones, but imbalanced lipid levels are a primary risk factor for atherosclerosis.',
    keyPoints: [
      'LDL ("bad" cholesterol): optimal level is typically under 100 mg/dL.',
      'HDL ("good" cholesterol): protective against plaque; optimal is above 50 mg/dL.',
      'Triglycerides: should generally stay below 150 mg/dL through balanced nutrition.',
    ],
    aiPrompt: 'Explain how diet and exercise influence HDL and LDL cholesterol levels.',
  },
  {
    id: 'hypertension-guide',
    title: 'Understanding Blood Pressure Numbers & Daily Management',
    category: 'Preventive Care',
    readTime: '5 min read',
    summary:
      'High blood pressure (hypertension) often progresses with zero noticeable symptoms until organ strain develops. Regular monitoring is key.',
    keyPoints: [
      'Normal systolic/diastolic reading is below 120/80 mmHg.',
      'Stage 1 Hypertension starts at 130–139 systolic or 80–89 diastolic.',
      'Reducing sodium, managing chronic stress, and 30 min daily walking show proven benefits.',
    ],
    aiPrompt: 'What are the main causes and non-drug management strategies for high blood pressure?',
  },
  {
    id: 'fever-warning-signs',
    title: 'Seasonal Fevers & Respiratory Infections: When to See a Doctor',
    category: 'Infectious Disease',
    readTime: '3 min read',
    summary:
      'Fever is a natural immune response to pathogens, but certain red-flag symptoms require immediate clinical evaluation.',
    keyPoints: [
      'Seek prompt care if temperature exceeds 103°F (39.4°C) or lasts over 72 hours.',
      'Stiff neck, light sensitivity, or sudden breathlessness are urgent warning signs.',
      'Stay hydrated with electrolytes and avoid taking unprescribed antibiotics.',
    ],
    aiPrompt: 'What are red flag symptoms of a viral infection that require emergency evaluation?',
  },
  {
    id: 'diabetes-hba1c-guide',
    title: 'Demystifying HbA1c: The 3-Month Blood Sugar Gold Standard',
    category: 'Endocrinology',
    readTime: '4 min read',
    summary:
      'Unlike single-point fasting glucose tests, HbA1c measures glucose attached to hemoglobin over the average 120-day lifespan of red blood cells.',
    keyPoints: [
      'Normal HbA1c is below 5.7%.',
      'Prediabetes is identified between 5.7% and 6.4%.',
      'Diabetes threshold is 6.5% or higher on two separate tests.',
    ],
    aiPrompt: 'How can someone with prediabetes lower their HbA1c through lifestyle changes?',
  },
];

export const HealthInformationSection: React.FC = () => {
  const { openChat } = useChat();
  const [expandedId, setExpandedId] = useState<string | null>('cholesterol-guide');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="health-info" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evidence-Based Medical Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Health Guides & Medical Education
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Clear, medically reviewed insights to help you understand health metrics, conditions, and prevention.
            </p>
          </div>

          <button
            onClick={() => openChat('Explain common medical abbreviations and test terminology in simple words')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ask AI Medical Questions</span>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article) => {
            const isExpanded = expandedId === article.id;
            return (
              <div
                key={article.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {article.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Expandable Key Points */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Clinical Takeaways:
                      </span>
                      {article.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {isExpanded ? 'Show Less' : 'View Key Points'}
                  </button>

                  <button
                    onClick={() => openChat(article.aiPrompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI About This</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical disclaimer strip */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Note on Medical Information:</strong> Content is compiled for general health literacy and patient education only. It does not constitute individual diagnostic consultation or treatment prescriptions. Always seek advice from a licensed medical practitioner for personalized healthcare decisions.
          </p>
        </div>
      </div>
    </section>
  );
};
