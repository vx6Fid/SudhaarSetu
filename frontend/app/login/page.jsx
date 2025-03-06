"use client";

import React, { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        window.location.href = "/";
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to login, Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F9F5EC]">
      <div className="w-[350px] p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <p className="text-primary text-4xl font-bold">SudhaarSetu</p>
        </div>

        {/* Login Heading */}
        <h1 className="text-xl font-bold text-black mt-20">LOGIN</h1>
        <p className="text-gray-500 text-sm mb-6">
          Glad to see you again! <br />
          Let's get back to making a difference
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Phone Number */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="sudhaar@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-opacity-50 bg-background text-sm px-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-background border border-gray-500 rounded-md outline-none text-gray-700"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-[#3A4F2C] transition"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary font-semibold">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
