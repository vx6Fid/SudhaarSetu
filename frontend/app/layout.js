"use client"; // Ensures client-side hooks work

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../app/components/Navbar'; // Ensure Navbar component exists
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname(); // App Router uses usePathname

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar userRole={userRole} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
