"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";

function page() {
  const [showBanner, setShowBanner] = useState(true);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        let url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );

        url.searchParams.append("officer", localStorage.getItem("userId"));

        const response = await fetch(url);
        const data = await response.json();
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }

    fetchComplaints();
  }, []);

  return (
    <div>
      {/* Banner (Dismissable) */}
      {showBanner && (
        <div className="flex bg-secondary text-black px-4 py-3 rounded-md shadow-md w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">
              <strong>
                Welcome, {localStorage.getItem("user-name").split(" ")[0]}!
              </strong>
              <br /> Here are Complaints Assigned to you {":)"}
            </span>
            <button onClick={() => setShowBanner(false)}>
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
      )}
      <div className="w-fit p-2 bg-[#333436] rounded-lg ml-1 mt-4 text-white text-center">Assigned Complaints</div>
      {/* Below is the part to the show the complain Carousel */}
      {complaints && <div>Yo</div>}
    </div>
  );
}

export default page;
