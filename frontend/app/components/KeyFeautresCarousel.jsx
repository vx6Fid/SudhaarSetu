"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const keyFeatures = [
  {
    title: "One-Click Complaint Filing",
    description: "Easily report municipal issues with just a few clicks. Our user-friendly platform eliminates unnecessary steps.",
    icon: "📱",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "Image & Location Reports",
    description: "Enhance accuracy with real-time images and GPS data for precise issue location.",
    icon: "📍",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    title: "Upvote Prioritization",
    description: "Higher votes = higher priority. Push important issues to the top.",
    icon: "👍",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    title: "Automated Assignment",
    description: "Intelligent system distributes complaints to relevant officers automatically.",
    icon: "🤖",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    title: "Real-Time Tracking",
    description: "Live updates on complaint status from 'Pending' to 'Resolved'.",
    icon: "⏱️",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    title: "Swipe-Based Browsing",
    description: "Tinder-style interface for effortless complaint browsing.",
    icon: "💫",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  }
];

const KeyFeaturesCarousel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Innovative solutions for efficient municipal issue resolution
        </p>
      </div>

      <div className="relative h-[500px]">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 200,
            modifier: 2.5,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="h-full w-full"
        >
          {keyFeatures.map((feature, index) => (
            <SwiperSlide key={index} className="!w-[300px] !h-[400px]">
              <div className={`h-full rounded-2xl p-8 flex flex-col border-2 ${feature.borderColor} ${feature.bgColor} shadow-xl transition-all duration-300 hover:shadow-2xl`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700 flex-grow">{feature.description}</p>
                <div className="mt-6 h-1 w-20 rounded-full bg-gray-300"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default KeyFeaturesCarousel;