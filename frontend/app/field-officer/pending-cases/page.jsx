"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
const DynamicMapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  X as CloseIcon,
  Clock,
  CheckCircle,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function PendingCases() {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
    async function fetchPendingComplaints() {
      try {
        setIsLoading(true);
        const ward = localStorage.getItem("user-ward");
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );
        url.searchParams.append("ward", ward);

        const response = await fetch(url);
        const data = await response.json();

        const filteredComplaints = data.complaints.filter(
          (complaint) =>
            complaint.status === "pending" && !complaint.field_officer_id
        );

        setPendingComplaints(filteredComplaints);
      } catch (error) {
        console.error("Error fetching pending complaints:", error);
        toast.error("Failed to load complaints");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPendingComplaints();
  }, []);

  const toggleView = (id) => {
    setViewMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const acceptComplaint = async (id) => {
    try {
      const userName = localStorage.getItem("user-name");
      if (!userName) {
        toast.error("Username not found, Try logging in again");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user_name: userName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to accept complaint");
        return;
      }

      setPendingComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );

      toast.success("Complaint accepted successfully!");
    } catch (error) {
      console.error("Error accepting complaint:", error);
      toast.error("Something went wrong while accepting complaint");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 mt-6 mx-auto text-center w-fit"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Clock className="text-yellow-500 mr-3" size={32} />
          Pending Complaints
        </h2>
        <p className="text-gray-600">
          Review and accept new complaints in your ward
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : pendingComplaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm p-8 text-center border border-blue-100 "
        >
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Pending Complaints
          </h3>
          <p className="text-gray-600 text-lg mb-4">
            There are currently no unassigned complaints in your ward.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Refresh
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {pendingComplaints.map((complaint) => (
              <motion.div
                key={complaint.id}
                variants={itemVariants}
                layout
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {complaint.category}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {complaint.description}
                  </p>

                  <button
                    className="w-full flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors mb-4"
                    onClick={() => toggleView(complaint.id)}
                  >
                    <span className="flex items-center gap-2">
                      {viewMode[complaint.id] ? (
                        <MapPin className="w-4 h-4 text-blue-500" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-purple-500" />
                      )}
                      {viewMode[complaint.id] ? "View Image" : "View Location"}
                    </span>
                  </button>

                  <motion.div
                    key={viewMode[complaint.id] ? "map" : "image"}
                    variants={imageVariants}
                    className="w-full h-48 rounded-lg overflow-hidden relative bg-gray-50 border border-gray-200"
                  >
                    {!viewMode[complaint.id] ? (
                      complaint.image ? (
                        <Image
                          src={complaint.image}
                          alt="Complaint Image"
                          width={600}
                          height={240}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm text-center">
                            No image available
                          </p>
                        </div>
                      )
                    ) : complaint.location ? (
                      <DynamicMapView
                        location={complaint.location}
                        category={complaint.category}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm text-center">
                          Location data unavailable
                        </p>
                      </div>
                    )}
                  </motion.div>

                  <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full">
                        <ThumbsUp className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">
                          {complaint.upvotes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full">
                        <MessageCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium">
                          {complaint.total_comments}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => acceptComplaint(complaint.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Accept Complaint
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default PendingCases;
