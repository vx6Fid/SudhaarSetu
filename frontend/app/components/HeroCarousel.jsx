"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function HeroCarousel() {
  const slides = [
    {
      title: "Report Issues Instantly",
      description: "Snap, submit, and solve - all in just a few taps."
    },
    {
      title: "Track Progress Live",
      description: "Watch your concerns get addressed in real-time."
    },
    {
      title: "Get Quick Resolution",
      description: "Experience faster responses from your local authorities."
    },
  ];
  const router = useRouter();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide((activeSlide + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === activeSlide) return;
    setIsAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <div className="relative h-[400px] rounded-2xl bg-gradient-to-r from-[#3a5a40] to-[#588157] shadow-xl p-12 mx-auto max-w-6xl flex flex-col justify-center items-start overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#F5F1E3] mix-blend-overlay"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#F5F1E3] mix-blend-overlay"></div>
      </div>
      
      {/* Slide content */}
      <div className={`transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
        <h1 className="text-white font-serif text-4xl md:text-5xl font-bold max-w-[700px] leading-tight">
          {slides[activeSlide].title}
        </h1>
        <p className="text-[#F5F1E3] text-xl mt-6 max-w-[600px] opacity-90">
          {slides[activeSlide].description}
        </p>
        <button
          onClick={() => router.push("/fileComplaint")}
          className="mt-10 px-8 py-3 bg-[#F5F1E3] hover:bg-[#e8e4d6] text-[#2d3a25] rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Report Now
        </button>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === activeSlide ? "bg-white w-6" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <button
          className="p-3 rounded-full border-2 border-[#F5F1E3]/50 hover:border-[#F5F1E3] bg-[#3a5a40]/50 hover:bg-[#3a5a40]/70 transition-all duration-300"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-[#F5F1E3]"
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
        </button>
        <button
          className="p-3 rounded-full border-2 border-[#F5F1E3]/50 hover:border-[#F5F1E3] bg-[#3a5a40]/50 hover:bg-[#3a5a40]/70 transition-all duration-300"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-[#F5F1E3]"
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
        </button>
      </div>
    </div>
  );
}

export default HeroCarousel;