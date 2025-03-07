"use client";
import React, { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";

function Page() {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const categories = ["Road Repair", "Water Supply", "Garbage Collection"];
  const wards = ["Ward 1", "Ward 2", "Ward 3"];

  return (
    <div className="p-4 bg-background min-h-screen">
      {/* ✅ Green Banner (Dismissable) */}
      {showBanner && (
        <div className="flex bg-secondary text-black px-4 py-3 rounded-md shadow-md w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              <strong>Welcome Rohan!</strong> <br />
              Track Your Complaints and View Updates :)
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
            <option value="" disabled>
              Select Category
            </option>
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
            <option value="" disabled>
              Select Ward
            </option>
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
            placeholder="Search"
            className="outline-none bg-transparent w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* ✅ Display Selected Values */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Selected Category: {selectedCategory || "None"}</p>
        <p>Selected Ward: {selectedWard || "None"}</p>
      </div>
    </div>
  );
}

export default Page;
