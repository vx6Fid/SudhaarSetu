import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ViewProfile({ userDet }) {
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user-city");
    localStorage.removeItem("user-name");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const role = localStorage.getItem("userRole");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen text-gray-800 w-full overflow-hidden relative pl-6 pr-6 mt-0"
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
          <Link href={role === "admin" ? "/admin" : role === "citizen" ? "/citizen" : "/field-officer"}>
            <FiArrowLeft size={20} />
          </Link>
        </motion.button>
        <h1 className="text-white text-3xl font-bold tracking-tight">My Profile</h1>
      </motion.div>

      {/* Profile Image */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative flex flex-col items-center -mt-20 z-10"
      >
        <div className="w-36 h-36 bg-gradient-to-br from-accent to-orange-400 rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center relative">
          {userDet.name ? (
            <span className="text-white text-6xl font-bold">
              {userDet.name[0].toUpperCase()}
            </span>
          ) : (
            <div className="w-full h-full bg-gray-300"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 rounded-full"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-2 hover:shadow-green-300 transition-all"
        >
          <Link href="/citizen/profile/edit" className="flex items-center gap-2">
            <FiEdit2 size={16} />
            Edit Profile
          </Link>
        </motion.button>
      </motion.div>

      {/* Profile Sections */}
      <div className="px-6 pb-20 mt-8 space-y-8 max-w-2xl mx-auto relative z-10">
        {/* Personal Info */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <SectionHeader title="Personal Information" />
          <div className="space-y-5">
            <ProfileField label="Name" value={userDet.name || "N/A"} />
            <ProfileField label="Email" value={userDet.email || "N/A"} />
            <ProfileField label="Phone" value={userDet.phone || "N/A"} />
            <ProfileField label="State" value={userDet.state || "N/A"} />
            <ProfileField label="City" value={userDet.city || "N/A"} />
            {userDet.ward && <ProfileField label="Ward Number" value={userDet.ward} />}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <SectionHeader title="Account Information" />
          <div className="space-y-5">
            <ProfileField label="User ID" value={userDet.id || "N/A"} />
            <ProfileField label="Account Type" value={userDet.role.charAt(0).toUpperCase() + userDet.role.slice(1)} />
            <ProfileField
              label="Registration Date"
              value={
                userDet.created_at
                  ? new Date(userDet.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"
              }
            />
            <div className="flex items-center gap-2 text-emerald-600 mt-3">
              <IoMdCheckmarkCircleOutline size={22} className="text-emerald-500" />
              <span className="text-sm font-medium">Verified Account</span>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <SectionHeader title="Security" />
          <div className="space-y-4">
            <Link href="/change-password">
              <motion.button
                whileHover={{ x: 5 }}
                className="w-full flex items-center justify-between py-3.5 px-5 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-primary group-hover:bg-blue-100 transition-colors">
                    <TbLockPassword size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Change Password</span>
                </div>
                <div className="text-gray-300 group-hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            </Link>

            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 5 }}
              className="w-full flex items-center justify-between py-3.5 px-5 rounded-xl hover:bg-gray-50 transition-all group text-red-500"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                  <AiOutlineLogout size={20} />
                </div>
                <span className="font-medium">Logout</span>
              </div>
              <div className="text-gray-300 group-hover:text-red-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Reusable Profile Field Component
const ProfileField = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
    <span className="text-gray-500 font-medium min-w-[140px] text-sm tracking-wide">{label}</span>
    <span className="text-gray-800 font-medium break-all text-base">{value}</span>
  </div>
);

// Reusable Section Header
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h3>
  </div>
);

export default ViewProfile;
