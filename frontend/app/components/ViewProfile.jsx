import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
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

  const role = localStorage.getItem('userRole');
  
  // Create moving dots background
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Dot parameters
    const dots = [];
    const dotCount = Math.floor((canvas.width * canvas.height) / 10000);
    const colors = ['FF9356', '#48A366', '#6366F1', '#EC4899'];

    // Create dots
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2
      });
    }

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        // Update position
        dot.x += Math.cos(dot.angle) * dot.speed;
        dot.y += Math.sin(dot.angle) * dot.speed;
        
        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.angle = Math.PI - dot.angle;
        if (dot.y < 0 || dot.y > canvas.height) dot.angle = -dot.angle;
        
        // Draw dot
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen text-gray-800 w-full overflow-hidden relative pl-6 pr-6 mt-0"
    >
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
          <Link href={role=='admin' ? '/admin' : (role=='citizen' ? '/citizen' : '/field-officer')}>
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
          className="mt-6 px-6 py-2.5 bg-primary  text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-2 hover:shadow-green-300 transition-all"
        >
          <Link href="/citizen/profile/edit" className="flex items-center gap-2">
            <FiEdit2 size={16} />
            Edit Profile
          </Link>
        </motion.button>
      </motion.div>

      {/* Profile Sections */}
      <div className="px-6 pb-20 mt-8 space-y-8 max-w-2xl mx-auto">
        {/* Personal Information Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Personal Information</h3>
          </div>
          
          <div className="space-y-5">
            <ProfileField label="Name" value={userDet.name || "N/A"} />
            <ProfileField label="Email" value={userDet.email || "N/A"} />
            <ProfileField label="Phone" value={userDet.phone || "N/A"} />
            <ProfileField label="State" value={userDet.state || "N/A"} />
            <ProfileField label="City" value={userDet.city || "N/A"} />
            {userDet.ward && <ProfileField label="Ward Number" value={userDet.ward} />}
          </div>
        </motion.div>

        {/* Account Information Section */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80 backdrop-blur-sm bg-white/80"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Account Information</h3>
          </div>
          
          <div className="space-y-5">
            <ProfileField label="User ID" value={userDet.id || "N/A"} />
            <ProfileField 
              label="Account Type" 
              value={userDet.role.charAt(0).toUpperCase() + userDet.role.slice(1)} 
            />
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Security</h3>
          </div>
          
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

export default ViewProfile;