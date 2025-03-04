"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const keyFeatures = [
  {
    title: "One-Click Complaint Filing",
    description: "Easily report municipal issues with just a few clicks. Our user-friendly platform eliminates unnecessary steps, making it effortless for citizens to submit complaints about public infrastructure, sanitation, and more."
  },
  {
    title: "Image & Location-Based Reports",
    description: "Enhance complaint accuracy by attaching real-time images and automatic GPS location data. This ensures authorities receive precise details, helping them quickly locate and address the issue."
  },
  {
    title: "Upvote System for Prioritization",
    description: "Complaints with the most upvotes receive higher priority, ensuring that urgent or widespread issues get resolved faster. Citizens can support existing complaints to push them up in the queue."
  },
  {
    title: "Automated Complaint Assignment",
    description: "No need to manually assign complaints. Our intelligent system automatically distributes complaints to the relevant field officers based on location, workload, and priority."
  },
  {
    title: "Real-Time Status Tracking",
    description: "Stay updated with live tracking. Know whether your complaint is 'Pending,' 'In Progress,' or 'Resolved' at any given moment, eliminating uncertainty and improving transparency."
  },
  {
    title: "Interactive Swipe-Based Browsing",
    description: "Browse through municipal complaints effortlessly with a modern swipe-based interface. Easily view, upvote, or report issues in a Tinder-style card format."
  },
  {
    title: "Dedicated Field Officer Dashboard",
    description: "Field officers have a structured dashboard where they can view assigned complaints, mark progress, and update resolutions in real-time, making issue resolution more efficient."
  },
  {
    title: "Powerful Admin Control Panel",
    description: "Admins have full control to monitor complaints, assign field officers, manage users, and generate reports to analyze trends and system efficiency."
  },
  {
    title: "Feedback & Rating System",
    description: "Once an issue is resolved, users can provide feedback and rate the effectiveness of the response, helping improve municipal services over time."
  },
];

const KeyFeaturesCarousel = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-2">
      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="px-4"
        >
          {keyFeatures.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-300 shadow-xl rounded-xl px-6 min-h-[260px] flex flex-col justify-center transition-all transform hover:scale-105 hover:shadow-2xl">
                <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default KeyFeaturesCarousel;
