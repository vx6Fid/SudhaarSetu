"use client"; // 👈 Ensures this is a client-side component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ userRole }) => {
  const pathname = usePathname() || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div className="mx-1 my-1 h-20">
      <nav className="bg-background border border-black w-full fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="w-12 cursor-pointer" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="menu-button"
            aria-label="Toggle Menu"
            className="md:hidden text-2xl text-text"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userRole ? (
              <NavLinks userRole={userRole} pathname={pathname} />
            ) : (
              <>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 bg-primary text-white rounded-lg border-2 border-primary hover:bg-white hover:text-primary transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`fixed top-20 right-4 w-max bg-secondary md:hidden transition-transform rounded-lg ${
            menuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col items-center py-0 space-y-2">
            <NavLinks userRole={userRole} pathname={pathname} mobile />
          </div>
        </div>
      </nav>
    </div>
  );
};

/* Nav Links Component */
const NavLinks = ({ userRole, pathname, mobile }) => {
  const separator = mobile ? <hr className="w-full border-gray-300" /> : <span className="text-gray-400 mx-2">|</span>;

  return (
    <>
      {userRole === "citizen" ? (
        <div className={`flex ${mobile ? "flex-col w-full text-center" : "items-center space-x-3"}`}>
          <NavItem href="/citizen" pathname={pathname} text="Home" />
          {separator}
          <NavItem href="/citizen/track" pathname={pathname} text="Track" />
          {separator}
          <NavItem href="/citizen/my-complaints" pathname={pathname} text="My Complaints" />
          {separator}
          <NavItem href="/citizen/profile" pathname={pathname} text="Profile" />
        </div>
      ):
      userRole === "field_officer" ? (
        <div className={`flex ${mobile ? "flex-col w-full text-center" : "items-center space-x-3"}`}>
          <NavItem href="/field-officer" pathname={pathname} text="Home" />
          {separator}
          <NavItem href="/field-officer/closed-cases" pathname={pathname} text="Closed Cases" />
          {separator}
          <NavItem href="/field-officer/pending-cases" pathname={pathname} text="Pending Cases" />
          {separator}
          <NavItem href="/field-officer/profile" pathname={pathname} text="Profile" />
        </div>
      ):
      userRole === "admin" ? (
        <div className={`flex ${mobile ? "flex-col w-full text-center" : "items-center space-x-3"}`}>
          <NavItem href="/admin" pathname={pathname} text="Home" />
          {separator}
          <NavItem href="/admin/fieldOfficer" pathname={pathname} text="Field Officers" />
          {separator}
          <NavItem href="/admin/profile" pathname={pathname} text="Profile" />
        </div>
      ) :
      (
        <div className={`flex ${mobile ? "flex-col w-full text-center" : "items-center space-x-3"}`}>
          <NavItem href="/signup" pathname={pathname} text="Sign Up" />
          {separator}
          <NavItem href="/login" pathname={pathname} text="Login" />
        </div>
      )}
    </>
  );
};

/* Nav Item Component */
const NavItem = ({ href, pathname, text }) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-lg font-medium transition-all duration-200 ${
        pathname === href ? "text-primary font-semibold border-b-2 border-primary" : "text-gray-700 hover:text-primary"
      }`}
    >
      {text}
    </Link>
  );
};

export default Navbar;
