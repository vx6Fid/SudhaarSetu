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
  FiRotateCw,
} from "react-icons/fi";
import { FaHandPointer } from "react-icons/fa";

const keyFeatures = [
  {
    title: "One-Click Complaint Filing",
    description:
      "Easily report municipal issues with just a few clicks. Our user-friendly platform eliminates unnecessary steps.",
    icon: <FiSmartphone className="w-6 h-6" />,
    bgColor: "bg-gradient-to-br from-blue-50/90 to-blue-100/90",
    borderColor: "border-blue-200/80",
    textColor: "text-blue-600",
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-200",
    gradient: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-200/50",
  },
  {
    title: "Image & Location Reports",
    description:
      "Enhance accuracy with real-time images and GPS data for precise issue location.",
    icon: <FiMapPin className="w-6 h-6" />,
    bgColor: "bg-gradient-to-br from-emerald-50/90 to-emerald-100/90",
    borderColor: "border-emerald-200/80",
    textColor: "text-emerald-600",
    iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
    gradient: "from-emerald-500 to-emerald-700",
    shadow: "shadow-emerald-200/50",
  },
  {
    title: "Upvote Prioritization",
    description:
      "Higher votes = higher priority. Push important issues to the top.",
    icon: <FiThumbsUp className="w-6 h-6" />,
    bgColor: "bg-gradient-to-br from-violet-50/90 to-violet-100/90",
    borderColor: "border-violet-200/80",
    textColor: "text-violet-600",
    iconBg: "bg-gradient-to-br from-violet-100 to-violet-200",
    gradient: "from-violet-500 to-violet-700",
    shadow: "shadow-violet-200/50",
  },
  {
    title: "Automated Assignment",
    description:
      "Intelligent system distributes complaints to relevant officers automatically.",
    icon: <FiCpu className="w-6 h-6" />,
    bgColor: "bg-gradient-to-br from-amber-50/90 to-amber-100/90",
    borderColor: "border-amber-200/80",
    textColor: "text-amber-600",
    iconBg: "bg-gradient-to-br from-amber-100 to-amber-200",
    gradient: "from-amber-500 to-amber-700",
    shadow: "shadow-amber-200/50",
  },
  {
    title: "Real-Time Tracking",
    description:
      "Live updates on complaint status from 'Pending' to 'Resolved'.",
    icon: <FiClock className="w-6 h-6" />,
    bgColor: "bg-gradient-to-br from-rose-50/90 to-rose-100/90",
    borderColor: "border-rose-200/80",
    textColor: "text-rose-600",
    iconBg: "bg-gradient-to-br from-rose-100 to-rose-200",
    gradient: "from-rose-500 to-rose-700",
    shadow: "shadow-rose-200/50",
  },
  {
    title: "Swipe-Based Browsing",
    description: "Tinder-style interface for effortless complaint browsing.",
    icon: <FaHandPointer className="w-5 h-5" />,
    bgColor: "bg-gradient-to-br from-indigo-50/90 to-indigo-100/90",
    borderColor: "border-indigo-200/80",
    textColor: "text-indigo-600",
    iconBg: "bg-gradient-to-br from-indigo-100 to-indigo-200",
    gradient: "from-indigo-500 to-indigo-700",
    shadow: "shadow-indigo-200/50",
  },
];

const KeyFeaturesCarousel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-200 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-200 blur-3xl animate-float-delay"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-primary rounded-full mb-4 shadow-sm">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Innovative solutions designed to transform municipal issue
            resolution
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
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 5,
              renderBullet: (index, className) => {
                return `<span class="${className}" style="background-color: ${keyFeatures[index].textColor}"></span>`;
              },
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            autoplay={{
              delay: 3500,
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
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="h-full w-full"
          >
            {keyFeatures.map((feature, index) => (
              <SwiperSlide
                key={index}
                className="!w-[340px] !h-[440px] transition-transform duration-500 ease-out hover:!scale-105"
              >
                <div
                  className={`h-full rounded-3xl p-8 flex flex-col border ${feature.borderColor} ${feature.bgColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group backdrop-blur-sm`}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 mix-blend-overlay`}
                  ></div>

                  {/* Content container */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon with animated background */}
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-xl ${feature.iconBg} ${feature.textColor} mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                    >
                      {feature.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 flex-grow  transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Animated progress indicator */}
                    <div className="mt-6 flex items-center">
                      <div className="relative h-1.5 w-16 rounded-full bg-gray-200/80 mr-3 overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${feature.gradient} transition-all duration-1000`}
                          style={{ width: `${(index + 1) * 16.66}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${feature.textColor}  transition-colors duration-300`}
                      >
                        Feature {(index % keyFeatures.length) + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Add these to your global CSS or Tailwind config */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
        .swiper-slide {
          transition-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);
        }
        .swiper-slide-active {
          transform: scale(1.05) !important;
          z-index: 10;
        }
        .swiper-slide-prev,
        .swiper-slide-next {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default KeyFeaturesCarousel;
