import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Copy } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FormulaCard({ formula, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={staggerItem}
      onDoubleClick={handleCopy}
      className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 sm:p-5 group hover:border-gray-300 dark:hover:border-gray-700 transition-colors relative cursor-pointer"
      title="Double click to copy formula"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider block">
          {formula.name}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy LaTeX"
          >
            {copied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
          <span className="text-[10px] text-gray-300 dark:text-gray-600 font-mono">
            #{index + 1}
          </span>
        </div>
      </div>

      <div className="text-center py-3 sm:py-4 text-base sm:text-lg overflow-x-auto select-all">
        <BlockMath math={formula.latex} />
      </div>

      {formula.note && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800 leading-relaxed">
          💡 {formula.note}
        </p>
      )}
    </motion.div>
  );
}
