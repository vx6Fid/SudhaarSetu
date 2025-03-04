"use client";
import React, { useState, useEffect } from "react";

function HeroCarousel() {
  const slides = [
    "Report Issues Instantly",
    "Track Progress Live",
    "Get Quick Resolution",
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    setActiveSlide((activeSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((activeSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <div className="relative h-[300px] rounded-[15px] bg-[#475F35] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-12 mx-2 justify-center items-center">
      <h1 className="text-white font-[Playfair Display] text-2xl font-bold max-w-[600px]">
        {slides[activeSlide]}
      </h1>
      <p className="text-[#F5F1E3] text-lg mt-4 max-w-[500px]">
        Transform your community through efficient issue reporting and
        resolution
      </p>
      <button className="mt-8 px-8 py-3 bg-[#F5F1E3] text-[#090909] rounded-[15px] font-bold">
        Report Now!
      </button>
      <div className="absolute bottom-8 right-8 flex gap-2">
        <button
          className="p-2 rounded-full border border-[#F5F1E3]"
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
          className="p-2 rounded-full border border-[#F5F1E3]"
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