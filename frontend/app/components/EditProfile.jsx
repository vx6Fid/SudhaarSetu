"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
          user.role === "field_officer" ? "officer" : user.role
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

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );

  const isCitizen = user.role === "citizen";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen text-gray-800 w-full overflow-hidden relative pl-6 pr-6"
    >
      {/* Floating bubbles background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 800,
              x: Math.random() * 800,
              opacity: 0.3 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: [0, -200 - Math.random() * 300],
              x: ["0%", `${Math.random() * 50 - 25}%`],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            className="absolute w-3 h-3 bg-primary rounded-full blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      {/* Header Section */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative bg-gradient-to-br from-secondary to-primary h-52 flex items-center rounded-b-3xl px-6 justify-center shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-b-3xl"></div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-6 top-6 text-white bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-sm hover:bg-white/30 transition-all"
        >
          <Link href={`/${user.role}/profile`}>
            <FiArrowLeft size={20} />
          </Link>
        </motion.button>
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Edit Profile
        </h1>
      </motion.div>

      {/* Form Section */}
      <div className="max-w-lg mx-auto p-6 mt-8">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl flex items-center gap-2"
          >
            <IoMdCheckmarkCircleOutline size={20} className="text-green-600" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl"
          >
            Error: {error.message}
          </motion.div>
        )}

        <motion.form
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Name
              </label>
              <motion.input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                whileFocus={{ scale: 1.01 }}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <motion.input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                whileFocus={{ scale: 1.01 }}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Phone
              </label>
              <motion.input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                whileFocus={{ scale: 1.01 }}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                State
              </label>
              <motion.input
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                disabled={!isCitizen}
                whileFocus={{ scale: isCitizen ? 1.01 : 1 }}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  isCitizen
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                City
              </label>
              <motion.input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                disabled={!isCitizen}
                whileFocus={{ scale: isCitizen ? 1.01 : 1 }}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                  isCitizen
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>

            {user.role !== "admin" && (
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Ward
                </label>
                <motion.input
                  type="text"
                  name="ward"
                  value={user.ward}
                  onChange={handleChange}
                  disabled={!isCitizen}
                  whileFocus={{ scale: isCitizen ? 1.01 : 1 }}
                  className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${
                    isCitizen
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                />
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-medium shadow-lg hover:shadow-primary/30 transition-all"
          >
            Update Profile
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default EditProfile;
