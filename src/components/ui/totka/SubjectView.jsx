import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useChapters, useTopic } from "../../../hooks/useToTkaData";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import SearchOverlay from "./SearchOverlay";
import { Menu, ArrowLeft, Sun, Moon, Search } from "lucide-react";
import useToTkaStore from "../../../store/useToTkaStore";

export default function SubjectView() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { data: chapters, loading: chaptersLoading } = useChapters(subjectId);
  const { darkMode, toggleDarkMode } = useToTkaStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // State for current selection
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);

  useEffect(() => {
    // Basic restoration of last visited if possible, otherwise default 0,0
    setCurrentChapterIdx(0);
    setCurrentTopicIdx(0);
  }, [subjectId]);

  if (chaptersLoading || !chapters) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-50"></div>
      </div>
    );
  }

  // Derived state
  const currentChapter = chapters[currentChapterIdx];
  const currentTopicMeta = currentChapter?.topics[currentTopicIdx];

  const handleNavigate = (cIdx, tIdx) => {
    setCurrentChapterIdx(cIdx);
    setCurrentTopicIdx(tIdx);
  };

  const handleNext = () => {
    if (currentTopicIdx < chapters[currentChapterIdx].topics.length - 1) {
      handleNavigate(currentChapterIdx, currentTopicIdx + 1);
    } else if (currentChapterIdx < chapters.length - 1) {
      handleNavigate(currentChapterIdx + 1, 0);
    }
  };

  const handlePrev = () => {
    if (currentTopicIdx > 0) {
      handleNavigate(currentChapterIdx, currentTopicIdx - 1);
    } else if (currentChapterIdx > 0) {
      const prevChapter = chapters[currentChapterIdx - 1];
      handleNavigate(currentChapterIdx - 1, prevChapter.topics.length - 1);
    }
  };

  const canGoNext =
    currentChapterIdx < chapters.length - 1 ||
    currentTopicIdx < chapters[currentChapterIdx].topics.length - 1;
  const canGoPrev = currentChapterIdx > 0 || currentTopicIdx > 0;

  let nextLabel = "Selanjutnya";
  if (
    canGoNext &&
    currentTopicIdx === chapters[currentChapterIdx].topics.length - 1
  ) {
    nextLabel = "Bab Berikutnya";
  }

  let prevLabel = "Sebelumnya";
  if (canGoPrev && currentTopicIdx === 0) {
    prevLabel = "Bab Sebelumnya";
  }

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-950 transition-colors ${darkMode ? "dark" : ""}`}
    >
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/to-tka")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {subjectId.toUpperCase()}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentTopicMeta?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={18} />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          chapters={chapters}
          subjectId={subjectId}
          chapterIdx={currentChapterIdx}
          topicIdx={currentTopicIdx}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {currentTopicMeta && (
          <ContentLoader
            subjectId={subjectId}
            chapterId={currentChapter.id}
            topicId={currentTopicMeta.id}
            chapterIdx={currentChapterIdx}
            topicIdx={currentTopicIdx}
            goNext={handleNext}
            goPrev={handlePrev}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            nextLabel={nextLabel}
            prevLabel={prevLabel}
          />
        )}
      </div>

      {searchOpen && (
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  );
}

// Separate component to handle data fetching per topic to allow code splitting
function ContentLoader({ subjectId, chapterId, topicId, ...navProps }) {
  const {
    data: topic,
    loading,
    error,
  } = useTopic(subjectId, chapterId, topicId);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center dark:bg-gray-950">
        <div className="animate-pulse flex flex-col items-center gap-4 text-gray-400">
          <div className="h-8 w-8 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
          <span>Memuat Materi...</span>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 text-center text-red-500">
        Failed to load content: {error}
      </div>
    );
  }

  // Load ContentArea dynamically if we have data
  return <LazyContentArea topic={topic} subjectId={subjectId} {...navProps} />;
}

const LazyContentArea = React.lazy(() => import("./ContentArea"));
