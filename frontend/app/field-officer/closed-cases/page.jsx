"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Eye,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const DynamicMapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
});

function ClosedCases() {
  const [closedComplaints, setClosedComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({});
  const [showResolved, setShowResolved] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClosedComplaints() {
      try {
        setIsLoading(true);
        const ward = localStorage.getItem("user-ward");
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );
        url.searchParams.append("ward", ward);
        url.searchParams.append("status", "resolved");

        const response = await fetch(url);
        const data = await response.json();
        setClosedComplaints(data.complaints || []);
      } catch (error) {
        console.error("Error fetching closed complaints:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClosedComplaints();
  }, []);

  const toggleViewMode = (id) => {
    setViewMode((prev) => ({
      ...prev,
      [id]: prev[id] === "map" ? "image" : "map",
    }));
  };

  const toggleResolvedImage = (id) => {
    setShowResolved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 mt-6 mx-auto text-center w-fit"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <CheckCircle className="text-green-500 mr-3" size={32} />
          Successfully Resolved Cases
        </h2>
        <p className="text-gray-600">
          {closedComplaints.length}{" "}
          {closedComplaints.length === 1 ? "case" : "cases"} resolved in your
          ward
        </p>
      </motion.div>

      {closedComplaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm p-8 text-center border border-green-100"
        >
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            No resolved cases to display. This means either all issues are
            currently active or being processed.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closedComplaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Resolved
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(complaint.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {complaint.category}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => toggleViewMode(complaint.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    {viewMode[complaint.id] === "map" ? (
                      <>
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        Image
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-orange-500" />
                        Map
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleResolvedImage(complaint.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-purple-500" />
                    {showResolved[complaint.id] ? "Hide" : "Show"} Result
                  </button>
                </div>

                <div className="relative h-52 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <AnimatePresence mode="wait">
                    {viewMode[complaint.id] === "map" ? (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        {complaint.location ? (
                          <DynamicMapView
                            location={complaint.location}
                            category={complaint.category}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            <MapPin className="mr-2" />
                            No location data
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full relative"
                      >
                        {complaint.image ? (
                          <Image
                            src={complaint.image}
                            alt="Before resolution"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="mr-2" />
                            No before image
                          </div>
                        )}

                        {showResolved[complaint.id] && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
                            >
                              {complaint.resolved_image ? (
                                <Image
                                  src={complaint.resolved_image}
                                  alt="After resolution"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="text-center p-4">
                                  <CheckCircle className="mx-auto text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm">
                                    No after image available
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClosedCases;
