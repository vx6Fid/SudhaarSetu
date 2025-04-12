"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import StatusUpdateModal from "../components/StatusUpdateModaal";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

function OfficerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? complaints.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === complaints.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleStatusClick = (id, status) => {
    const nextStatus = status === "in_progress" ? "resolved" : "in_progress";
    if (nextStatus === "resolved") {
      setSelectedComplaint({ id, nextStatus });
      setModalOpen(true);
    } else {
      updateComplaintStatus(id, nextStatus);
    }
  };

  const handleConfirmUpload = (file) => {
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      selectedComplaint.nextStatus,
      file
    );
  };

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

  useEffect(() => {
    async function fetchComplaints() {
      try {
        setIsLoading(true);
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );
        url.searchParams.append("officer", localStorage.getItem("userId"));

        const response = await fetch(url);
        const data = await response.json();

        const filteredComplaints = data.complaints.filter(
          (complaint) => complaint.status !== "resolved"
        );

        setComplaints(filteredComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Error fetching complaints");
      } finally {
        setIsLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (complaints.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [complaints.length, currentIndex]);

  const toggleView = (id) => {
    setViewMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function updateComplaintStatus(id, nextStatus, file) {
    setLoadingStatusId(id);
    const formData = new FormData();
    formData.append("status", nextStatus);
    if (file) formData.append("proof", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Status updated successfully");
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
        );
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingStatusId(null);
      setModalOpen(false);
    }
  }

  function getNextStatusLabel(currentStatus) {
    switch (currentStatus) {
      case "pending":
        return "Mark as In Progress";
      case "in_progress":
        return "Resolve Issue";
      default:
        return null;
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-600 border-red-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "";
    }
  }

  const complaintVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your assigned complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto mt-4 m-6 mr-6 ml-6 sm:p-6 rounded-xl mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 mt-5 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Assigned Complaints
        </h2>
        <p className="text-gray-600">
          {complaints.length} active{" "}
          {complaints.length === 1 ? "complaint" : "complaints"} to manage
        </p>
      </motion.div>

      {complaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm p-8 text-center border border-orange-100"
        >
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
            No Active Complaints
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
            You currently have no assigned complaints. Check back later or enjoy
            your free time!
          </p>
          <div className="mt-6">
            <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Refresh Dashboard
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="relative overflow-hidden" {...handlers}>
          {/* Carousel container */}
          <div ref={carouselRef} className="relative h-[520px] w-full">
            <AnimatePresence initial={false} custom={currentIndex}>
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  custom={currentIndex}
                  initial={{ opacity: 0, x: index > currentIndex ? 300 : -300 }}
                  animate={{
                    opacity: index === currentIndex ? 1 : 0.5,
                    x:
                      index === currentIndex
                        ? 0
                        : index > currentIndex
                        ? 300
                        : -300,
                    scale: index === currentIndex ? 1 : 0.9,
                    zIndex: index === currentIndex ? 1 : 0,
                  }}
                  exit={{ opacity: 0, x: index > currentIndex ? -300 : 300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute top-0 left-0 right-0 w-full ${
                    index === currentIndex
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                >
                  <div className="mx-auto max-w-md">
                    <motion.div
                      variants={complaintVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -5 }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="bg-gradient-to-b from-[#F8E7D2] to-white rounded-2xl shadow-sm overflow-hidden border border-orange-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 tracking-tight">
                              {complaint.category}
                            </h3>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(
                              complaint.status
                            )} flex items-center gap-1 shadow-inner`}
                          >
                            {getStatusIcon(complaint.status)}
                            {complaint.status === "pending"
                              ? "Pending"
                              : complaint.status === "in_progress"
                              ? "In Progress"
                              : "Resolved"}
                          </span>
                        </div>

                        <p className="text-gray-700 text-sm mb-5 line-clamp-2 leading-relaxed">
                          {complaint.description}
                        </p>

                        {/* Toggle Button for Image/Map */}
                        <button
                          className="w-full flex items-center justify-between py-2.5 px-4 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-all duration-300 mb-5 border border-gray-200 shadow-sm hover:shadow-md"
                          onClick={() => toggleView(complaint.id)}
                        >
                          <span className="flex items-center gap-2">
                            {viewMode[complaint.id] ? (
                              <>
                                <MapPin className="w-4 h-4 text-orange-600" />
                                <span>View Location</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 text-green-600" />
                                <span>View Image</span>
                              </>
                            )}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        {/* Complaint Image or Map */}
                        <div className="w-full h-52 rounded-xl overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={viewMode[complaint.id] ? "map" : "image"}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full"
                            >
                              {viewMode[complaint.id] ? (
                                complaint.image ? (
                                  <Image
                                    src={complaint.image}
                                    alt="Complaint Image"
                                    width={400}
                                    height={240}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 p-4">
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-gray-500 text-sm text-center">
                                      No image available for this complaint
                                    </p>
                                  </div>
                                )
                              ) : complaint.location ? (
                                <MapContainer
                                  center={complaint.location
                                    .split(",")
                                    .map(Number)}
                                  zoom={15}
                                  scrollWheelZoom={false}
                                  className="w-full z-0 h-full rounded-lg"
                                >
                                  <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  />
                                  {pinIcon && (
                                    <Marker
                                      position={complaint.location
                                        .split(",")
                                        .map(Number)}
                                      icon={pinIcon}
                                    >
                                      <Popup>
                                        {complaint.category} reported here.
                                      </Popup>
                                    </Marker>
                                  )}
                                </MapContainer>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 p-4">
                                  <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm text-center">
                                    Location data unavailable for this complaint
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Complaint Status & Actions */}
                        <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-full">
                              <ThumbsUp className="w-4 h-4 text-orange-800" />
                              <span className="text-xs font-semibold">
                                {complaint.upvotes} upvotes
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-full">
                              <MessageCircle className="w-4 h-4 text-green-900" />
                              <span className="text-xs font-semibold">
                                {complaint.total_comments} comments
                              </span>
                            </div>
                          </div>
                          <button
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-md ${
                              complaint.status === "pending"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : complaint.status === "in_progress"
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            } ${
                              loadingStatusId === complaint.id
                                ? "opacity-80 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleStatusClick(complaint.id, complaint.status)
                            }
                            disabled={loadingStatusId === complaint.id}
                          >
                            {loadingStatusId === complaint.id ? (
                              <span className="flex items-center gap-1.5">
                                <svg
                                  className="animate-spin h-3 w-3 text-white"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              <>
                                {getNextStatusLabel(complaint.status)}
                                {complaint.status === "in_progress" && (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {complaints.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous complaint"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next complaint"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Indicators */}
          {complaints.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {complaints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-orange-500 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to complaint ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <StatusUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmUpload}
      />
    </div>
  );
}

export default OfficerComplaints;
