import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, BookOpen, Sun, Moon } from "lucide-react";
import useToTkaStore from "../../../store/useToTkaStore";

const sidebarItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function Sidebar({
  chapters,
  subjectId,
  chapterIdx,
  topicIdx,
  onNavigate,
  isOpen,
  onClose,
}) {
  const [expandedChapters, setExpandedChapters] = useState(
    new Set([chapterIdx]),
  );
  const { darkMode, toggleDarkMode } = useToTkaStore();

  useEffect(() => {
    setExpandedChapters((prev) => new Set([...prev, chapterIdx]));
  }, [chapterIdx]);

  const toggleChapter = (idx) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const totalTopics = chapters.reduce((s, c) => s + c.topics.length, 0);
  const currentGlobalIdx =
    chapters.slice(0, chapterIdx).reduce((s, c) => s + c.topics.length, 0) +
    topicIdx +
    1;

  const sidebarContent = (
    <motion.nav
      className="h-full flex flex-col"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen className="text-gray-900 dark:text-gray-100" size={20} />
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase">
            {subjectId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="hidden md:block p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {chapters.map((chapter, cIdx) => (
          <motion.div key={chapter.id} variants={sidebarItemVariants}>
            <button
              onClick={() => toggleChapter(cIdx)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors
                ${cIdx === chapterIdx ? "bg-gray-900 dark:bg-gray-800 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
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
                className={`ml-auto text-xs px-1.5 py-0.5 rounded-md ${cIdx === chapterIdx ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"}`}
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
                  className="overflow-hidden"
                >
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-100 dark:border-gray-800 pl-3 py-1">
                    {chapter.topics.map((topic, tIdx) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          onNavigate(cIdx, tIdx);
                          if (window.innerWidth < 768) onClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all
                          ${
                            cIdx === chapterIdx && tIdx === topicIdx
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
                              : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="text-xs text-gray-400 mb-1.5 flex justify-between">
          <span>Progress</span>
          <span>
            {currentGlobalIdx} / {totalTopics}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
          <motion.div
            className="bg-gray-900 dark:bg-gray-100 h-1.5 rounded-full"
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
      <aside className="hidden md:flex md:w-72 lg:w-80 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0 flex-col h-full overflow-hidden">
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
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-80 bg-white dark:bg-gray-950 shadow-2xl z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
