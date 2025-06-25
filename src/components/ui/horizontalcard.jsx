"use client";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";
import { scrollY } from "@/lib/motionScroll";
import { useRef, useEffect, useState } from "react";
import { Star, Calendar, HelpCircle } from "lucide-react";

const cards = [
  {
    title: "UQC 1",
    src: "Images/UQC/UQC1.2.jpeg",
    place: '1st',
    date: 'Maret 2023'
  },
  {
    title: "UQC 2",
    src: "Images/UQC/UQC2.7.jpeg",
    place: '1st',
    date: 'Januari 2024'
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
    place: '3rd',
    date: 'Juni 2025'
  }
];

export default function HorizontalCard() {
  const sectionRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const cardWidth = 360;
  const gap = 40;
  const totalCards = cards.length;
  
  // Motion value untuk drag
  const dragX = useMotionValue(0);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Progress berdasarkan scroll
  const scrollEnd = startY + ((totalCards - 1) * window.innerHeight);
  const progress = useTransform(scrollY, [startY, scrollEnd], [0, totalCards - 1]);
  
  // X position gabungan dari scroll dan drag
  const x = useTransform([progress, dragX], ([scrollProgress, drag]) => {
    return -(scrollProgress * (cardWidth + gap)) + drag;
  });

  // Update current index berdasarkan progress
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      setCurrentIndex(Math.round(latest));
    });
    return unsubscribe;
  }, [progress]);

  // Handle drag end dengan snap
  const handleDragEnd = (event, info) => {
    const currentX = -(progress.get() * (cardWidth + gap));
    const totalX = currentX + info.offset.x;
    const targetIndex = Math.round(-totalX / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(totalCards - 1, targetIndex));
    
    // Scroll ke posisi target
    const targetScrollY = startY + (clampedIndex * window.innerHeight);
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
    
    // Reset drag position
    animate(dragX, 0, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
  };

  // Navigasi ke card tertentu
  const goToCard = (index) => {
    const targetScrollY = startY + (index * window.innerHeight);
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
    animate(dragX, 0, {
      type: "spring",
      stiffness: 300,
      damping: 30
    });
  };

  return (
    <section 
      ref={sectionRef} 
      style={{ height: `${(totalCards + 1) * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="w-[360px] h-[520px] relative">
          <motion.div
            style={{ x }}
            className="flex absolute left-0 top-0"
            drag={isMobile ? "x" : false}
            dragConstraints={{
              left: -(totalCards - 1) * (cardWidth + gap) - 100,
              right: 100
            }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onDrag={(event, info) => {
              dragX.set(info.offset.x);
            }}
            whileDrag={{ scale: 0.98 }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="w-[360px] h-[520px] mr-[40px] rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100 flex-shrink-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl select-none"
              >
                {/* Bagian Gambar */}
                <div className="relative h-64 overflow-hidden">
                  {card.src === "" ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300 text-lg font-medium">Misteri</p>
                        <p className="text-gray-400 text-sm">Segera Hadir</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 pointer-events-none"
                      draggable={false}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  {/* Fallback jika gambar gagal load */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-bold text-xl hidden">
                    {card.title}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full p-2">
                    <Star className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Bagian Konten */}
                <div className="p-6 h-56 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {card.date}
                    </p>
                  </div>

                  {/* Highlight Pencapaian */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-800">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-medium">Juara {card.place}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-800">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-medium">
                        {card.place === "1st" ? "Performa Luar Biasa" : 
                         card.place === "2nd" ? "Kerja Tim Excellent" : 
                         "Usaha yang Hebat"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Indikator Progress */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: currentIndex === i ? "#000000" : "#d1d5db"
              }}
              onClick={() => goToCard(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Instruksi untuk Mobile */}
        {isMobile && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              👆 Geser untuk navigasi • 📜 Scroll untuk jelajahi
            </p>
          </div>
        )}
        
        {/* Instruksi untuk Desktop */}
        {!isMobile && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-gray-600 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              📜 Scroll untuk navigasi kartu
            </p>
          </div>
        )}
      </div>
    </section>
  );
}