"use client";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FileComplaint() {
  const [formData, setFormData] = useState({
    user_id: typeof window !== "undefined" ? localStorage.getItem("userId") : "",
    category: "",
    location: "",
    image: "",
    ward_no: "",
    city: "",
    state: "",
    org_name: typeof window !== "undefined" ? localStorage.getItem("user-org") : "",
  });

  const router = useRouter();

  const L = typeof window !== "undefined" ? require("leaflet") : null;
  const pinIcon = L
    ? new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [32, 32],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      })
    : null;

  const [uploading, setUploading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({ ...prev, location: `${lat}, ${lng}` }));
      },
    });

    return markerPosition ? <Marker position={markerPosition} icon={pinIcon} /> : null;
  }

  function FlyToLocation({ position }) {
    const map = useMap();
    if (position) map.flyTo(position, 15);
    return null;
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const pos = [latitude, longitude];
        setMarkerPosition(pos);
        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
      },
      (err) => {
        toast.error("Unable to retrieve your location.", err);
      }
    );
  };

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
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed. Try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast.error("User not authenticated");
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
        toast.success("Complaint filed successfully!");
        const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
        if (role === "citizen") {
          router.push("/citizen");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error filing complaint:", error);
      toast.error("Failed to submit complaint.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary py-4 px-6">
          <h2 className="text-2xl font-bold text-white">File a Complaint</h2>
          <p className="text-indigo-100">Help us improve your community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Issue Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-green-900 transition"
              required
            >
              <option value="">Select an issue category</option>
              <option value="Garbage Collection">Garbage Collection</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Street Light Issue">Street Light Issue</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="Public Health">Public Health</option>
              <option value="Illegal Construction">Illegal Construction</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <button
                type="button"
                className="text-sm bg-green-100 text-primary px-3 py-1 rounded-full hover:bg-green-200 transition flex items-center"
                onClick={getCurrentLocation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use Current Location
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                className="h-64 w-full z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                {markerPosition && <FlyToLocation position={markerPosition} />}
              </MapContainer>
            </div>

            {markerPosition && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-primary">
                  <span className="font-medium">Selected Location:</span> {formData.location}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Photo Evidence
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-green-600 rounded-lg cursor-pointer transition hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-7">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Uploaded"
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="pt-1 text-sm text-gray-500">
                        {uploading ? "Uploading..." : "Click to upload an image"}
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="opacity-0"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ward Number</label>
              <input
                type="number"
                name="ward_no"
                value={formData.ward_no}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition"
                required
                placeholder="Ward number"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition"
                required
                placeholder="City name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 transition"
                required
                placeholder="State"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
