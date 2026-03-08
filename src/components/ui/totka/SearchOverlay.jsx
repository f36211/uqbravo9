import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ChevronRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToTkaStore from "../../../store/useToTkaStore";
import { useSubjects } from "../../../hooks/useToTkaData";

// Simulated search index builder across all normalized data
// In a real app with large data, this should be done on backend or via a dedicated web worker search index
function useSearchIndex() {
  const { subjectsList } = useToTkaStore();
  const [index, setIndex] = useState([]);

  useEffect(() => {
    if (!subjectsList) return;

    // Quick build of search index from chapters.json of each subject
    // This just indexes titles for quick "Jump to topic" functionality
    const buildIndex = async () => {
      let fullIndex = [];
      for (const subject of subjectsList) {
        try {
          const res = await fetch(
            `/data/normalized/${subject.id}/chapters.json`,
          );
          if (!res.ok) continue;
          const data = await res.json();

          data.chapters.forEach((ch, cIdx) => {
            ch.topics.forEach((top, tIdx) => {
              fullIndex.push({
                subjectId: subject.id,
                subjectName: subject.subject,
                chapterId: ch.id,
                chapterTitle: ch.title,
                topicId: top.id,
                topicTitle: top.title,
                cIdx,
                tIdx,
                searchString:
                  `${subject.subject} ${ch.title} ${top.title}`.toLowerCase(),
              });
            });
          });
        } catch (e) {
          console.error("Failed to index subject", subject.id);
        }
      }
      setIndex(fullIndex);
    };

    buildIndex();
  }, [subjectsList]);

  return index;
}

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchIndex = useSearchIndex();
  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useToTkaStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const matches = searchIndex
        .filter((item) => item.searchString.includes(q))
        .slice(0, 8); // limit to 8 results max

      setResults(matches);
    }, 250); // debounce

    return () => clearTimeout(timer);
  }, [query, searchIndex]);

  const handleSelect = (item) => {
    addRecentSearch(item.topicTitle);
    navigate(`/to-tka/${item.subjectId}`);
    // Passing state via location or a store would be better for dictating starting indices,
    // but for now router is just /subjectId, so we'll just navigate to the subject.
    // In a fully robust implementation, router would be /subjectId/chapterId/topicId
    onClose();
  };

  const handleRecentClick = (q) => {
    setQuery(q);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="relative flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
            <Search className="w-5 h-5 text-gray-400 absolute left-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari materi, rumus, bab..."
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 pl-10 pr-10 py-2 text-lg outline-none"
            />
            <button
              onClick={onClose}
              className="absolute right-4 p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {/* Initial State: Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Pencarian Terakhir
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Hapus Semua
                  </button>
                </div>
                <ul className="space-y-1">
                  {recentSearches.map((rec, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleRecentClick(rec)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg text-left text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{rec}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty State */}
            {query.trim() && results.length === 0 && (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <p>Tidak ditemukan hasil untuk "{query}"</p>
                <p className="text-xs mt-1 text-gray-400">
                  Coba gunakan kata kunci yang lebih umum
                </p>
              </div>
            )}

            {/* Results State */}
            {results.length > 0 && (
              <div className="p-2">
                <ul className="space-y-1">
                  {results.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-gray-900 group-hover:dark:bg-gray-100 group-hover:text-white group-hover:dark:text-gray-900 transition-colors">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                              {item.topicTitle}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <span className="uppercase text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                {item.subjectId}
                              </span>
                              <span>•</span>
                              <span>{item.chapterTitle}</span>
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-900 group-hover:dark:text-gray-100 transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-400">
            <span>Gunakan panah &uarr;&darr; untuk navigasi</span>
            <span className="flex items-center gap-1">
              Tekan{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                ESC
              </kbd>{" "}
              untuk menutup
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
