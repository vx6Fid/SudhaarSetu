"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHome,
  FiList,
  FiClipboard,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname() || "";
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div className="h-22">
      <nav className="w-full px-5 pt-3 z-10">
        <div className="shadow-md border border-primary rounded-xl px-6 py-3">
          <div className="flex justify-between items-center max-w-8xl mx-auto">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 cursor-pointer"
              >
                <img src="/logo.png" alt="Logo" className="w-12 h-12" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {userRole ? (
                <>
                  <NavLinks userRole={userRole} pathname={pathname} />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-5 py-2 rounded-lg border-2 border-primary text-primary font-medium hover:bg-green-100 transition-all"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              id="menu-button"
              aria-label="Toggle Menu"
              className="md:hidden text-2xl text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="md:hidden fixed top-20 right-4 left-4 bg-gray-100 shadow-xl rounded-lg z-50 border border-gray-300"
              >
                <div className="flex flex-col py-4">
                  <NavLinks userRole={userRole} pathname={pathname} mobile />
                  {userRole && (
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-all"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
};

/* Nav Links Component */
const NavLinks = ({ userRole, pathname, mobile }) => {
  const commonClasses = mobile ? "flex-col space-y-2" : "space-x-6";

  return (
    <>
      {userRole === "citizen" ? (
        <div className={`flex ${commonClasses}`}>
          <NavItem
            href="/citizen"
            pathname={pathname}
            text="Home"
            icon={<FiHome />}
            mobile={mobile}
          />
          <NavItem
            href="/citizen/track"
            pathname={pathname}
            text="Track"
            icon={<FiList />}
            mobile={mobile}
          />
          <NavItem
            href="/citizen/my-complaints"
            pathname={pathname}
            text="My Complaints"
            icon={<FiClipboard />}
            mobile={mobile}
          />
          <NavItem
            href="/citizen/profile"
            pathname={pathname}
            text="Profile"
            icon={<FiUser />}
            mobile={mobile}
          />
        </div>
      ) : userRole === "field_officer" ? (
        <div className={`flex ${commonClasses}`}>
          <NavItem
            href="/field-officer"
            pathname={pathname}
            text="Home"
            icon={<FiHome />}
            mobile={mobile}
          />
          <NavItem
            href="/field-officer/closed-cases"
            pathname={pathname}
            text="Closed Cases"
            icon={<FiClipboard />}
            mobile={mobile}
          />
          <NavItem
            href="/field-officer/pending-cases"
            pathname={pathname}
            text="Pending Cases"
            icon={<FiList />}
            mobile={mobile}
          />
          <NavItem
            href="/field-officer/profile"
            pathname={pathname}
            text="Profile"
            icon={<FiUser />}
            mobile={mobile}
          />
        </div>
      ) : userRole === "admin" ? (
        <div className={`flex ${commonClasses}`}>
          <NavItem
            href="/admin"
            pathname={pathname}
            text="Home"
            icon={<FiHome />}
            mobile={mobile}
          />
          <NavItem
            href="/admin/fieldOfficer"
            pathname={pathname}
            text="Field Officers"
            icon={<FiUsers />}
            mobile={mobile}
          />
          <NavItem
            href="/admin/profile"
            pathname={pathname}
            text="Profile"
            icon={<FiUser />}
            mobile={mobile}
          />
        </div>
      ) : (
        <div className={`flex ${commonClasses}`}>
          <NavItem
            href="/signup"
            pathname={pathname}
            text="Sign Up"
            icon={<FiUser />}
            mobile={mobile}
          />
          <NavItem
            href="/login"
            pathname={pathname}
            text="Login"
            icon={<FiSettings />}
            mobile={mobile}
          />
        </div>
      )}
    </>
  );
};

/* Nav Item Component */
const NavItem = ({ href, pathname, text, icon, mobile }) => {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
          isActive
            ? "bg-green-50 text-primary font-medium"
            : "text-primary hover:bg-green-50"
        } ${mobile ? "mx-2" : ""}`}
      >
        <span
          className={`text-lg ${isActive ? "text-primary" : "text-gray-500"}`}
        >
          {icon}
        </span>
        <span>{text}</span>
        {isActive && (
          <motion.span
            layoutId="navActiveIndicator"
            className="absolute right-0 w-1 h-6 bg-primary rounded-l-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default Navbar;
