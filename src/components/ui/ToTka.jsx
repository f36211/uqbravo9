import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mtkData from "@/data/mtk.json";
import bindoData from "@/data/bindo.json";

// ═══════════════════════════════════════
//  MathJax Hook — re-typeset on changes
//  FIX #3: Use a counter ref instead of dynamic deps array
// ═══════════════════════════════════════
function useMathJax(trigger) {
  useEffect(() => {
    const id = setTimeout(() => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      }
    }, 100);
    return () => clearTimeout(id);
  }, [trigger]);
}

// ═══════════════════════════════════════
//  Animation Variants
// ═══════════════════════════════════════
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

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

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease: "easeOut" } },
};

const sidebarItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
};

// ═══════════════════════════════════════
//  Icons
// ═══════════════════════════════════════
const ArrowLeft = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);
const ChevronDown = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const ChevronRight = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const BookOpen = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const Menu = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const X = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const Check = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ═══════════════════════════════════════
//  LANDING VIEW
// ═══════════════════════════════════════
function LandingView({ onSelect }) {
  const subjects = [
    { key: "mtk", data: mtkData, gradient: "from-gray-900 to-gray-700" },
    { key: "bindo", data: bindoData, gradient: "from-gray-800 to-gray-600" },
  ];

  const totalTopics = (d) =>
    d.chapters.reduce((s, c) => s + c.topics.length, 0);

  return (
    <motion.div
      key="landing"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-16"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        className="text-center mb-8 sm:mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium tracking-wide uppercase mb-6">
          <BookOpen size={14} />
          Persiapan Ujian
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-3 sm:mb-4">
          Belajar TO TKA
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto font-light">
          Rangkuman materi lengkap untuk tryout Test Kemampuan Akademik
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {subjects.map(({ key, data, gradient }) => (
          <motion.div
            key={key}
            variants={staggerItem}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <motion.button
              variants={cardHover}
              onClick={() => onSelect(key)}
              className={`w-full text-left rounded-2xl bg-gradient-to-br ${gradient} p-5 sm:p-8 text-white cursor-pointer
                shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden`}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 transition-colors duration-500" />
              <span className="text-4xl mb-4 block relative z-10">
                {data.icon}
              </span>
              <h2 className="text-2xl font-bold mb-2 relative z-10">
                {data.subject}
              </h2>
              <p className="text-white/60 text-sm mb-6 relative z-10">
                {data.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-white/50 relative z-10">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  {data.chapters.length} Bab
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  {totalTopics(data)} Topik
                </span>
              </div>
              <div
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1"
              >
                <ChevronRight size={18} />
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="mt-8 sm:mt-12 text-gray-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Pilih mata pelajaran untuk mulai belajar ✨
      </motion.p>
    </motion.div>
  );
}

// ═══════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════
function Sidebar({ data, chapterIdx, topicIdx, onNavigate, isOpen, onClose }) {
  const [expandedChapters, setExpandedChapters] = useState(
    new Set([chapterIdx]),
  );

  const toggleChapter = (idx) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  useEffect(() => {
    setExpandedChapters((prev) => new Set([...prev, chapterIdx]));
  }, [chapterIdx]);

  const totalTopicsBeforeChapter = useCallback(
    (cIdx) =>
      data.chapters.slice(0, cIdx).reduce((s, c) => s + c.topics.length, 0),
    [data],
  );
  const totalTopics = data.chapters.reduce((s, c) => s + c.topics.length, 0);
  const currentGlobalIdx = totalTopicsBeforeChapter(chapterIdx) + topicIdx + 1;

  const sidebarContent = (
    <motion.nav
      className="h-full flex flex-col"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{data.icon}</span>
          <span className="font-semibold text-gray-900 text-sm">
            {data.subject}
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md hover:bg-gray-100 text-gray-400"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {data.chapters.map((chapter, cIdx) => (
          <motion.div key={cIdx} variants={sidebarItemVariants}>
            <button
              onClick={() => toggleChapter(cIdx)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors
                ${cIdx === chapterIdx ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <motion.span
                animate={{ rotate: expandedChapters.has(cIdx) ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronRight size={14} />
              </motion.span>
              <span className="truncate">{chapter.title}</span>
              <span
                className={`ml-auto text-xs px-1.5 py-0.5 rounded-md
                ${cIdx === chapterIdx ? "bg-white/20" : "bg-gray-100 text-gray-400"}`}
              >
                {chapter.topics.length}
              </span>
            </button>

            <AnimatePresence>
              {expandedChapters.has(cIdx) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {chapter.topics.map((topic, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => {
                          onNavigate(cIdx, tIdx);
                          onClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all
                          ${
                            cIdx === chapterIdx && tIdx === topicIdx
                              ? "bg-gray-100 text-gray-900 font-semibold"
                              : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 mb-1.5">
          Topik {currentGlobalIdx} dari {totalTopics}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <motion.div
            className="bg-gray-900 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentGlobalIdx / totalTopics) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.nav>
  );

  return (
    <>
      <aside className="hidden md:flex md:w-72 lg:w-80 border-r border-gray-100 bg-white flex-shrink-0 flex-col h-full overflow-hidden">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-80 bg-white shadow-2xl z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════
//  FORMULA CARD
// ═══════════════════════════════════════
function FormulaCard({ formula, index }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 group hover:border-gray-200 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
          {formula.name}
        </span>
        <span className="text-[10px] text-gray-300 font-mono">
          #{index + 1}
        </span>
      </div>
      {/* LaTeX rendered by MathJax after mount */}
      <div className="text-center py-3 sm:py-4 text-base sm:text-lg overflow-x-auto">
        {`$$${formula.latex}$$`}
      </div>
      {formula.note && (
        <p className="text-xs text-gray-400 mt-2 pt-3 border-t border-gray-100 leading-relaxed">
          💡 {formula.note}
        </p>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════
//  EXAMPLE CARD
//  FIX #5: open state reset via key prop (applied by parent)
// ═══════════════════════════════════════
function ExampleCard({ example, index, isMath }) {
  const [open, setOpen] = useState(false);
  useMathJax(open);

  return (
    <motion.div
      variants={staggerItem}
      className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors"
    >
      <div className="p-3 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            {isMath ? (
              <p className="text-sm text-gray-700 leading-relaxed">
                {example.question}
              </p>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {example.text}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 sm:px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-gray-500"
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
            <div className="p-3 sm:p-5 bg-gray-50 border-t border-gray-100">
              {isMath ? (
                <>
                  {example.answer && (
                    <div className="mb-3 text-sm font-semibold text-gray-900">
                      Jawaban: {example.answer}
                    </div>
                  )}
                  {example.solutionSteps && (
                    <div className="space-y-2">
                      {example.solutionSteps.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-gray-600"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
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

// ═══════════════════════════════════════
//  QUIZ SECTION
//  FIX #4: Reset via key prop (applied by parent)
//  FIX #6: checkAll only reveals answered questions; unanswered shown as skipped
//  FIX #7: "Cek Semua" appears after any answer, not only when all answered
//  FIX #8: score memoized
//  FIX #12: removed unused isMath prop
// ═══════════════════════════════════════
function QuizSection({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showResults, setShowResults] = useState(false);

  useMathJax(`${Object.keys(revealed).length}-${showResults}`);

  const selectAnswer = (qIdx, optIdx) => {
    if (revealed[qIdx] !== undefined) return;
    setAnswers((p) => ({ ...p, [qIdx]: optIdx }));
  };

  const revealAnswer = (qIdx) => {
    if (answers[qIdx] === undefined) return;
    setRevealed((p) => ({ ...p, [qIdx]: true }));
  };

  // FIX #6 & #7: Only reveal questions that have been answered
  const checkAll = () => {
    const onlyAnswered = {};
    quiz.forEach((_, i) => {
      if (answers[i] !== undefined) onlyAnswered[i] = true;
    });
    setRevealed(onlyAnswered);
    setShowResults(true);
  };

  const retry = () => {
    setAnswers({});
    setRevealed({});
    setShowResults(false);
  };

  // FIX #8: memoize score
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
      <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-gray-900" />
        Latihan Soal
      </h2>

      <div className="space-y-4">
        {quiz.map((q, qIdx) => {
          const isRevealed = revealed[qIdx];
          const isCorrect = answers[qIdx] === q.correctAnswer;

          return (
            <motion.div
              key={qIdx}
              variants={staggerItem}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div className="p-3 sm:p-5">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-2 ml-0 sm:ml-10">
                  {q.options.map((opt, oIdx) => {
                    const selected = answers[qIdx] === oIdx;
                    const isCorrectOpt = q.correctAnswer === oIdx;
                    let optClass =
                      "border-gray-100 hover:border-gray-300 hover:bg-gray-50";
                    if (selected && !isRevealed)
                      optClass =
                        "border-gray-900 bg-gray-50 ring-1 ring-gray-900";
                    if (isRevealed && isCorrectOpt)
                      optClass =
                        "border-green-500 bg-green-50 ring-1 ring-green-500";
                    if (isRevealed && selected && !isCorrectOpt)
                      optClass = "border-red-400 bg-red-50 ring-1 ring-red-400";

                    return (
                      <button
                        key={oIdx}
                        onClick={() => selectAnswer(qIdx, oIdx)}
                        disabled={isRevealed}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${optClass} disabled:cursor-default`}
                      >
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${selected && !isRevealed ? "bg-gray-900 text-white" : ""}
                          ${isRevealed && isCorrectOpt ? "bg-green-500 text-white" : ""}
                          ${isRevealed && selected && !isCorrectOpt ? "bg-red-400 text-white" : ""}
                          ${!selected && !isRevealed ? "bg-gray-100 text-gray-500" : ""}
                          ${!selected && isRevealed && !isCorrectOpt ? "bg-gray-100 text-gray-400" : ""}
                        `}
                        >
                          {isRevealed && isCorrectOpt ? (
                            <Check size={12} />
                          ) : (
                            optionLabels[oIdx]
                          )}
                        </span>
                        <span
                          className={
                            isRevealed && !isCorrectOpt && !selected
                              ? "text-gray-400"
                              : "text-gray-700"
                          }
                        >
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {answers[qIdx] !== undefined && !isRevealed && (
                  <div className="mt-3 ml-0 sm:ml-10">
                    <button
                      onClick={() => revealAnswer(qIdx)}
                      className="text-xs font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
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
                        className={`mt-3 ml-0 sm:ml-10 p-3 rounded-lg text-sm ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                      >
                        <span className="font-semibold">
                          {isCorrect ? "✅ Benar! " : "❌ Salah. "}
                        </span>
                        {q.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FIX #7: Show "Cek Semua" as soon as at least one answer is given */}
      <div className="mt-4 flex items-center justify-between">
        {answeredCount > 0 && !showResults && (
          <div className="flex items-center gap-3">
            <button
              onClick={checkAll}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
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
                  ? "bg-green-100 text-green-800"
                  : score >= answeredCount / 2
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
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
              className="text-xs font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              🔄 Ulangi
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}

// ═══════════════════════════════════════
//  CONTENT AREA
//  FIX #4 & #5: key props on QuizSection and ExampleCard reset their state
//  FIX #3: passes stable trigger string to useMathJax
// ═══════════════════════════════════════
function ContentArea({
  topic,
  isMath,
  chapterIdx,
  topicIdx,
  goNext,
  goPrev,
  canGoNext,
  canGoPrev,
  nextLabel,
  prevLabel,
}) {
  const contentRef = useRef(null);
  // FIX #3: stable string trigger instead of dynamic array
  const mathTrigger = `${chapterIdx}-${topicIdx}`;
  useMathJax(mathTrigger);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterIdx, topicIdx]);

  return (
    <div ref={contentRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-8 md:py-12">
        <motion.div
          key={`${chapterIdx}-${topicIdx}`}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {topic.title}
          </motion.h1>

          <motion.div
            className="flex items-center gap-1.5 text-xs text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span>Bab {chapterIdx + 1}</span>
            <ChevronRight size={10} />
            <span>Topik {topicIdx + 1}</span>
          </motion.div>

          {topic.content && (
            <motion.div
              className="text-sm md:text-base text-gray-600 leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <p>{topic.content}</p>
            </motion.div>
          )}

          {/* FORMULAS */}
          {isMath && topic.formulas?.length > 0 && (
            <motion.section
              className="mb-10"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900" />
                Rumus Penting
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {topic.formulas.map((f, i) => (
                  <FormulaCard key={i} formula={f} index={i} />
                ))}
              </div>
            </motion.section>
          )}

          {/* KEY POINTS */}
          {topic.keyPoints?.length > 0 && (
            <motion.section
              className="mb-10"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900" />
                Poin Penting
              </h2>
              <div className="space-y-2.5">
                {topic.keyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-3 p-3 sm:p-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center mt-0.5">
                      <Check size={10} />
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* EXAMPLES — FIX #5: key resets open state per topic */}
          {topic.examples?.length > 0 && (
            <motion.section
              className="mb-10"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900" />
                {isMath ? "Contoh Soal" : "Contoh"}
              </h2>
              <div className="space-y-3">
                {topic.examples.map((ex, i) => (
                  <ExampleCard
                    key={`${chapterIdx}-${topicIdx}-ex-${i}`}
                    example={ex}
                    index={i}
                    isMath={isMath}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* TIPS */}
          {topic.tips?.length > 0 && (
            <motion.section
              className="mb-10"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-900" />
                Tips & Trik
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100 rounded-xl p-3 sm:p-5 space-y-3">
                {topic.tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <span className="text-gray-400 mt-px">💡</span>
                    <span className="leading-relaxed">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* QUIZ — FIX #4: key resets all quiz state per topic */}
          {topic.quiz?.length > 0 && (
            <QuizSection
              key={`${chapterIdx}-${topicIdx}-quiz`}
              quiz={topic.quiz}
            />
          )}

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
            {canGoPrev ? (
              <button
                onClick={goPrev}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all group"
              >
                <ArrowLeft size={14} />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Sebelumnya
                  </div>
                  <div className="font-medium group-hover:text-gray-900 max-w-[120px] sm:max-w-none truncate">
                    {prevLabel}
                  </div>
                </div>
              </button>
            ) : (
              <div />
            )}
            {canGoNext ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all group text-right"
              >
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Selanjutnya
                  </div>
                  <div className="font-medium group-hover:text-gray-900 max-w-[120px] sm:max-w-none truncate">
                    {nextLabel}
                  </div>
                </div>
                <span className="rotate-180">
                  <ArrowLeft size={14} />
                </span>
              </button>
            ) : (
              <div className="text-xs text-gray-300 italic">
                Topik terakhir 🎉
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  STUDY VIEW
//  FIX #1: keyboard navigation with stable useCallback + proper deps
//  FIX #9: removed duplicate bottom nav prev/next — mobile bar now shows
//          topic title only (not duplicate controls)
// ═══════════════════════════════════════
function StudyView({
  data,
  subject,
  chapterIdx,
  topicIdx,
  onChapterChange,
  onTopicChange,
  onBack,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMath = subject === "mtk";
  const topic = data.chapters[chapterIdx]?.topics[topicIdx];

  const totalTopics = useMemo(
    () => data.chapters.reduce((s, c) => s + c.topics.length, 0),
    [data],
  );
  const currentTopicNum = useMemo(
    () =>
      data.chapters
        .slice(0, chapterIdx)
        .reduce((s, c) => s + c.topics.length, 0) +
      topicIdx +
      1,
    [data, chapterIdx, topicIdx],
  );

  const isFirst = chapterIdx === 0 && topicIdx === 0;
  const isLast =
    chapterIdx === data.chapters.length - 1 &&
    topicIdx === data.chapters[chapterIdx].topics.length - 1;

  // FIX #1: stable callbacks with correct deps
  const goNext = useCallback(() => {
    const chapter = data.chapters[chapterIdx];
    if (topicIdx < chapter.topics.length - 1) {
      onTopicChange(topicIdx + 1);
    } else if (chapterIdx < data.chapters.length - 1) {
      onChapterChange(chapterIdx + 1);
      onTopicChange(0);
    }
  }, [data, chapterIdx, topicIdx, onChapterChange, onTopicChange]);

  const goPrev = useCallback(() => {
    if (topicIdx > 0) {
      onTopicChange(topicIdx - 1);
    } else if (chapterIdx > 0) {
      const prevChapter = data.chapters[chapterIdx - 1];
      onChapterChange(chapterIdx - 1);
      onTopicChange(prevChapter.topics.length - 1);
    }
  }, [data, chapterIdx, topicIdx, onChapterChange, onTopicChange]);

  const handleNavigate = useCallback(
    (cIdx, tIdx) => {
      onChapterChange(cIdx);
      onTopicChange(tIdx);
    },
    [onChapterChange, onTopicChange],
  );

  // FIX #1: effect now has stable deps (goNext, goPrev are memoized)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const getAdjacentLabel = useCallback(
    (dir) => {
      if (dir === "next") {
        const chapter = data.chapters[chapterIdx];
        if (topicIdx < chapter.topics.length - 1)
          return chapter.topics[topicIdx + 1].title;
        if (chapterIdx < data.chapters.length - 1)
          return data.chapters[chapterIdx + 1].topics[0].title;
        return "";
      } else {
        if (topicIdx > 0)
          return data.chapters[chapterIdx].topics[topicIdx - 1].title;
        if (chapterIdx > 0) {
          const prev = data.chapters[chapterIdx - 1];
          return prev.topics[prev.topics.length - 1].title;
        }
        return "";
      }
    },
    [data, chapterIdx, topicIdx],
  );

  if (!topic) return null;

  return (
    <motion.div
      key="study"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Menu size={18} />
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline group-hover:underline">
              Kembali
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-lg">{data.icon}</span>
          <span className="text-sm font-semibold text-gray-900 hidden sm:inline">
            {data.subject}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            {currentTopicNum}/{totalTopics}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={goNext}
              disabled={isLast}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors rotate-180"
            >
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          data={data}
          chapterIdx={chapterIdx}
          topicIdx={topicIdx}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ContentArea
          topic={topic}
          isMath={isMath}
          chapterIdx={chapterIdx}
          topicIdx={topicIdx}
          goNext={goNext}
          goPrev={goPrev}
          canGoNext={!isLast}
          canGoPrev={!isFirst}
          nextLabel={getAdjacentLabel("next")}
          prevLabel={getAdjacentLabel("prev")}
        />
      </div>

      {/* FIX #9: Mobile bottom bar shows current topic title only — no duplicate nav buttons */}
      <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2.5 flex items-center justify-center">
        <p className="text-xs text-gray-400 truncate max-w-xs text-center">
          {topic.title}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════
export default function BelajarTo() {
  const [view, setView] = useState("landing");
  const [subject, setSubject] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);

  const data = subject === "mtk" ? mtkData : bindoData;

  const handleSelectSubject = (key) => {
    setSubject(key);
    setView("study");
    setChapterIdx(0);
    setTopicIdx(0);
  };

  const handleBack = () => {
    setView("landing");
    setSubject(null);
    setChapterIdx(0);
    setTopicIdx(0);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <LandingView key="landing" onSelect={handleSelectSubject} />
        ) : (
          <StudyView
            key="study"
            data={data}
            subject={subject}
            chapterIdx={chapterIdx}
            topicIdx={topicIdx}
            onChapterChange={setChapterIdx}
            onTopicChange={setTopicIdx}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
