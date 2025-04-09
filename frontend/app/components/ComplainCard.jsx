"use client";

import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ComplainCard({ complaint }) {
  const [viewMode, setViewMode] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [commentslength, setCommentsLength] = useState(
    complaint.total_comments
  );
  const [comments, setComments] = useState(complaint.commentsList || []);
  const [newComment, setNewComment] = useState("");

  const pinIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
      iconSize: [32, 32],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  }, []);

  const toggleView = () => setViewMode(!viewMode);

  // Handle Upvote
  const handleUpvote = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaint.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure correct header
          },
          body: JSON.stringify({ user_id: localStorage.getItem("userId") }),
        }
      );

      if (response.ok) {
        setUpvotes(upvotes + 1);
      } else {
        console.error("Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaint.id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}` // Uncomment if needed
          },
          body: JSON.stringify({
            user_id: userId,
            comment_text: newComment,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setComments([...comments, responseData]); // Optimistically update UI
        setNewComment(""); // Clear input field
        setCommentsLength(commentslength + 1);
      } else {
        console.error("Failed to add comment:", responseData);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-[#F8E7D2] shadow-lg rounded-xl px-5 pt-5 pb-2 border border-gray-300 relative mx-auto sm:max-w-full max-w-[90%]">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
        {complaint.category}
      </h3>
      <div className="text-sm italic">Ward: {complaint.ward_no}</div>

      <button
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-orange-400 text-white font-medium shadow-md text-sm md:text-base transition hover:bg-orange-500"
        onClick={toggleView}
      >
        {viewMode ? <ImageIcon size={18} /> : <MapPin size={18} />}
        {viewMode ? "View Image" : "View Map"}
      </button>

      <div className="mt-4">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 20,
            stretch: 50,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination
          modules={[EffectCoverflow, Pagination]}
          className="w-full max-w-3xl"
        >
          <SwiperSlide>
            {viewMode ? (
              complaint.location ? (
                <div className="w-full">
                  {" "}
                  {/* NEW Wrapper to enforce full width */}
                  <MapContainer
                    center={complaint.location.split(",").map(Number)}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {pinIcon && (
                      <Marker
                        position={complaint.location.split(",").map(Number)}
                        icon={pinIcon}
                      >
                        <Popup>{complaint.category} reported here.</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-[250px] sm:h-[300px] md:h-[350px] bg-gray-100 text-gray-500 rounded-lg">
                  Invalid location data
                </div>
              )
            ) : complaint.image ? (
              <Image
                src={complaint.image}
                alt="Complaint Image"
                width={500}
                height={350}
                className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-[250px] sm:h-[300px] md:h-[350px] bg-gray-100 text-gray-500 rounded-lg">
                No image available
              </div>
            )}
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center border border-gray-300 rounded-full">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-l-full transition duration-200 shadow-sm"
          >
            <ThumbsUp
              size={18}
              className="transition-transform transform hover:scale-110"
            />
            <span className="font-medium">{upvotes}</span>
          </button>

          {/* Comments Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-orange-300 hover:bg-orange-400 hover:text-white rounded-r-full transition duration-200 shadow-sm">
            <MessageCircle
              size={18}
              className="transition-transform transform hover:scale-110"
            />
            <span className="font-medium">{commentslength}</span>
          </button>
        </div>

        <span
          className={`px-5 py-2 border rounded-full font-medium shadow-md ${
            complaint.status === "pending"
              ? "bg-red-300 text-red-600 border-red-600"
              : complaint.status === "resolved"
              ? "bg-green-300 text-green-600 border-green-600"
              : "bg-orange-300 text-orange-600 border-orange-600"
          }`}
        >
          {complaint.status === "pending"
            ? "Pending"
            : complaint.status === "resolved"
            ? "Resolved"
            : "In Progress"}
        </span>
      </div>

      <div className="mt-2 border-t border-gray-400 pt-3">
        <div className="mt-1 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded-lg"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="ml-2 hover:text-orange-500"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplainCard;
