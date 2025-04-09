"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function HeroCarousel() {
  const slides = [
    {
      title: "Report Issues Instantly",
      description: "Snap, submit, and solve - all in just a few taps.",
      colorFrom: "#3a5a40",
      colorTo: "#588157"
    },
    {
      title: "Track Progress Live",
      description: "Watch your concerns get addressed in real-time.",
      colorFrom: "#4a6fa5",
      colorTo: "#166088"
    },
    {
      title: "Get Quick Resolution",
      description: "Experience faster responses from your local authorities.",
      colorFrom: "#6b2d5c",
      colorTo: "#a13d63"
    },
  ];
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    setIsClient(true);
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % slides.length);
    resetInterval();
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    resetInterval();
  };

  const goToSlide = (index) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const particleConfigs = [
    { size: "8px", top: 20, left: 15, delay: 0.5 },
    { size: "12px", top: 70, left: 80, delay: 1.2 },
    { size: "10px", top: 40, left: 50, delay: 0.8 },
    { size: "7px", top: 60, left: 30, delay: 1.5 },
    { size: "9px", top: 30, left: 70, delay: 0.3 },
    { size: "11px", top: 80, left: 20, delay: 1.0 },
    { size: "10px", top: 50, left: 90, delay: 0.7 },
    { size: "8px", top: 25, left: 40, delay: 1.3 },
    { size: "12px", top: 75, left: 60, delay: 0.4 },
    { size: "9px", top: 35, left: 10, delay: 1.1 },
    { size: "10px", top: 65, left: 85, delay: 0.6 },
    { size: "7px", top: 45, left: 25, delay: 1.4 },
    { size: "11px", top: 55, left: 75, delay: 0.9 },
    { size: "8px", top: 15, left: 55, delay: 0.2 },
    { size: "12px", top: 85, left: 35, delay: 1.6 },
  ];

  const Particle = ({ size, top, left, delay }) => {
    return (
      <motion.div
        className="absolute rounded-full bg-white/10"
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0],
          y: [0, -20, -40],
          x: [0, 5, -5],
        }}
        transition={{
          duration: 10 + delay * 5,
          delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    );
  };

  return (
    <div className="relative w-full h-screen max-h-[650px] flex flex-col justify-center items-start overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: `linear-gradient(135deg, ${slides[0].colorFrom} 0%, ${slides[0].colorTo} 100%)` }}
        animate={{
          background: `linear-gradient(135deg, ${slides[activeSlide].colorFrom} 0%, ${slides[activeSlide].colorTo} 100%)`
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Floating particles - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {particleConfigs.map((config, i) => (
            <Particle
              key={i}
              size={config.size}
              top={config.top}
              left={config.left}
              delay={config.delay}
            />
          ))}
        </div>
      )}
      
      {/* Floating circles */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white mix-blend-overlay"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white mix-blend-overlay"></div>
        <div className="absolute top-1/4 right-1/4 w-30 h-30 rounded-full bg-white mix-blend-overlay"></div>
      </motion.div>
      
      {/* Slide content with animation */}
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full max-w-7xl mx-auto"
          >
            <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl font-bold max-w-[800px] leading-tight drop-shadow-lg">
              {slides[activeSlide].title}
            </h1>
            <motion.p 
              className="text-white/90 text-xl md:text-2xl lg:text-3xl mt-6 max-w-[600px] lg:max-w-[700px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {slides[activeSlide].description}
            </motion.p>
            <motion.button
              onClick={() => router.push("/fileComplaint")}
              className="mt-10 px-8 py-4 bg-white hover:bg-gray-100 text-[#2d3a25] rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-lg md:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Report Now
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === activeSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
            initial={{ width: 8 }}
            animate={{ width: index === activeSlide ? 24 : 8 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-10">
        <motion.button
          className="p-3 rounded-full border-2 border-white/50 hover:border-white bg-black/20 hover:bg-black/30 backdrop-blur-sm transition-all"
          onClick={handlePrev}
          aria-label="Previous slide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
        <motion.button
          className="p-3 rounded-full border-2 border-white/50 hover:border-white bg-black/20 hover:bg-black/30 backdrop-blur-sm transition-all"
          onClick={handleNext}
          aria-label="Next slide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

export default HeroCarousel;