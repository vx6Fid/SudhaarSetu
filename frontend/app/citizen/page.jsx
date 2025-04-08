"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import ComplainCard from "../components/ComplainCard";

function Page() {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);

  const categories = ["Road Repair", "Water Supply", "Garbage Collection", "Pothole"];
  const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 16", "Ward 17"];

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const city = localStorage.getItem("user-city");
        let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`);

        if (city) url.searchParams.append("city", city);
        if (selectedWard) url.searchParams.append("ward", selectedWard);
        if (selectedCategory) url.searchParams.append("category", selectedCategory);

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
    <div className="p-4 bg-background min-h-screen">
      {/* ✅ Green Banner (Dismissable) */}
      {showBanner && (
        <div className="flex bg-secondary text-black px-4 py-3 rounded-md shadow-md w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              <strong>Welcome {localStorage.getItem("user-name").split(" ")[0]}!</strong>
              <br /> Track Your Complaints and View Updates {":)"}
            </span>
            <button onClick={() => setShowBanner(false)}>
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Responsive Filter & Search Section */}
      <div className="flex flex-col md:flex-row items-center w-full gap-3 mt-4">
        {/* Category Dropdown */}
        <div className="relative w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2 bg-slate-700 text-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Ward No. Dropdown */}
        <div className="relative w-full md:w-auto">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full text-white md:w-48 px-4 py-2 bg-slate-700 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select Ward</option>
            {wards.map((ward, index) => (
              <option key={index} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center w-full bg-white md:w-auto border border-gray-300 rounded-lg px-4 py-2 shadow-md focus-within:ring-2 focus-within:ring-primary">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by title or Complaint ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Display Complaint Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaints && complaints.length > 0 ? (
          complaints.map((complaint) => <ComplainCard key={complaint.id} complaint={complaint} />)
        ) : (
          <p className="text-gray-500">No complaints found.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
