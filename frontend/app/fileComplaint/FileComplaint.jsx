"use client";
import { useState, useEffect } from "react";
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
    user_id: "",
    category: "",
    location: "",
    image: "",
    ward_no: "",
    city: "",
    state: "",
    org_name: "",
  });

  const [categories, setCategories] = useState([]);
  const [wards, setWards] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const router = useRouter();

  // Retrieve from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({
        ...prev,
        user_id: localStorage.getItem("userId") || "",
        org_name: localStorage.getItem("user-org") || "",
      }));
    }

    const fetchOrganizations = async () => {
      try {
        const orgName = localStorage.getItem("user-org");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ org_name: orgName }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch organization");
        }

        setCategories(data.organization.categories);
        setWards(data.organization.wards);
      } catch (error) {
        toast.error("Error Fetching Categories and Wards");
        console.log("fetchOrganizations error:", error.message);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (categories.length > 1 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[1],
      }));
    }
  }, [categories]);

  const L = typeof window !== "undefined" ? require("leaflet") : null;

  const pinIcon = L
    ? new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [32, 32],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      })
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const coords = [lat, lng];
        setMarkerPosition(coords);
        setFormData((prev) => ({ ...prev, location: `${lat}, ${lng}` }));
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition} icon={pinIcon} />
    ) : null;
  };

  const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) map.flyTo(position, 15);
    }, [position, map]);

    return null;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        setMarkerPosition(coords);
        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
      },
      () => {
        toast.error("Unable to retrieve your location.");
      }
    );
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgFormData = new FormData();
    imgFormData.append("image", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload-image`,
        {
          method: "POST",
          body: imgFormData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Image upload failed.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
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
        const role = localStorage.getItem("userRole");
        router.push(role === "citizen" ? "/citizen" : "/");
      } else {
        toast.error(data.error || "Failed to file complaint");
      }
    } catch (error) {
      console.error("Error:", error);
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
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Issue Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Location Picker */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm bg-green-100 text-primary px-3 py-1 rounded-full hover:bg-green-200 transition"
              >
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
                  <span className="font-medium">Selected Location:</span>{" "}
                  {formData.location}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Photo Evidence
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-64 border-2 border-dashed border-gray-300 hover:border-green-600 rounded-lg cursor-pointer transition hover:bg-gray-50 overflow-hidden">
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
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
                        {uploading
                          ? "Uploading..."
                          : "Click to upload an image"}
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ward
            </label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              {wards.map((ward, index) => (
                <option key={index} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          {/* Ward, City, State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "city",
                label: "City",
                type: "text",
                placeholder: "City name",
              },
              {
                name: "state",
                label: "State",
                type: "text",
                placeholder: "State",
              },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-900 transition"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
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
