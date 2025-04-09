"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

export default function FileComplaint() {
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    image: "",
    ward_no: "",
    city: "",
    state: "",
  });

  const router = useRouter();

  // Import leaflet properly
  const L = require("leaflet");
  const pinIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
    iconSize: [32, 32],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });

  const [uploading, setUploading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle manual selection by clicking on the map
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({ ...prev, location: `${lat}, ${lng}` }));
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition} icon={pinIcon} />
    ) : null;
  }

  // Get user's current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition([latitude, longitude]);
        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
      },
      (error) => {
        alert("Unable to retrieve your location.");
      }
    );
  };

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
        console.log("Image uploaded successfully:", data.imageUrl);
        alert("Image uploaded successfully!");
      } else {
        console.log("Image upload failed:", data);
        alert("Image upload failed. Try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Complaint filed successfully!");
        const role = localStorage.getItem("userRole");
        if (role === "citizen") {
          router.push("/citizen");
        } else {
          router.push("/");
        }
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error filing complaint:", error);
      alert("Failed to submit complaint.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#F8E7D2] border text-primary border-gray-400 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">File a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Garbage Collection">Garbage Collection</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Street Light Issue">Street Light Issue</option>
            <option value="Road Maintenance">Road Maintenance</option>
            <option value="Public Health">Public Health</option>
            <option value="Illegal Construction">Illegal Construction</option>
          </select>
        </div>

        {/* Map Section */}
        <div className="mt-4">
          <label className="block font-medium mb-2">
            Select Location on Map
          </label>
          <button
            type="button"
            className="bg-green-600 text-white px-3 py-2 rounded-md mb-2"
            onClick={getCurrentLocation}
          >
            Use Current Location
          </button>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-64 w-full z-0 rounded"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
          {markerPosition && (
            <p className="mt-2 text-gray-700">
              Selected Location: {formData.location}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded-md"
          />
          {uploading && <p className="text-blue-500">Uploading...</p>}
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded"
              className="mt-2 w-full h-32 object-cover rounded-md"
            />
          )}
        </div>

        {/* Ward Number */}
        <div>
          <label className="block font-medium">Ward Number</label>
          <input
            type="number"
            name="ward_no"
            value={formData.ward_no}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        {/* State */}
        <div>
          <label className="block font-medium">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-secondary text-white p-2 rounded-md font-semibold hover:bg-primary"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
