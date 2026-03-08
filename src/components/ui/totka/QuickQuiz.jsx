import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { InlineMath, BlockMath } from "react-katex";
import useToTkaStore from "../../../store/useToTkaStore";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

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

export default function QuickQuiz({ quiz, topicId }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [shake, setShake] = useState(null); // qIdx that is shaking

  const { recordMistake } = useToTkaStore();

  const handleSelect = (qIdx, oIdx) => {
    if (revealed[qIdx] !== undefined) return;
    setAnswers((p) => ({ ...p, [qIdx]: oIdx }));
  };

  const handleReveal = (qIdx) => {
    if (answers[qIdx] === undefined) return;
    setRevealed((p) => ({ ...p, [qIdx]: true }));

    // Check if wrong -> trigger shake & mistake log
    const isCorrect = answers[qIdx] === quiz[qIdx].correctAnswer;
    if (!isCorrect) {
      setShake(qIdx);
      setTimeout(() => setShake(null), 500);
      recordMistake(topicId, qIdx);
    }
  };

  const checkAll = () => {
    const onlyAnswered = {};
    let allCorrect = true;
    let anyAnswered = false;

    quiz.forEach((q, i) => {
      if (answers[i] !== undefined) {
        onlyAnswered[i] = true;
        anyAnswered = true;
        if (answers[i] !== q.correctAnswer) {
          allCorrect = false;
          recordMistake(topicId, i);
        }
      }
    });

    setRevealed(onlyAnswered);
    setShowResults(true);

    if (
      allCorrect &&
      anyAnswered &&
      Object.keys(onlyAnswered).length === quiz.length
    ) {
      triggerConfetti();
    }
  };

  const retry = () => {
    setAnswers({});
    setRevealed({});
    setShowResults(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const score = useMemo(
    () =>
      quiz.reduce((s, q, i) => s + (answers[i] === q.correctAnswer ? 1 : 0), 0),
    [answers, quiz],
  );

  const answeredCount = Object.keys(answers).length;
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <motion.section
      className="mb-10"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-gray-900 dark:bg-gray-100" />
        Latihan Soal Cepat
      </h2>

      <div className="space-y-4">
        {quiz.map((q, qIdx) => {
          const isRevealed = revealed[qIdx];
          const isCorrect = answers[qIdx] === q.correctAnswer;
          const isShaking = shake === qIdx;

          return (
            <motion.div
              key={qIdx}
              variants={staggerItem}
              animate={
                isShaking
                  ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
                  : { x: 0 }
              }
              className={`border rounded-xl overflow-hidden transition-colors ${
                isRevealed && isCorrect
                  ? "border-green-200 dark:border-green-800"
                  : isRevealed && !isCorrect
                    ? "border-red-200 dark:border-red-900"
                    : "border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="p-3 sm:p-5">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                    <TextWithMath text={q.question} />
                  </p>
                </div>

                <div className="space-y-2 ml-0 sm:ml-10">
                  {q.options.map((opt, oIdx) => {
                    const selected = answers[qIdx] === oIdx;
                    const isCorrectOpt = q.correctAnswer === oIdx;

                    let optClass =
                      "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300";

                    if (selected && !isRevealed)
                      optClass =
                        "border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-900 dark:ring-gray-100 text-gray-900 dark:text-gray-100";
                    if (isRevealed && isCorrectOpt)
                      optClass =
                        "border-green-500 bg-green-50 dark:bg-green-900/30 ring-1 ring-green-500 text-green-700 dark:text-green-300";
                    if (isRevealed && selected && !isCorrectOpt)
                      optClass =
                        "border-red-400 bg-red-50 dark:bg-red-900/30 ring-1 ring-red-400 text-red-700 dark:text-red-300";

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        disabled={isRevealed}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${optClass} disabled:cursor-default`}
                      >
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${selected && !isRevealed ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900" : ""}
                          ${isRevealed && isCorrectOpt ? "bg-green-500 text-white" : ""}
                          ${isRevealed && selected && !isCorrectOpt ? "bg-red-400 text-white" : ""}
                          ${!selected && !isRevealed ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" : ""}
                          ${!selected && isRevealed && !isCorrectOpt ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500" : ""}
                        `}
                        >
                          {isRevealed && isCorrectOpt ? (
                            <Check size={12} />
                          ) : (
                            optionLabels[oIdx]
                          )}
                        </span>
                        <span>
                          <TextWithMath text={opt} />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {answers[qIdx] !== undefined && !isRevealed && (
                  <div className="mt-3 ml-0 sm:ml-10">
                    <button
                      onClick={() => handleReveal(qIdx)}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cek Jawaban
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`mt-3 ml-0 sm:ml-10 p-3 rounded-lg text-sm border ${
                          isCorrect
                            ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-100 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-100 dark:border-red-800"
                        }`}
                      >
                        <span className="font-semibold block mb-1">
                          {isCorrect ? "✅ Benar! " : "❌ Salah. "}
                        </span>
                        <TextWithMath text={q.explanation} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {answeredCount > 0 && !showResults && (
          <div className="flex items-center gap-3">
            <button
              onClick={checkAll}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Cek Semua Jawaban
            </button>
            {answeredCount < quiz.length && (
              <span className="text-xs text-gray-400">
                {answeredCount}/{quiz.length} dijawab
              </span>
            )}
          </div>
        )}
        {showResults && (
          <div className="flex items-center gap-4">
            <div
              className={`text-sm font-semibold px-3 py-1.5 rounded-lg
              ${
                score === answeredCount && answeredCount === quiz.length
                  ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                  : score >= answeredCount / 2
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300"
                    : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
              }`}
            >
              Skor: {score}/{answeredCount}
              {answeredCount < quiz.length && (
                <span className="text-xs font-normal ml-1 opacity-70">
                  ({quiz.length - answeredCount} dilewati)
                </span>
              )}
            </div>
            <button
              onClick={retry}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              🔄 Ulangi
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
