import React from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";

function ViewProfile({ userDet }) {
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user-city");
    localStorage.removeItem("user-name");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <div className="min-h-screen bg-background text-gray-800 w-full verflow-hidden">
      {/* Header Section */}
      <div className="mx-2 relative bg-secondary h-36 flex items-center rounded-lg px-2 mt-2 justify-center">
        <button className="absolute left-4 top-4 text-white">
          <Link href="/citizen">
            <FiArrowLeft size={24} />
          </Link>
        </button>
        <h1 className="text-white text-xl font-semibold">Profile</h1>
      </div>
      {/* Profile Image */}
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-12 w-24 h-24 bg-black rounded-full border-4 border-white overflow-hidden z-10 max-w-full">
          <img
            src="https://singlecolorimage.com/get/517a5c/24x24"
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-3xl">
            {userDet.name ? userDet.name[0] : ""}
          </div>
        </div>
      </div>
      <button className="mx-2 mt-2 px-2 py-1 bg-green-950 text-white text-sm rounded-md shadow">
        <Link href="/citizen/profile/edit">Edit Profile</Link>
      </button>

      {/* Personal Information Section */}
      <div className="mt-6 p-4 rounded-lg">
        <h3 className="bg-secondary w-full px-2 py-1 rounded-lg text-white font-semibold text-lg mb-2">
          Personal Information
        </h3>
        <p className="flex space-x-2">
          <strong>Name:</strong> <span>{userDet.name || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>Email Address:</strong> <span>{userDet.email || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>Phone Number:</strong> <span>{userDet.phone || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>State:</strong> <span>{userDet.state || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>City:</strong> <span>{userDet.city || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>Ward Number:</strong> <span>{userDet.ward || "N/A"}</span>
        </p>
      </div>

      {/* ✅ Account Information Section */}
      <div className="mt-0 p-4 rounded-lg">
        <h3 className="bg-secondary w-full px-2 py-1 rounded-lg text-white font-semibold text-lg mb-2">
          Account Information
        </h3>
        <p className="flex space-x-2">
          <strong>User ID:</strong> <span>{userDet.id || "N/A"}</span>
        </p>
        <p className="flex space-x-2">
          <strong>Account Type:</strong>{" "}
          <span>
            {userDet.role.charAt(0).toUpperCase() + userDet.role.slice(1)}
          </span>
        </p>
        <p className="flex space-x-2">
          <strong>Date of Registration:</strong>{" "}
          <span>
            {userDet.created_at
              ? new Date(userDet.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </p>
      </div>

      {/* Password and Logout */}
      <div className="mt-0 p-4 rounded-lg">
        <h3 className="bg-secondary w-full px-2 py-1 rounded-lg text-white font-semibold text-lg mb-2">
          Security
        </h3>
        <button className="w-full flex text-left py-2 hover:text-green-500">
          <TbLockPassword className="text-2xl mr-2" /> Change Password
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex text-left py-2 hover:text-red-500"
        >
          <AiOutlineLogout className="text-2xl mr-2" /> Logout Account
        </button>
      </div>
    </div>
  );
}

export default ViewProfile;
