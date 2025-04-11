"use client";
import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiInbox,
  FiBell,
} from "react-icons/fi";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";

const ComplainCard = dynamic(() => import("../components/ComplainCard"), {
  ssr: false,
});

// Animation variants
const bannerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const filterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

function Page() {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Road Repair",
    "Water Supply",
    "Garbage Collection",
    "Pothole",
  ];
  const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 16", "Ward 17"];

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const city = localStorage.getItem("user-city");
        const name = localStorage.getItem("user-name") || "Citizen";
        setUserName(name.split(" ")[0]);

        let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`);
        if (city) url.searchParams.append("city", city);
        if (selectedWard) url.searchParams.append("ward", selectedWard);
        if (selectedCategory) url.searchParams.append("category", selectedCategory);
        if (searchQuery && !isNaN(searchQuery)) {
          url.searchParams.append("complaint_id", searchQuery);
        }

        const response = await fetch(url);
        const data = await response.json();
        
        // Animate the complaints update
        setComplaints([]); // Clear first for animation
        setTimeout(() => setComplaints(data.complaints || []), 300);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchComplaints, 500); // Debounce with longer delay for animation
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedWard, searchQuery]);

  return (
    <div className="p-4 md:p-6 w-full min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Welcome Banner with Animation */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              variants={bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-gradient-to-r from-secondary to-green-800 text-white p-5 rounded-2xl mb-8 shadow-lg overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <FiBell className="text-white text-xl" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome back, {userName}!</h2>
                    <p className="text-blue-100">
                      Track your complaints and view updates in real-time
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBanner(false)}
                  className="mt-3 md:mt-0 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <FiX className="text-white" />
                </motion.button>
              </div>
              <motion.div 
                animate={{ 
                  x: [0, 5, -5, 0],
                  y: [0, 5, -5, 0] 
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"
              ></motion.div>
              <motion.div 
                animate={{ 
                  x: [0, -3, 3, 0],
                  y: [0, -3, 3, 0] 
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-white/5"
              ></motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Section with Animation */}
        <motion.div
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          className="bg-[#F8E7D2] p-6 rounded-2xl shadow-md border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 flex items-center">
              <FiFilter className="mr-2 text-orange-500" />
              Filter Complaints
            </motion.h2>
            <motion.div variants={itemVariants} className="mt-3 md:mt-0 text-sm text-gray-500">
              {complaints.length} {complaints.length === 1 ? "result" : "results"} found
            </motion.div>
          </div>

          <motion.div variants={filterVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all appearance-none shadow-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </motion.select>
                <FiChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Ward Dropdown */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ward No.
              </label>
              <div className="relative">
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all appearance-none shadow-sm"
                >
                  <option value="">All Wards</option>
                  {wards.map((ward, index) => (
                    <option key={index} value={ward}>
                      {ward}
                    </option>
                  ))}
                </motion.select>
                <FiChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Search Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Search by title or Complaint ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Complaints Section */}
        <div className="max-w-full p-4 sm:p-6 rounded-2xl">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"
                ></motion.div>
                <motion.p 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gray-600"
                >
                  Loading complaints...
                </motion.p>
              </motion.div>
            ) : complaints.length > 0 ? (
              <motion.div
                key="complaints"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6"
                >
                  Recent Complaints
                </motion.h3>
                <div className="px-0 sm:px-2">
                  <Slider
                    dots={true}
                    infinite={false}
                    speed={500}
                    slidesToShow={3}
                    slidesToScroll={1}
                    responsive={[
                      {
                        breakpoint: 1280,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 768,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ]}
                    className="pb-8"
                  >
                    {complaints.map((complaint, index) => (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-2 w-full"
                      >
                        <ComplainCard complaint={complaint} />
                      </motion.div>
                    ))}
                  </Slider>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                  <FiInbox className="text-gray-400 text-2xl sm:text-3xl" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl font-medium text-gray-700 mb-2"
                >
                  No complaints found
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 max-w-md mx-auto px-4"
                >
                  {selectedCategory || selectedWard || searchQuery
                    ? "Try adjusting your filters or search query"
                    : "There are currently no complaints to display"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Page;