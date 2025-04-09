// components/MapView.jsx
"use client";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

export default function MapView({ location, category }) {
  const pinIcon = useMemo(() => {
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
      iconSize: [32, 32],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  }, []);

  const position = location.split(",").map(Number);

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full z-0 h-full rounded"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={pinIcon}>
        <Popup>{category} reported here.</Popup>
      </Marker>
    </MapContainer>
  );
}
