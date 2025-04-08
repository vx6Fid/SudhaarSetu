"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { 
  FiSmartphone, 
  FiMapPin, 
  FiThumbsUp, 
  FiCpu,
  FiClock,
  FiRotateCw
} from "react-icons/fi";
import { FaHandPointer } from "react-icons/fa";

const keyFeatures = [
  {
    title: "One-Click Complaint Filing",
    description: "Easily report municipal issues with just a few clicks. Our user-friendly platform eliminates unnecessary steps.",
    icon: <FiSmartphone className="w-8 h-8" />,
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-600",
    iconBg: "bg-blue-100"
  },
  {
    title: "Image & Location Reports",
    description: "Enhance accuracy with real-time images and GPS data for precise issue location.",
    icon: <FiMapPin className="w-8 h-8" />,
    bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-600",
    iconBg: "bg-emerald-100"
  },
  {
    title: "Upvote Prioritization",
    description: "Higher votes = higher priority. Push important issues to the top.",
    icon: <FiThumbsUp className="w-8 h-8" />,
    bgColor: "bg-gradient-to-br from-violet-50 to-violet-100",
    borderColor: "border-violet-300",
    textColor: "text-violet-600",
    iconBg: "bg-violet-100"
  },
  {
    title: "Automated Assignment",
    description: "Intelligent system distributes complaints to relevant officers automatically.",
    icon: <FiCpu className="w-8 h-8" />,
    bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    borderColor: "border-amber-300",
    textColor: "text-amber-600",
    iconBg: "bg-amber-100"
  },
  {
    title: "Real-Time Tracking",
    description: "Live updates on complaint status from 'Pending' to 'Resolved'.",
    icon: <FiClock className="w-8 h-8" />,
    bgColor: "bg-gradient-to-br from-rose-50 to-rose-100",
    borderColor: "border-rose-300",
    textColor: "text-rose-600",
    iconBg: "bg-rose-100"
  },
  {
    title: "Swipe-Based Browsing",
    description: "Tinder-style interface for effortless complaint browsing.",
    icon: <FaHandPointer className="w-7 h-7" />,
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    borderColor: "border-indigo-300",
    textColor: "text-indigo-600",
    iconBg: "bg-indigo-100"
  }
];

const KeyFeaturesCarousel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-200 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-200 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-green-100 text-primary rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-primary">Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Innovative solutions designed to transform municipal issue resolution
          </p>
        </div>

        <div className="relative h-[500px]">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            coverflowEffect={{
              rotate: 5,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
              renderBullet: (index, className) => {
                return `<span class="${className}" style="background-color: ${keyFeatures[index].textColor}"></span>`;
              }
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="h-full w-full"
          >
            {keyFeatures.map((feature, index) => (
              <SwiperSlide 
                key={index} 
                className="!w-[320px] !h-[420px] transition-transform duration-300 hover:scale-105"
              >
                <div className={`h-full rounded-2xl p-8 flex flex-col border ${feature.borderColor} ${feature.bgColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                  {/* Decorative element */}
                  <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${feature.iconBg} opacity-20`}></div>
                  
                  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${feature.iconBg} ${feature.textColor} mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 flex-grow">{feature.description}</p>
                  <div className="mt-6 flex items-center">
                    <div className={`h-1 w-12 rounded-full ${feature.textColor.replace('text', 'bg')} mr-3`}></div>
                    <span className={`text-sm font-medium ${feature.textColor}`}>Feature {index + 1}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default KeyFeaturesCarousel;