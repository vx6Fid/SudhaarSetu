"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiPhone, FiFileText } from "react-icons/fi";
import { VscFeedback } from "react-icons/vsc";
import { useRouter } from "next/navigation";

const Page = () => {
  const [complaints, setComplaints] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const userId =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (!userId) return;
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/complaints`
        );
        url.searchParams.append("user_id", userId);

        const response = await fetch(url);
        const data = await response.json();

        // console.log("Fetched complaints:", data.complaints);

        setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }
    fetchComplaints();
  }, []);

  const handleCall = () => {
    const phoneNumber = "9876540321";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber);
      alert("Phone number copied to clipboard: " + phoneNumber);
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const complaintStats = {
    pending: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "pending"
    ).length,
    resolved: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "resolved"
    ).length,
    inProgress: complaints.filter(
      (c) => c.status?.trim().toLowerCase() === "in progress"
    ).length,
  };

  const chartData = [
    { name: "Pending", value: complaintStats.pending, color: "#e74c3c" },
    { name: "Resolved", value: complaintStats.resolved, color: "#2ecc71" },
    { name: "In Progress", value: complaintStats.inProgress, color: "#f39c12" },
  ];

  return (
    <div className="p-4">
      <div className="bg-background p-6 w-full max-w-4xl mx-auto text-black">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Complaints Overview & Legend Box */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-bold mb-4">Complaints Overview</h2>
            <div className="flex flex-col gap-2">
              {chartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex justify-center items-center w-full md:w-[400px] lg:w-[500px]">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%" // Donut effect
                  outerRadius="70%" // Increased size for large screens
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <hr className="border-t-2 border-black" />
      <div className="flex gap-4 my-4 w-full">
        {/* Call Button */}
        <button
          onClick={handleCall}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-orange-500 font-semibold text-background rounded-md shadow-md hover:bg-orange-600 transition"
        >
          <FiPhone />
          Report Via Call
        </button>

        {/* File Complaint Button with Link */}
        <button
          onClick={() => router.push("/fileComplaint")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-orange-500 font-semibold text-background rounded-md shadow-md hover:bg-orange-600 transition"
        >
          <FiFileText />
          <span>File Complaint</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">My Complaints</h3>
        <table className="w-full mt-2 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Complaint ID</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="border p-2">#{complaint.id}</td>
                <td className="border p-2">{complaint.category}</td>
                <td className="border p-2">{complaint.status}</td>
                <td className="border p-2">
                  {complaint.status === "Resolved" ? (
                    <button className="text-green-500">Feedback</button>
                  ) : (
                    <button className="text-blue-500">View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Give Feedback */}
      <div className="bg-green-100 mt-6 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 w-full shadow-md">
        {/* Icon & Text */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <VscFeedback className="text-black text-6xl md:text-7xl lg:text-8xl" />
        </div>
        <span className="text-black font-semibold text-lg md:text-xl lg:text-2xl">
          Give Feedback on Resolved Complaints
        </span>
        {/* Feedback Button */}
        <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-lg md:text-xl hover:bg-green-700 transition">
          Feedback →
        </button>
      </div>
    </div>
  );
};

export default Page;
