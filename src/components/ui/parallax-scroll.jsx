"use client";

import { motion, useTransform } from "framer-motion";
import { scrollY } from "@/lib/motionScroll";
import { cn } from "@/lib/utils";

// Helper: chunk an array into groups of `size`
const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const ParallaxScroll = ({ images, className }) => {
  const rows = chunkArray(images, 3);

  const translateY = useTransform(scrollY, [0, 2000], [0, -200]);

  return (
    <div className={cn("min-h-[40rem] w-full", className)}>
      <div className="flex flex-col gap-10 max-w-5xl mx-auto py-40 px-10">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {row.map((src, colIdx) => (
              <motion.div key={colIdx} style={{ y: translateY }}>
                <img
                  src={src}
                  alt={`thumbnail-${rowIdx}-${colIdx}`}
                  className="h-80 w-full object-cover object-top rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
