// lib/motionScroll.js
import { motionValue } from "framer-motion";

// Create one shared scrollY value for the entire app
export const scrollY = motionValue(0);

// Initialize scroll tracking when the module loads
if (typeof window !== "undefined") {
  const updateScrollY = () => {
    scrollY.set(window.scrollY);
  };

  // Set initial value
  updateScrollY();

  // Add scroll listener with passive for better performance
  window.addEventListener("scroll", updateScrollY, { passive: true });

  // Optional: Add resize listener to handle window resize
  window.addEventListener("resize", updateScrollY, { passive: true });
} else {
  // For SSR, set a default value
  scrollY.set(0);
}

// Utility function to safely get scroll value
export const getScrollY = () => {
  if (typeof window !== "undefined") {
    return window.scrollY;
  }
  return 0;
};

// Utility function to create scroll-based transforms with easing
export const createScrollTransform = (inputRange, outputRange, ease = "linear") => {
  return (progress) => {
    const [inputStart, inputEnd] = inputRange;
    const [outputStart, outputEnd] = outputRange;
    
    const normalizedProgress = Math.max(0, Math.min(1, 
      (progress - inputStart) / (inputEnd - inputStart)
    ));
    
    let easedProgress = normalizedProgress;
    
    // Apply easing
    switch (ease) {
      case "easeIn":
        easedProgress = normalizedProgress * normalizedProgress;
        break;
      case "easeOut":
        easedProgress = 1 - Math.pow(1 - normalizedProgress, 2);
        break;
      case "easeInOut":
        easedProgress = normalizedProgress < 0.5
          ? 2 * normalizedProgress * normalizedProgress
          : 1 - Math.pow(-2 * normalizedProgress + 2, 2) / 2;
        break;
      default:
        easedProgress = normalizedProgress;
    }
    
    return outputStart + (outputEnd - outputStart) * easedProgress;
  };
};

// Cleanup function for when needed
export const cleanup = () => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", () => scrollY.set(window.scrollY));
    window.removeEventListener("resize", () => scrollY.set(window.scrollY));
  }
};