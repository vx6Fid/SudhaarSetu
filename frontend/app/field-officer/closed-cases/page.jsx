"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Image as ImageIcon, MapPin, Repeat, Eye } from "lucide-react";

function ClosedCases() {
  const [closedComplaints, setClosedComplaints] = useState([]);
  const [viewMode, setViewMode] = useState({}); // Tracks image/map toggle state
  const [showResolved, setShowResolved] = useState({}); // Tracks resolved image visibility

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
    async function fetchClosedComplaints() {
      try {
        const ward = localStorage.getItem("user-ward");
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );
        url.searchParams.append("ward", ward);

        const response = await fetch(url);
        const data = await response.json();

        const filteredComplaints = data.complaints.filter(
          (complaint) => complaint.status === "resolved"
        );

        setClosedComplaints(filteredComplaints);
      } catch (error) {
        console.error("Error fetching closed complaints:", error);
      }
    }
    fetchClosedComplaints();
  }, []);

  const toggleViewMode = (id) => {
    setViewMode((prev) => ({
      ...prev,
      [id]: prev[id] === "map" ? "image" : "map",
    }));
  };

  const toggleResolvedImage = (id) => {
    setShowResolved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Closed Cases</h2>

      {closedComplaints.length === 0 ? (
        <p className="text-secondary">No resolved complaints in your ward.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {closedComplaints.map((complaint) => (
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

              <div className="flex gap-2 mt-4">
                <button
                  className="text-sm px-4 py-2 rounded bg-primary text-white flex items-center gap-2 hover:bg-accent transition"
                  onClick={() => toggleViewMode(complaint.id)}
                >
                  {viewMode[complaint.id] === "map" ? (
                    <ImageIcon size={18} />
                  ) : (
                    <MapPin size={18} />
                  )}
                  {viewMode[complaint.id] === "map" ? "View Image" : "View Map"}
                </button>

                <button
                  className="text-sm px-4 py-2 rounded bg-secondary text-white flex items-center gap-2 hover:bg-gray-700 transition"
                  onClick={() => toggleResolvedImage(complaint.id)}
                >
                  <Eye size={18} />{" "}
                  {showResolved[complaint.id]
                    ? "Hide Resolved"
                    : "Show Resolved"}
                </button>
              </div>

              <div className="w-full h-60 mt-3 border border-gray-400 rounded-lg overflow-hidden">
                {viewMode[complaint.id] !== "map" ? (
                  complaint.image ? (
                    <Image
                      src={complaint.image}
                      alt="Before Image"
                      width={600}
                      height={240}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-gray-500 flex items-center justify-center h-full">
                      Before Image Not Available
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

              {showResolved[complaint.id] && (
                <div className="w-full h-60 mt-3 border border-gray-400 rounded-lg overflow-hidden">
                  {complaint.resolve_image ? (
                    <Image
                      src={complaint.resolve_image}
                      alt="Resolved Image"
                      width={600}
                      height={240}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-gray-500 flex items-center justify-center h-full">
                      Resolved Image Not Available
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClosedCases;
