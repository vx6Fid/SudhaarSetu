"use client";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import {
  FiClock,
  FiMapPin,
  FiTag,
  FiUser,
  FiCalendar,
  FiThumbsUp,
  FiEye,
  FiMessageSquare,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackComplaint() {
  const [complainID, setComplainID] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setComplainID(e.target.value);
    setError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!complainID.trim()) {
      setError("Please enter a valid Complaint ID");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint/${complainID}`
      );

      if (!response.ok) {
        throw new Error("Complaint not found");
      }

      const data = await response.json();
      setComplaint(data.complaint);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 800,
              x: Math.random() * 800,
              opacity: 0.3 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: [0, -200 - Math.random() * 300],
              x: ["0%", `${Math.random() * 50 - 25}%`],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            className="absolute w-3 h-3 bg-primary rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
          >
            Track Your Complaint
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Enter your complaint ID to view its status and details
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoIosSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                name="complainID"
                value={complainID}
                onChange={handleChange}
                placeholder="Enter Complaint ID (e.g. CP-12345)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white/80 shadow-sm"
              />
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-primary text-white space-x-2 px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              <IoIosSearch className="text-xl" />
              <span>Track</span>
            </motion.button>
          </div>
        </motion.form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg shadow-inner"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"
            ></motion.div>
            <p className="text-gray-600">Fetching complaint details...</p>
          </div>
        )}

        {/* Complaint Details */}
        <AnimatePresence>
          {complaint && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 p-6 max-w-full bg-gray-50 rounded-2xl shadow-inner backdrop-blur-sm"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 mb-4 flex items-center"
              >
                <div className="p-2 bg-gradient-to-r from-secondary to-primary rounded-lg mr-3 text-white">
                  <FiTag className="text-xl" />
                </div>
                Complaint #{complaint.id}
              </motion.h2>

              {/* Complaint Image */}
              {complaint.image && (
                <motion.div
                  variants={itemVariants}
                  className="mb-6 overflow-hidden rounded-xl shadow-lg border border-white/20"
                >
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="w-full h-56 object-cover"
                  />
                </motion.div>
              )}

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Left Column */}
                <div className="space-y-5">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-100 to-indigo-100 rounded-lg mr-3">
                      <FiTag className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">
                        {complaint.category}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-100 to-indigo-100 rounded-lg mr-3">
                      <FiMapPin className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {complaint.location}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-100 to-indigo-100 rounded-lg mr-3">
                      <FiUser className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ward & City</p>
                      <p className="font-medium text-gray-800">
                        {complaint.ward_no}, {complaint.city}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-100 to-indigo-100 rounded-lg mr-3">
                      <FiCalendar className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Filed On</p>
                      <p className="font-medium text-gray-800">
                        {new Date(complaint.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-100 to-indigo-100 rounded-lg mr-3">
                      <FiClock className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          complaint.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : complaint.status === "in progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-5 pt-2"
                  >
                    <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <FiThumbsUp className="mr-2" />
                      <span className="font-medium">{complaint.upvotes}</span>
                    </div>
                    <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <FiMessageSquare className="mr-2" />
                      <span className="font-medium">
                        {complaint.total_comments}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
