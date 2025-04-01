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

function OfficerComplaints() {
  const [complaints, setComplaints] = useState([]);
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
      }
    }
    fetchComplaints();
  }, []);

  const toggleView = (id) => {
    setViewMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open modal for comments
  const openCommentsModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Close modal
  const closeCommentsModal = () => {
    setSelectedComplaint(null);
  };

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
                <button className="bg-green-300 border border-green-400 font-medium px-3 py-1 rounded-md hover:bg-green-400 transition text-xs shadow">
                  Change Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeCommentsModal}
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-text mb-4">
              Comments for {selectedComplaint.category}
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {selectedComplaint.comments ? (
                selectedComplaint.comments
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by time (latest first)
                  .map((comment, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <p className="text-sm font-semibold">{comment.user}</p>
                      <p className="text-xs text-gray-700">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-sm">No comments available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerComplaints;