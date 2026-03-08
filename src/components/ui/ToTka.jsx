import React, { Suspense, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSubjects } from "../../hooks/useToTkaData";
import * as LucideIcons from "lucide-react";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import SearchOverlay from "./totka/SearchOverlay";

// Lazy loaded page components
const SubjectView = React.lazy(() => import("./totka/SubjectView"));

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

function LandingView() {
  const { subjects, loading } = useSubjects();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  if (loading || !subjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-gray-400">
          <BookOpen className="animate-bounce" />
          <span>Memuat Data...</span>
        </div>
      </div>
    );
  }

  const gradients = {
    mtk: "from-gray-900 to-gray-700",
    bindo: "from-gray-800 to-gray-600",
  };

  return (
    <motion.div
      key="landing"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-16 bg-white dark:bg-gray-950 transition-colors"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        className="text-center mb-8 sm:mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs font-medium tracking-wide uppercase mb-6">
          <BookOpen size={14} />
          Persiapan Ujian
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          Belajar TO TKA
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto font-light">
          Rangkuman materi interaktif untuk persiapan UTBK SNMPTN/SBMPTN
        </p>
        <button
          onClick={() => setSearchOpen(true)}
          className="mx-auto mt-8 flex items-center gap-3 px-6 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors shadow-sm"
        >
          <Search size={18} />
          <span className="text-sm">Cari materi, rumus, bab...</span>
        </button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            variants={staggerItem}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <motion.button
              variants={cardHover}
              onClick={() => navigate(`/to-tka/${subject.id}`)}
              className={`w-full text-left rounded-2xl bg-gradient-to-br ${gradients[subject.id] || "from-blue-600 to-indigo-600"} p-5 sm:p-8 text-white cursor-pointer
                shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden`}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 transition-colors duration-500" />
              <span className="text-4xl mb-4 block relative z-10">
                {subject.icon}
              </span>
              <h2 className="text-2xl font-bold mb-2 relative z-10">
                {subject.subject}
              </h2>
              <p className="text-white/60 text-sm mb-6 relative z-10">
                {subject.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-white/50 relative z-10">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  {subject.totalChapters} Bab
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <LucideIcons.List size={12} /> {subject.totalTopics} Topik
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

      {searchOpen && (
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </motion.div>
  );
}

export default function ToTka() {
  return (
    <div
      className={`totka-app-container w-full h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans`}
    >
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route
            path="/:subjectId/*"
            element={
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center dark:bg-gray-950">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                  </div>
                }
              >
                <SubjectView />
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
