"use client";

import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const EditProfile = () => {
  const [user, setUser] = useState({
    user_id: "",
    role: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    ward: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const storedUserID = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("userRole");

    if (!storedUserID || !storedUserRole) {
      setError(new Error("User ID or Role is missing in localStorage"));
      setLoading(false);
      return;
    }

    setUser((prevUser) => ({
      ...prevUser,
      user_id: storedUserID,
      role: storedUserRole,
    }));
  }, []);

  useEffect(() => {
    if (!user.user_id || !user.role) return;

    const fetchUserDetails = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`);
        url.searchParams.append("user_id", user.user_id);
        url.searchParams.append(
          "role",
          user.role === "field_officer" || user.role === "call_center"
            ? "officer"
            : "citizen"
        );

        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser((prevUser) => ({
          ...prevUser,
          ...data.user,
        }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.user_id, user.role]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/update-user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // Check if user is a citizen
  const isCitizen = user.role === "citizen";

  return (
    <div>
      <div className="mx-2 relative bg-secondary h-36 flex items-center rounded-lg px-2 my-2 justify-center">
        <button className="absolute left-4 top-4 text-white">
          <Link href="/citizen/profile">
            <FiArrowLeft size={24} />
          </Link>
        </button>
        <h1 className="text-white text-2xl font-semibold">Edit Profile</h1>
      </div>

      <div className="max-w-lg mx-auto p-6">
        {successMessage && (
          <p className="text-green-700 bg-green-100 p-2 rounded-md">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-background border border-gray-400 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-background border border-gray-400 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full bg-background border border-gray-400 p-2 rounded-md"
            />
          </div>

          {/* State (Disabled if not a citizen) */}
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <input
              type="text"
              name="state"
              value={user.state}
              onChange={handleChange}
              disabled={!isCitizen}
              className={`w-full bg-background border border-gray-400 p-2 rounded-md ${
                !isCitizen ? "bg-gray-200 text-gray-600 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* City (Disabled if not a citizen) */}
          <div>
            <label className="block text-gray-700 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              disabled={!isCitizen}
              className={`w-full bg-background border border-gray-400 p-2 rounded-md ${
                !isCitizen ? "bg-gray-200 text-gray-600 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Ward (Disabled if not a citizen) */}
          <div>
            <label className="block text-gray-700 font-medium">Ward</label>
            <input
              type="text"
              name="ward"
              value={user.ward}
              onChange={handleChange}
              disabled={!isCitizen}
              className={`w-full bg-background border border-gray-400 p-2 rounded-md ${
                !isCitizen ? "bg-gray-200 text-gray-600 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 bg-opacity-90 text-white py-2 rounded-md hover:bg-green-900 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
