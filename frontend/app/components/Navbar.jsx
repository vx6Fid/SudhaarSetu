import Link from "next/link";
import { usePathname } from "next/navigation"; // To detect active link

const Navbar = ({ userRole }) => {
  const pathname = usePathname(); // Get current route

  // Common button style
  const linkStyle = "px-3 py-2 rounded-md border border-black rounded-2xl";
  const activeStyle = "bg-primary text-white rounded-2xl";

  return (
    <nav className="bg-background text-text p-1 m-2 border border-gray-500 rounded-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" className="w-12"/>
        </Link>

        <div className="flex space-x-2">
          {!userRole && (
            <>
              <Link href="/login" className={`${linkStyle} `}>Sign Up</Link>
              <Link href="/register" className={`${linkStyle} bg-primary text-white px-4`}>Login</Link>
            </>
          )}

          {userRole === "citizen" && (
            <>
              <Link href="/dashboard" className={`${linkStyle} ${pathname === "/dashboard" ? activeStyle : ""}`}>Dashboard</Link>
              <Link href="/my-complaints" className={`${linkStyle} ${pathname === "/my-complaints" ? activeStyle : ""}`}>My Complaints</Link>
              <Link href="/profile" className={`${linkStyle} ${pathname === "/profile" ? activeStyle : ""}`}>Profile</Link>
            </>
          )}

          {userRole === "field-officer" && (
            <>
              <Link href="/dashboard" className={`${linkStyle} ${pathname === "/dashboard" ? activeStyle : ""}`}>Assigned Complaints</Link>
              <Link href="/completed-complaints" className={`${linkStyle} ${pathname === "/completed-complaints" ? activeStyle : ""}`}>Completed Complaints</Link>
              <Link href="/profile" className={`${linkStyle} ${pathname === "/profile" ? activeStyle : ""}`}>Profile</Link>
            </>
          )}

          {userRole === "admin" && (
            <>
              <Link href="/dashboard" className={`${linkStyle} ${pathname === "/dashboard" ? activeStyle : ""}`}>Admin Panel</Link>
              <Link href="/manage-users" className={`${linkStyle} ${pathname === "/manage-users" ? activeStyle : ""}`}>Manage Users</Link>
              <Link href="/reports" className={`${linkStyle} ${pathname === "/reports" ? activeStyle : ""}`}>Reports</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
