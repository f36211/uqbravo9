import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Star,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Target,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import FormulaCard from "./FormulaCard";
import QuickQuiz from "./QuickQuiz";
import StepSolver from "./StepSolver";

// Helper to render lucide icon dynamically
const DynamicIcon = ({ name, size = 24, className = "" }) => {
  const IconComponent = LucideIcons[name];
  if (!IconComponent) return <BookOpen size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

// Text renderer with inline math support
const TextWithMath = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export default function ContentArea({
  topic,
  goNext,
  goPrev,
  canGoNext,
  canGoPrev,
  nextLabel,
  prevLabel,
  subjectId,
}) {
  if (!topic) return null;

  return (
    <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-gray-950 scroll-smooth relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <header className="mb-10 sm:mb-14 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mx-auto sm:mx-0">
                <Target size={14} />
                Materi {subjectId}
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-tight mb-4">
              {topic.title}
            </h1>
          </header>

          {/* Core Content */}
          {topic.content && (
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-10 text-[15px] sm:text-base">
              <TextWithMath text={topic.content} />
            </div>
          )}

          {/* Formulas Context */}
          {topic.formulas && topic.formulas.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900 dark:bg-gray-50" />
                Rumus Penting
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topic.formulas.map((f, i) => (
                  <FormulaCard key={i} formula={f} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Key Points */}
          {topic.keyPoints && topic.keyPoints.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900 dark:bg-gray-50" />
                Konsep Utama
              </h2>
              <ul className="space-y-3">
                {topic.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-gray-700 dark:text-gray-300 text-[15px] sm:text-base bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800"
                  >
                    <Star
                      className="text-yellow-400 flex-shrink-0 mt-0.5"
                      size={18}
                      fill="currentColor"
                    />
                    <span className="leading-relaxed">
                      <TextWithMath text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Examples (Step Solver) */}
          {topic.examples && topic.examples.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900 dark:bg-gray-50" />
                Contoh Soal
              </h2>
              <div className="space-y-6">
                {topic.examples.map((ex, i) => (
                  <StepSolver
                    key={i}
                    example={ex}
                    index={i}
                    isMath={subjectId === "mtk"}
                    topicId={topic.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tips */}
          {topic.tips && topic.tips.length > 0 && (
            <section className="mb-12">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 sm:p-6">
                <h2 className="text-xs font-bold text-amber-900 dark:text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Lightbulb size={16} />
                  Tips & Trik Cepat
                </h2>
                <ul className="space-y-3">
                  {topic.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-amber-800 dark:text-amber-200/80 text-[15px] sm:text-base"
                    >
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-600 mt-2" />
                      <span className="leading-relaxed">
                        <TextWithMath text={tip} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Quick Quiz */}
          {topic.quiz && topic.quiz.length > 0 && (
            <QuickQuiz quiz={topic.quiz} topicId={topic.id} />
          )}
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 md:left-[20rem] right-0 p-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-20 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                canGoPrev
                  ? "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-gray-300 dark:text-gray-700 cursor-not-allowed"
              }`}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">{prevLabel}</span>
        </button>
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${
                canGoNext
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
        >
          <span>{nextLabel}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </main>
  );
}
