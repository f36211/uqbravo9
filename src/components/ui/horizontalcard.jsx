"use client";
import { motion, useTransform } from "framer-motion";
import { scrollY } from "@/lib/motionScroll";
import { useRef, useEffect, useState } from "react";
import { Star, Calendar, HelpCircle } from "lucide-react";


const cards = [
  {
    title: "UQC 1",
    src: "Images/UQC/UQC1.2.jpeg",
    place: '1st',
    date: 'March 2023'
  },
  {
    title: "UQC 2",
    src: "Images/UQC/UQC2.7.jpeg",
    place: '1st',
    date: 'January 2024'
  },
  {
    title: "UQC 3",
    src: "",
    place: '2nd',
    date: 'Desember 2024'
  },
  {
    title: "UQC 4",
    src: "Images/UQC/UQC4.2.jpg",
    place: '3nd',
    date: 'Juni 2025'
  }
];
export default function HorizontalCard() {
  const sectionRef = useRef(null);
  const [startY, setStartY] = useState(0);
  
  const cardWidth = 360;
  const gap = 40;
  const totalCards = cards.length;

  useEffect(() => {
    const updateStartY = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const y = window.scrollY || window.pageYOffset;
        setStartY(rect.top + y);
      }
    };

    updateStartY();
    window.addEventListener("resize", updateStartY);
    return () => window.removeEventListener("resize", updateStartY);
  }, []);

  // Fix scroll range to ensure last card shows
  const scrollEnd = startY + ((totalCards - 1) * window.innerHeight);
  const progress = useTransform(scrollY, [startY, scrollEnd], [0, totalCards - 1]);
  
  // Smooth horizontal movement with easing
  const x = useTransform(progress, (p) => {
    return -p * (cardWidth + gap);
  });

  return (
    <section 
      ref={sectionRef} 
      style={{ height: `${(totalCards + 1) * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="w-[360px] h-[520px] relative">
          <motion.div
            style={{ x }}
            className="flex absolute left-0 top-0"
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 40,
              mass: 0.8
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="w-[360px] h-[520px] mr-[40px] rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100 flex-shrink-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  {card.src === "mystery" ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 text-lg font-medium">Mystery</p>
                        <p className="text-gray-400 text-sm">Coming Soon</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full p-2">
                    <Star className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 h-50 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {card.date}
                    </p>

                  </div>

                  {/* Achievement Highlights */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-800">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-medium">{card.place} Place Achievement</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-800">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-medium">
                        {card.place === "1st" ? "Outstanding Performance" : 
                         card.place === "2nd" ? "Excellent Teamwork" : 
                         "Great Effort"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {cards.map((_, i) => {
            const isActive = useTransform(progress, (p) => Math.round(p) === i);
            return (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: useTransform(progress, (p) => 
                    Math.round(p) === i ? "#000000" : "#d1d5db"
                  )
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}