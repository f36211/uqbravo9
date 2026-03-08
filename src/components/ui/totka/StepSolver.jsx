import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import useToTkaStore from "../../../store/useToTkaStore";

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Simple text renderer that optionally renders inline KaTeX if wrapped in $ $
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

export default function StepSolver({ example, index, isMath, topicId }) {
  const [open, setOpen] = useState(false);
  const { stepProgress, updateStepProgress } = useToTkaStore();

  // Example ID could be based on topicId and index
  const exampleId = `${topicId}_ex${index}`;
  const currentStep = stepProgress[exampleId] || 0;

  const handleNextStep = () => {
    if (example.solutionSteps && currentStep < example.solutionSteps.length) {
      updateStepProgress(exampleId, currentStep + 1);
    }
  };

  const isCompleted =
    example.solutionSteps && currentStep >= example.solutionSteps.length;

  return (
    <motion.div
      variants={staggerItem}
      className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-200 dark:hover:border-gray-700 transition-colors bg-white dark:bg-gray-950"
    >
      <div className="p-3 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            {isMath ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <TextWithMath text={example.question} />
              </p>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {example.text}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 sm:px-5 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-medium text-gray-500 dark:text-gray-400"
      >
        <span>
          {open ? "Sembunyikan" : isMath ? "Lihat Jawaban" : "Lihat Penjelasan"}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
              {isMath ? (
                <>
                  {example.answer && (
                    <div className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                      Jawaban: <TextWithMath text={example.answer} />
                    </div>
                  )}
                  {example.solutionSteps && (
                    <div className="space-y-3">
                      {example.solutionSteps
                        .slice(0, currentStep)
                        .map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">
                              <TextWithMath text={step} />
                            </span>
                          </motion.div>
                        ))}

                      {!isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextStep}
                          className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          Tampilkan Langkah Selanjutnya
                        </motion.button>
                      )}
                      {isCompleted && currentStep > 0 && (
                        <div className="text-center text-xs text-green-600 mt-2 font-medium flex justify-center items-center gap-1">
                          <Check size={14} /> Selesai dipelajari
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {example.explanation}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
