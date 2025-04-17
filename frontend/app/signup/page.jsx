"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function SignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [ward, setWard] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          city,
          state,
          ward,
          org_name: organization,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Signup failed");
      }

      // Redirect to login after successful signup
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.message);
      setError("Failed to sign up. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/organizations`);
        const data = await response.json();
        setOrganization(data.organizations);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center md:m-20 py-8">
      <div className="w-[400px] p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <p className="text-primary text-4xl font-bold">SudhaarSetu</p>
        </div>

        {/* Signup Heading */}
        <h1 className="text-xl font-bold text-black mt-10">SIGN UP</h1>
        <p className="text-gray-500 text-sm mb-6">
          Be a part of the change! <br />
          Sign up to report and track issues
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Organization Name */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Organization Name
            </label>
            <select className="w-full border border-gray-500 bg-amber-50 px-3 py-2 rounded">
              {organization.map((org, index) => (
                <option key={index} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="Rohan Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="+91 9999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="id@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* State */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              State
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="Rajasthan"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>

          {/* City */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              City
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="Jaipur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          {/* Ward Number*/}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Ward Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
              placeholder="Ward 15"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="absolute top-[-10px] left-3 bg-background text-sm px-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-500 rounded-md bg-background outline-none text-gray-700"
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
            {loading ? "Signing up..." : "Continue"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-semibold">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
