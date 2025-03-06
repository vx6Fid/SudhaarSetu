import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger and Close icons

const Navbar = ({ userRole }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle

  const linkStyle = "px-3 py-2 rounded-md border border-black";
  const activeStyle = "bg-primary text-white";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <div className="p-1">
      <nav className="bg-background text-text p-2 border border-gray-500 rounded-xl w-full">
        <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" className="w-12" />
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden text-xl p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Navigation Links */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full bg-white shadow-md rounded-lg md:static md:flex md:space-x-4 md:bg-transparent md:shadow-none md:w-auto md:items-center`}
          >
            {!userRole && (
              <div className="flex flex-col md:flex-row">
                <Link
                  href="/register"
                  className={`${linkStyle} block md:inline`}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className={`${linkStyle} bg-primary text-white block md:inline`}
                >
                  Login
                </Link>
              </div>
            )}

            {userRole === "citizen" && (
              <>
                <Link
                  href="/dashboard"
                  className={`${linkStyle} ${
                    pathname === "/dashboard" ? activeStyle : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-complaints"
                  className={`${linkStyle} ${
                    pathname === "/my-complaints" ? activeStyle : ""
                  }`}
                >
                  My Complaints
                </Link>
                <Link
                  href="/profile"
                  className={`${linkStyle} ${
                    pathname === "/profile" ? activeStyle : ""
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {userRole === "field_officer" && (
              <>
                <Link
                  href="/assigned-complaints"
                  className={`${linkStyle} ${
                    pathname === "/assigned-complaints" ? activeStyle : ""
                  }`}
                >
                  Assigned Complaints
                </Link>
                <Link
                  href="/completed-complaints"
                  className={`${linkStyle} ${
                    pathname === "/completed-complaints" ? activeStyle : ""
                  }`}
                >
                  Completed Complaints
                </Link>
                <Link
                  href="/profile"
                  className={`${linkStyle} ${
                    pathname === "/profile" ? activeStyle : ""
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {userRole === "admin" && (
              <>
                <Link
                  href="/admin-dashboard"
                  className={`${linkStyle} ${
                    pathname === "/admin-dashboard" ? activeStyle : ""
                  }`}
                >
                  Admin Panel
                </Link>
                <Link
                  href="/manage-users"
                  className={`${linkStyle} ${
                    pathname === "/manage-users" ? activeStyle : ""
                  }`}
                >
                  Manage Users
                </Link>
                <Link
                  href="/reports"
                  className={`${linkStyle} ${
                    pathname === "/reports" ? activeStyle : ""
                  }`}
                >
                  Reports
                </Link>
              </>
            )}

            {userRole === "call_center" && (
              <>
                <Link
                  href="/call-center-dashboard"
                  className={`${linkStyle} ${
                    pathname === "/call-center-dashboard" ? activeStyle : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/call-logs"
                  className={`${linkStyle} ${
                    pathname === "/call-logs" ? activeStyle : ""
                  }`}
                >
                  Call Logs
                </Link>
                <Link
                  href="/profile"
                  className={`${linkStyle} ${
                    pathname === "/profile" ? activeStyle : ""
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {/* Logout Button */}
            {userRole && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 text-white rounded-md block md:inline"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
