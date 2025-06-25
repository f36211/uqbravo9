import { ReactLenis } from "lenis/dist/lenis-react";
import Navbars from "@/components/Navbar";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import ParallaxScrolls from '@/components/ui/murid'
import { SiSpacex } from "react-icons/si";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { scrollY } from "@/lib/motionScroll"; 

export const SmoothScrollHero = () => {
  useEffect(() => {
    const lenis = window?.lenis;
    if (!lenis) return;

    const update = () => {
      scrollY.set(lenis.scroll);
    };

    lenis.on("scroll", update);
    return () => lenis.off("scroll", update);
  }, []);

  return (
    <div className="bg-white" id="Home">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >
        <Hero />
      </ReactLenis>
    </div>
  );
};
const SECTION_HEIGHT = 3000;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <AnimatedText />
      <ParallaxImages />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-white/0 to-white/65" />
    </div>
  );
};
const CenterImage = () => {
  // Fix: Start invisible (50-50 = dot) then expand to full screen (0-100)
  const clipTop = useTransform(scrollY, [0, 2500], [50, 0]);
  const clipRight = useTransform(scrollY, [0, 2500], [50, 100]);
  const clipBottom = useTransform(scrollY, [0, 2500], [50, 100]);
  const clipLeft = useTransform(scrollY, [0, 2500], [50, 0]);
  
  const clipPath = useMotionTemplate`polygon(${clipLeft}% ${clipTop}%, ${clipRight}% ${clipTop}%, ${clipRight}% ${clipBottom}%, ${clipLeft}% ${clipBottom}%)`;

  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        opacity,
        backgroundImage: "",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
};
const AnimatedText = () => {
  const { scrollY } = useScroll();

  // Welcome text animations - extended timing
  const welcomeOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const welcomeY = useTransform(scrollY, [0, 800], [0, -100]);
  const welcomeScale = useTransform(scrollY, [0, 800], [1, 0.8]);

  // 9BRAVO text animations - extended timing, stays at opacity 1 after animation
  const bravoOpacity = useTransform(
  scrollY,
  [600, 1800, SECTION_HEIGHT, SECTION_HEIGHT + 500],
  [0, 1, 1, 0]
);

  const bravoY = useTransform(scrollY, [600, 1800], [150, 0]);
  const bravoScale = useTransform(scrollY, [600, 1800], [1.3, 1]);
  const bravoRotate = useTransform(scrollY, [600, 1800], [15, 0]);

  // Container background opacity - extended timing to end at last parallax
  const containerOpacity = useTransform(scrollY, [0, 3500], [0.7, 0.9]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-50"
      style={{ opacity: containerOpacity }}
    >
      <div className="text-center relative">
        {/* Welcome Text */}
        <motion.div
          style={{
            opacity: welcomeOpacity,
            y: welcomeY,
            scale: welcomeScale,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-black drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] filter brightness-150"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: -50, rotateY: -90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "backOut" }}
              className="inline-block mr-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
            >
              Welcome
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 50, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 1.2, ease: "backOut" }}
              className="inline-block text-black drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
            >
              to
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* 9BRAVO Text */}
        <motion.div
          style={{
            opacity: bravoOpacity,
            y: bravoY,
            scale: bravoScale,
            rotate: bravoRotate,
          }}
          className="flex items-center justify-center"
        >
          <motion.h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-black tracking-wider flex gap-2">
            {"9BRAVO!".split("").map((char, index) => {
              const charOpacity = useTransform(
                scrollY,
                [600 + index * 100, 1000 + index * 100],
                [0, 1]
              );
              const y = useTransform(
                scrollY,
                [600 + index * 100, 1000 + index * 100],
                [50, 0]
              );
              const glowScale = useTransform(
                scrollY,
                [1000 + index * 100, 2000 + index * 100],
                [1, 1.05]
              );
              const glowShadow = useTransform(
                scrollY,
                [1000 + index * 100, 2000 + index * 100],
                [
                  "0px 0px 0px rgba(255,255,255,0)",
                  "0px 0px 30px rgba(255,255,255,0.8)",
                ]
              );

              return (
                <motion.span
                  key={index}
                  className="inline-block"
                  style={{
                    opacity: charOpacity,
                    y,
                    scale: glowScale,
                    textShadow: glowShadow,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 10,
                    delay: index * 0.1,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>
        </motion.div>

        {/* Enhanced floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -200, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 2, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[400px]">
      <ParallaxImg
        src="Images/back.png"
        alt="And example of a space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="Images/uqcback1.jpg"
        alt="An example of a space launch"
        start={100}
        end={-300}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="Images/UQC/UQC1.2.jpeg"
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="Images/UQC/UQC2.8.jpeg"
        alt="Orbiting satellite"
        start={200}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });
  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};
