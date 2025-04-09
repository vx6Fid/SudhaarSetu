"use client";
import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiInbox,
  FiFilter,
} from "react-icons/fi";
import ComplainCard from "../components/ComplainCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Page() {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);

  const categories = [
    "Road Repair",
    "Water Supply",
    "Garbage Collection",
    "Pothole",
  ];
  const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 16", "Ward 17"];

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const city = localStorage.getItem("user-city");
        let url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );

        if (city) url.searchParams.append("city", city);
        if (selectedWard) url.searchParams.append("ward", selectedWard);
        if (selectedCategory)
          url.searchParams.append("category", selectedCategory);

        // If search query is a number, treat it as complaint_id
        if (searchQuery && !isNaN(searchQuery)) {
          url.searchParams.append("complaint_id", searchQuery);
        }

        const response = await fetch(url);
        const data = await response.json();
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }

    fetchComplaints();
  }, [selectedCategory, selectedWard, searchQuery]); // ✅ Fetch when filters or search query change

  return (
    <div className="p-6 min-h-screen ">
      {/* ✅ Green Banner (Dismissable) - Fixed duplicate structure */}
      {showBanner && (
        <div className="flex items-center justify-between bg-emerald-50 border border-secondary text-primary p-4 rounded-xl mb-8 shadow-sm backdrop-blur-sm bg-opacity-60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-emerald-100">
              <FiBell className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                Welcome back, {localStorage.getItem("user-name")?.split(" ")[0]}
                !
              </p>
              <p className="text-sm text-primary">
                Track your complaints and view updates in real-time
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <FiX className="text-emerald-600" />
          </button>
        </div>
      )}

      {/* ✅ Enhanced Filter & Search Section */}
      <div className="bg-orange-100 p-5 rounded-2xl shadow-sm border  mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FiFilter className="mr-2" /> Filter Complaints
        </h2>

        <div className="flex flex-col md:flex-row items-center w-full gap-4">
          {/* Category Dropdown */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary  transition-all appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ward No. Dropdown */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward No.
            </label>
            <div className="relative">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all appearance-none"
              >
                <option value="">All Wards</option>
                {wards.map((ward, index) => (
                  <option key={index} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or Complaint ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Grid Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {complaints.length}{" "}
            {complaints.length === 1 ? "Complaint" : "Complaints"} Found
          </h2>
        </div>

        {/* Display Complaint Cards as Carousel */}
        {complaints && complaints.length > 0 ? (
          <div className="px-4">
            {" "}
            {/* Add some padding for better mobile view */}
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
            >
              {complaints.map((complaint) => (
                <div key={complaint.id} className="px-2">
                  {" "}
                  {/* Add padding between slides */}
                  <ComplainCard complaint={complaint} />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiInbox className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No complaints found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
