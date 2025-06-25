"use client";;
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}>
    <img src={card.src} alt={card.title} className="object-cover absolute inset-0" />
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <div
        className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";
export function FocusCards({ cards }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]); // Horizontal scroll effect

  return (
    <section className="h-[200vh] relative" ref={containerRef} id="achievements-7">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black text-white">
        <motion.div
          style={{ x }}
          className="flex gap-10 h-full px-40 items-center"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className={cn(
                "min-w-[300px] h-[80%] rounded-xl bg-neutral-800 overflow-hidden relative flex-shrink-0 transition-transform duration-500",
                "flex flex-col justify-end p-4 shadow-xl"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <img
                src={card.src}
                alt={card.title}
                className="absolute inset-0 object-cover w-full h-full z-0"
              />
              <div className="relative z-10 text-xl font-semibold bg-black/50 p-2 rounded">
                {card.title}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

