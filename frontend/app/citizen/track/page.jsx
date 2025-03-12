"use client";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function TrackComplaint() {
  const [complainID, setComplainID] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setComplainID(e.target.value);
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
      setComplaint(data.complaint); // Directly set complaint object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="border border-gray-400  shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Track Your Complaint
        </h1>

        {/* Complaint Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center space-x-1">
            <input
              type="text"
              name="complainID"
              value={complainID}
              onChange={handleChange}
              placeholder="Enter Complaint ID"
              className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              className="flex items-center bg-green-800 hover:bg-green-900 text-white space-x-2 px-4 py-2 rounded-md transition"
            >
              <IoIosSearch className="text-xl" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Loading State */}
        {loading && <p className="text-gray-600 mt-2">Fetching details...</p>}

        {/* Complaint Details */}
        {complaint && (
          <div className="mt-6 p-4 bg-secondary border border-black rounded-lg">
            <h2 className="text-lg font-semibold text-white space-x-1">
              Complaint Details
            </h2>

            {/* Complaint Image */}
            {complaint.image && (
              <img
                src={complaint.image}
                alt="Complaint Image"
                className="w-full h-48 object-cover mt-2 rounded-md"
              />
            )}

            <p className="text-white space-x-1 mt-1">
              <strong>ID:</strong> <span>{complaint.id}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>Category:</strong> <span>{complaint.category}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>Location:</strong> <span>{complaint.location}</span>
            </p>

            <p className="text-white space-x-1">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-md text-white space-x-1 ${
                  complaint.status === "resolved"
                    ? "bg-green-600"
                    : complaint.status === "in progress"
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
              >
                {complaint.status}
              </span>
            </p>

            <p className="text-white space-x-1">
              <strong>Ward:</strong> <span>{complaint.ward_no}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>City:</strong> <span>{complaint.city}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>Filed On:</strong>{" "}
              <span>{new Date(complaint.created_at).toDateString()}</span>
            </p>

            <p className="text-white space-x-1">
              <strong>Upvotes:</strong> <span>{complaint.upvotes}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>Views:</strong> <span>{complaint.views}</span>
            </p>
            <p className="text-white space-x-1">
              <strong>Comments:</strong> <span>{complaint.total_comments}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
