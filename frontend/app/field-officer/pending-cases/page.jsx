"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  X as CloseIcon,
} from "lucide-react";

function PendingCases() {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({});

  const pinIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [32, 32],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      }),
    []
  );

  useEffect(() => {
    async function fetchPendingComplaints() {
      try {
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">
        Pending Complaints
      </h2>

      {pendingComplaints.length === 0 ? (
        <p className="text-secondary">No pending complaints in your ward.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {pendingComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-background shadow-md rounded-lg p-4 sm:p-5 border border-gray-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-text">
                {complaint.category}
              </h3>
              <p className="text-secondary text-sm mt-1">
                {complaint.description}
              </p>

              <button
                className="mt-3 text-sm px-3 py-2 rounded bg-primary text-white flex items-center gap-2 hover:bg-accent transition"
                onClick={() => toggleView(complaint.id)}
              >
                {viewMode[complaint.id] ? (
                  <MapPin size={18} />
                ) : (
                  <ImageIcon size={18} />
                )}
                {viewMode[complaint.id] ? "View Image" : "View Map"}
              </button>

              <div className="w-full h-52 sm:h-60 mt-3 border border-gray-400 rounded-lg overflow-hidden">
                {!viewMode[complaint.id] ? (
                  complaint.image ? (
                    <Image
                      src={complaint.image}
                      alt="Complaint Image"
                      width={600}
                      height={240}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-gray-500 flex items-center justify-center h-full text-center text-sm">
                      No image available
                    </p>
                  )
                ) : complaint.location ? (
                  <MapContainer
                    center={complaint.location.split(",").map(Number)}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0 rounded"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={complaint.location.split(",").map(Number)}
                      icon={pinIcon}
                    >
                      <Popup>{complaint.category} reported here.</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <p className="text-gray-500 flex items-center justify-center h-full text-center text-sm">
                    Invalid location data
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center text-sm text-text">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{complaint.upvotes}</span>
                  </div>
                  <p className="flex items-center gap-1 text-blue-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">
                      {complaint.total_comments} Comments
                    </span>
                  </p>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">
                    Pending
                  </span>
                </div>
                <button
                  className="bg-green-500 border border-green-600 font-medium px-3 py-1 rounded-md hover:bg-green-600 transition text-xs shadow text-white"
                  onClick={() => acceptComplaint(complaint.id)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingCases;