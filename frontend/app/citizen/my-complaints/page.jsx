"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FiPhone,
  FiFileText,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import { VscFeedback } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackPopup from "@/app/components/FeedbackPopup";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const fadeInUp = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const Page = () => {
  const [complaints, setComplaints] = useState([]);
  const [originalComplaints, setOriginalComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const userId =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!userId) return;

        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/complaints`
        );
        url.searchParams.append("user_id", userId);

        const response = await fetch(url);
        const data = await response.json();

        const complaintsArray = Array.isArray(data.complaints)
          ? data.complaints
          : [];

        setComplaints(complaintsArray);
        setOriginalComplaints(complaintsArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setIsLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = originalComplaints.filter((c) =>
        c.id.toString().includes(searchTerm)
      );
      setComplaints(filtered);
    } else {
      setComplaints(originalComplaints);
    }
  }, [searchTerm, originalComplaints]);

  const handleCall = () => {
    const phoneNumber = "9876540321";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber);
      alert("Phone number copied to clipboard: " + phoneNumber);
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeTab === "all") return true;
    return complaint.status?.trim().toLowerCase() === activeTab.toLowerCase();
  });

  const complaintStats = {
    pending: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "pending"
    ).length,
    resolved: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "resolved"
    ).length,
    inProgress: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "in progress"
    ).length,
  };

  const chartData = [
    { name: "Pending", value: complaintStats.pending, color: "#FF6B6B" },
    { name: "Resolved", value: complaintStats.resolved, color: "#51CF66" },
    { name: "In Progress", value: complaintStats.inProgress, color: "#FCC419" },
  ];

  const totalComplaints = complaints.length;
  const resolvedPercentage =
    totalComplaints > 0
      ? Math.round((complaintStats.resolved / totalComplaints) * 100)
      : 0;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-4 md:p-8 min-h-screen"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-emerald-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Complaint Dashboard
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Track and manage your complaints in one place
        </motion.p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Complaints
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {totalComplaints}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiFileText className="text-primary text-2xl" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Resolved</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {complaintStats.resolved}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${resolvedPercentage}%` }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Resolution Rate
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {resolvedPercentage}%
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <motion.div
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {resolvedPercentage > 70
                ? "Excellent"
                : resolvedPercentage > 40
                ? "Good"
                : "Needs improvement"}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        variants={fadeInUp}
        className="bg-orange-50 p-8 rounded-2xl shadow-lg border border-gray-100 mb-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 ml-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Complaints Distribution
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {chartData.map((entry) => (
                <motion.div
                  key={entry.name}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl cursor-pointer transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">
                    {entry.name}
                  </span>
                  <span className="ml-auto text-sm font-semibold bg-white px-3 py-1 rounded-full shadow-sm">
                    {entry.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[400px] lg:w-[500px] h-[300px] relative">
            <motion.div
              className="absolute inset-0 bg-gray-50 rounded-full blur-xl opacity-30"
              animate={pulseAnimation}
            />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => (
                    <motion.div
                      className="bg-gray-100 p-3 rounded-lg shadow-lg border border-gray-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-medium">{payload?.[0]?.name}</p>
                      <p className="text-sm">
                        {payload?.[0]?.value} complaints
                      </p>
                    </motion.div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons Section */}
      <motion.div
        variants={fadeInUp}
        className="px-4 sm:px-6 lg:px-0 mb-12 md:mb-16"
      >
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-xl border border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            Quick Actions
          </h3>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full">
            {/* Call Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 30px -10px rgba(239, 68, 68, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCall}
              className="w-full md:w-1/2 flex items-center justify-between gap-4 px-6 py-5 bg-gradient-to-br from-orange-600 to-accent text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <FiPhone className="text-2xl" />
                </div>
                <div className="text-left">
                  <span className="block text-lg md:text-xl">
                    Report Via Call
                  </span>
                  <span className="block text-sm font-normal opacity-90">
                    Immediate assistance
                  </span>
                </div>
              </div>
              <FiChevronRight className="text-xl opacity-80" />
            </motion.button>

            {/* File Complaint Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 30px -10px rgba(71, 95, 53, 1)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/fileComplaint")}
              className="w-full md:w-1/2 flex items-center justify-between gap-4 px-6 py-5 bg-gradient-to-br from-primary to-secondary text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <FiFileText className="text-2xl" />
                </div>
                <div className="text-left">
                  <span className="block text-lg md:text-xl">
                    File New Complaint
                  </span>
                  <span className="block text-sm font-normal opacity-90">
                    Detailed report
                  </span>
                </div>
              </div>
              <FiChevronRight className="text-xl opacity-80" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Complaints Table Section */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100/50 mb-12 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Complaints
            </h3>
            <p className="text-gray-500 mt-1">
              Track and manage your reported issues
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter by Complaint ID"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
              {["all", "pending", "in progress", "resolved"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-200/50"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-14 h-14 border-[3px] border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        ) : /* Empty State */
        filteredComplaints.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center shadow-inner">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              No {activeTab !== "all" ? activeTab : ""} complaints found
            </h4>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeTab === "all"
                ? "You haven't filed any complaints yet."
                : `You don't have any ${activeTab} complaints at the moment.`}
            </p>
            <motion.button
              onClick={() => router.push("/fileComplaint")}
              className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="inline mr-2" />
              File New Complaint
            </motion.button>
          </motion.div>
        ) : (
          /* Table with Data */
          <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-300 text-left text-gray-900 text-sm">
                    <th className="px-8 py-5 font-medium rounded-tl-2xl">
                      Complaint ID
                    </th>
                    <th className="px-6 py-5 font-medium">Category</th>
                    <th className="px-6 py-5 font-medium">Ward</th>
                    <th className="px-6 py-5 font-medium">Status</th>
                    <th className="px-8 py-5 font-medium rounded-tr-2xl text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  <AnimatePresence>
                    {filteredComplaints.map((complaint, index) => (
                      <motion.tr
                        key={complaint.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="hover:bg-green-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 font-medium text-gray-800">
                          <span className="bg-green-100 text-primary px-3 py-1.5 rounded-lg text-sm">
                            #{complaint.id}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-rose-400" />
                            <span className="font-medium text-gray-700">
                              {complaint.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-700 font-medium">
                          {complaint.ward_no}
                        </td>

                        <td className="px-6 py-5">
                          <motion.span
                            className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 ${
                              complaint.status?.toLowerCase() === "resolved"
                                ? "bg-green-50 text-green-700"
                                : complaint.status?.toLowerCase() === "pending"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {complaint.status?.toLowerCase() === "resolved" ? (
                              <FiCheckCircle className="text-green-500" />
                            ) : complaint.status?.toLowerCase() ===
                              "pending" ? (
                              <FiClock className="text-red-500" />
                            ) : (
                              <FiRefreshCw className="text-amber-500" />
                            )}
                            {complaint.status}
                          </motion.span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {complaint.status.toLowerCase() === "resolved" ? (
                            <motion.button
                              className="flex items-center justify-end gap-2 text-green-600 hover:text-green-800 font-medium transition w-full"
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                setSelectedComplaintId(complaint.id);
                                setShowFeedback(true);
                              }}
                            >
                              <span>Provide Feedback</span>
                              <FiChevronRight />
                            </motion.button>
                          ) : (
                            <motion.button
                              className="flex items-center justify-end gap-2 text-secondary hover:text-primary font-medium transition w-full"
                              whileHover={{ x: 5 }}
                              onClick={() =>
                                router.push(`/citizen/my-complaints/${complaint.id}`)
                              }
                            >
                              <span>View Details</span>
                              <FiChevronRight />
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-200/30 rounded-b-2xl">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredComplaints.length}</span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Feedback CTA */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden bg-gradient-to-r from-secondary to-primary p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 w-full shadow-2xl"
      >
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-accent rounded-full opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-green-400 rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="flex items-center gap-6 z-10">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            <VscFeedback className="text-white text-5xl md:text-6xl" />
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
              Help us improve our service
            </h3>
            <p className="text-green-100 text-sm md:text-base max-w-md">
              Your feedback helps us serve you better. Share your experience
              with resolved complaints.
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 text-lg hover:bg-gray-50 transition shadow-md z-10"
          onClick={() => {
            // Find first resolved complaint or use null
            const resolvedComplaint = complaints.find(
              (c) => c.status?.toLowerCase() === "resolved"
            );
            setSelectedComplaintId(resolvedComplaint?.id || null);
            setShowFeedback(true);
          }}
        >
          <span>Provide Feedback</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Feedback Popup */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackPopup
            user_id={localStorage.getItem("userId")}
            complaintId={selectedComplaintId}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Page;
