"use client";

import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function ComplainCard({ complaint, isLiked }) {
  const [viewMode, setViewMode] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);
  const [commentsLength, setCommentsLength] = useState(
    complaint.total_comments || 0
  );
  const [comments, setComments] = useState(complaint.commentsList || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(isLiked);

  const pinIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
    iconSize: [32, 32],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });

  const toggleView = () => setViewMode(!viewMode);
  const toggleComments = () => setShowComments(!showComments);

  // Handle Upvote
  const handleUpvote = async () => {
    if (isLiked) {
      toast("You have already upvoted this complaint");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaint.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: localStorage.getItem("userId") }),
        }
      );

      if (response.ok) {
        setUpvotes((prev) => prev + 1);
        setHasLiked(true);
        toast.success("Upvoted successfully");
      } else {
        toast.error("Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("user-name");
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
          },
          body: JSON.stringify({
            user_id: userId,
            comment_text: newComment,
            userName: userName,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setComments([...comments, responseData.comment]);
        setNewComment("");
        setCommentsLength(commentsLength + 1);
        toast.success("Comment added successfully");
      } else {
        console.error("Failed to add comment:", responseData.error || responseData);
        toast.error(responseData.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    }
  };

  useEffect(() => {
    if (!complaint?.id) return;
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint/${complaint.id}/comments`
        );
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [complaint.id]);

  return (
    <div className="bg-gray-100 shadow-xl rounded-2xl overflow-hidden border border-gray-200 w-full max-w-2xl mx-auto transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-[#b86e38] px-5 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">
              {complaint.category}
            </h3>
            <div className="text-xs text-white/90">
              Ward: {complaint.ward_no}
            </div>
          </div>

          <button
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white font-medium text-sm transition hover:bg-white/30 backdrop-blur-sm"
            onClick={toggleView}
          >
            {viewMode ? (
              <>
                <ImageIcon size={16} />
                <span className="hidden sm:inline">Images</span>
              </>
            ) : (
              <>
                <MapPin size={16} />
                <span className="hidden sm:inline">Location</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Content */}
      <div className="px-4 pt-4">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="w-full rounded-xl overflow-hidden"
        >
          <SwiperSlide>
            {viewMode ? (
              complaint.location ? (
                <div className="w-full relative">
                  <MapContainer
                    center={complaint.location
                      .split(",")
                      .map((coord) => Number.parseFloat(coord).toFixed(3))
                      .map(Number)}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={complaint.location.split(",").map(Number)}
                      icon={pinIcon}
                    >
                      <Popup className="font-medium">
                        {complaint.category} reported here
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {complaint.location}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-100 text-gray-500 rounded-lg">
                  <MapPin size={24} className="mb-2" />
                  <span>Location data not available</span>
                </div>
              )
            ) : complaint.image ? (
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]">
                <Image
                  src={complaint.image}
                  alt="Complaint Image"
                  fill
                  className="object-cover rounded-lg"
                  priority={false}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-100 text-gray-500 rounded-lg">
                <ImageIcon size={24} className="mb-2" />
                <span>No image available</span>
              </div>
            )}
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Status and Actions */}
      <div className="px-5 py-3 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition duration-200 ${
              hasLiked
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ThumbsUp size={16} className={hasLiked ? "fill-orange-600" : ""} />
            <span className="font-medium text-sm">{upvotes}</span>
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200"
          >
            <MessageCircle size={16} />
            <span className="font-medium text-sm">{commentsLength}</span>
          </button>
        </div>

        <span
          className={`px-3 py-1 rounded-full font-medium text-sm ${
            complaint.status === "pending"
              ? "bg-red-200 text-red-700"
              : complaint.status === "resolved"
              ? "bg-green-200 text-green-700"
              : "bg-yellow-200 text-yellow-700"
          }`}
        >
          {complaint.status === "pending"
            ? "Pending"
            : complaint.status === "resolved"
            ? "Resolved"
            : "In Progress"}
        </span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
          <div className="mb-3">
            {comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold">
                      {comment.user_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <div className="italic text-xs text-gray-800">
                          {comment.user_name || "Anonymous"}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {comment.comment_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No comments yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comment Input */}
      <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newComment.trim()) {
                handleCommentSubmit();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            className={`p-2 rounded-full ${
              newComment.trim()
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-400"
            } transition duration-200`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Toggle Comments Button */}
      <button
        onClick={toggleComments}
        className="w-full py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-1 text-sm"
      >
        {showComments ? (
          <>
            <ChevronUp size={16} />
            Hide Comments
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            Show Comments
          </>
        )}
      </button>
    </div>
  );
}

export default ComplainCard;
