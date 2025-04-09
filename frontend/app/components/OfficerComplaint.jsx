"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  X as CloseIcon,
} from "lucide-react";
import StatusUpdateModal from "../components/StatusUpdateModaal";

function OfficerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  const handleStatusClick = (id, status) => {
    const nextStatus = status === "in_progress" ? "resolved" : "in_progress";
    if (nextStatus === "resolved") {
      setSelectedComplaint({ id, nextStatus });
      setModalOpen(true);
    } else {
      updateComplaintStatus(id, nextStatus); // Direct update for in_progress
    }
  };

  const handleConfirmUpload = (file) => {
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      selectedComplaint.nextStatus,
      file
    );
  };

  const pinIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
      iconSize: [32, 32],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  }, []);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );
        url.searchParams.append("officer", localStorage.getItem("userId"));

        const response = await fetch(url);
        const data = await response.json();

        // Filter complaints where status is not 'resolved'
        const filteredComplaints = data.complaints.filter(
          (complaint) => complaint.status !== "resolved"
        );

        setComplaints(filteredComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Error fetching complaints");
      }
    }
    fetchComplaints();
  }, []);

  const toggleView = (id) => {
    setViewMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function updateComplaintStatus(id, nextStatus, file) {
    setLoadingStatusId(id);
    const formData = new FormData();
    formData.append("status", nextStatus);
    if (file) formData.append("proof", file);

    try {
      const token = localStorage.getItem("token"); // Assuming you store auth token in localStorage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Status updated successfully");
        window.location.reload(); // Refresh complaints
        setLoadingStatusId(null);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingStatusId(null);
    }
  }

  // Get the button text to change the status of complaint
  function getNextStatusLabel(currentStatus) {
    switch (currentStatus) {
      case "pending":
        return "Mark as In Progress";
      case "in_progress":
        return "Mark as Resolved";
      default:
        return null;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Assigned Complaints
      </h2>

      {complaints.length === 0 ? (
        <p className="text-secondary">No complaints assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
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

              {/* Toggle Button for Image/Map */}
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

              {/* Complaint Image or Map */}
              <div className="w-full h-60 mt-3 border border-gray-400 rounded-lg overflow-hidden">
                {viewMode[complaint.id] ? (
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
                    className="w-full z-0 h-full rounded"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {pinIcon && (
                      <Marker
                        position={complaint.location.split(",").map(Number)}
                        icon={pinIcon}
                      >
                        <Popup>{complaint.category} reported here.</Popup>
                      </Marker>
                    )}
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

                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">
                    {complaint.total_comments}
                  </span>
                  <span
                    className={`text-xs font-semibold border border-black  px-3 py-1 rounded-full ${
                      complaint.status === "pending"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-200 text-yellow-600"
                    }`}
                  >
                    {complaint.status === "pending" ? "Pending" : "Ongoing"}
                  </span>
                </div>
                <button
                  className="bg-green-300 border border-green-400 font-medium px-3 py-1 rounded-md hover:bg-green-400 transition text-xs shadow"
                  onClick={() =>
                    handleStatusClick(complaint.id, complaint.status)
                  }
                >
                  {loadingStatusId === complaint.id ? (
                    <span className="animate-spin">🌀</span>
                  ) : (
                    getNextStatusLabel(complaint.status)
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <StatusUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmUpload}
      />
    </div>
  );
}

export default OfficerComplaints;
