"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Memoized pin icon
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

  const openCommentsModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closeCommentsModal = () => {
    setSelectedComplaint(null);
  };

  const acceptComplaint = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept complaint");
      }

      setPendingComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );
    } catch (error) {
      console.error("Error accepting complaint:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Pending Complaints
      </h2>

      {pendingComplaints.length === 0 ? (
        <p className="text-secondary">No pending complaints in your ward.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-background shadow-md rounded-lg p-5 border border-gray-300"
            >
              <h3 className="text-xl font-semibold text-text">
                {complaint.category}
              </h3>
              <p className="text-secondary text-sm mt-1">
                {complaint.description}
              </p>

              <button
                className="mt-4 text-sm px-4 py-2 rounded bg-primary text-white flex items-center gap-2 hover:bg-accent transition"
                onClick={() => toggleView(complaint.id)}
              >
                {viewMode[complaint.id] ? (
                  <MapPin size={18} />
                ) : (
                  <ImageIcon size={18} />
                )}
                {viewMode[complaint.id] ? "View Map" : "View Image"}
              </button>

              <div className="w-full h-60 mt-3 border border-gray-400 rounded-lg overflow-hidden">
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
                    <p className="text-gray-500 flex items-center justify-center h-full">
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
                  <p className="text-gray-500 flex items-center justify-center h-full">
                    Invalid location data
                  </p>
                )}
              </div>

              {/* Complaint Status & Actions */}
              <div className="mt-4 flex justify-between items-center text-sm text-text">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{complaint.upvotes}</span>
                  </div>
                  <button
                    onClick={() => openCommentsModal(complaint)}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">
                      {complaint.total_comments} Comments
                    </span>
                  </button>
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
