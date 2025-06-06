"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Page() {
  const [complaints, setComplaints] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [reportData, setReportData] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch field officers when modal is triggered
  const fetchOfficers = async () => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/officers`);
    const data = await fetch(url).then((res) => res.json());
    setFieldOfficers(data.officers);
  };

  // Handle opening modal
  const openOfficerModal = async (complaint) => {
    setSelectedComplaint(complaint);
    await fetchOfficers();
    setIsModalOpen(true);
  };

  // Filter logic
  const filteredOfficers = fieldOfficers.filter((officer) => {
    const matchWard = wardFilter ? officer.ward === wardFilter : true;
    const matchName = officer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchWard && matchName;
  });

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const org_name = localStorage.getItem("user-org");
        let url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
        );

        if (org_name) url.searchParams.append("org_name", org_name);

        const complaintsData = await fetch(url).then((res) => res.json());
        const complaints = complaintsData.complaints;

        console.log(complaints);

        let counts = {
          pending: 0,
          in_progress: 0,
          resolved: 0,
        };

        complaints.forEach((complaint) => {
          if (complaint.status === "pending") counts.pending++;
          else if (complaint.status === "in_progress") counts.in_progress++;
          else if (complaint.status === "resolved") counts.resolved++;
        });

        setReportData(counts);
        setComplaints(complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // Helper function to generate random but visually distinct colors
  const generateWardColors = (count) => {
    const colorPalette = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F06292",
      "#7986CB",
      "#9575CD",
      "#64B5F6",
      "#4DB6AC",
      "#81C784",
      "#FFD54F",
      "#FF8A65",
      "#A1887F",
      "#90A4AE",
      "#E57373",
      "#BA68C8",
      "#4DD0E1",
      "#AED581",
      "#FFF176",
      "#FFB74D",
      "#FF7043",
      "#A5D6A7",
      "#CE93D8",
      "#80DEEA",
    ];

    return [...colorPalette].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const wardColors = generateWardColors(wardData.length);

  backgroundColor: wardColors,
    useEffect(() => {
      // Simulate fetching ward data
      const fetchWardData = async () => {
        const wardCount = {};

        complaints.forEach((complaint) => {
          if (complaint.status === "pending") {
            const ward = complaint.ward_no || "Unknown";
            if (!wardCount[ward]) wardCount[ward] = 0;
            wardCount[ward]++;
          }
        });

        const wardArray = Object.keys(wardCount).map((wardName) => ({
          name: wardName,
          pendingComplaints: wardCount[wardName],
        }));

        setWardData(wardArray);
      };
      fetchWardData();
    }, [complaints]);

  const assignOfficer = async (complaint_id, officer_id, officer_name) => {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/assign-field-officer`
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          admin_id: localStorage.getItem("userId"),
          complaint_id: complaint_id,
          field_officer_id: officer_id,
          officerName: officer_name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Assignment failed:", errorData);
        throw new Error(errorData.error || "Failed to assign officer");
      }

      const data = await response.json();
      console.log("Assignment successful:", data);
      return data;
    } catch (err) {
      console.error("Error assigning officer:", err.message);
      throw err;
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    return (
      complaint.status.toLowerCase().includes(statusFilter.toLowerCase()) &&
      (wardFilter === "" ||
        (complaint.ward_no && complaint.ward_no.toString() === wardFilter)) &&
      (searchTerm === "" ||
        complaint.id.toString().includes(searchTerm) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="bg-primary-light min-h-screen px-0  p-4">
      <main className="w-full px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        {showWelcome && (
          <section className="bg-gradient-to-r from-secondary to-primary shadow-lg rounded-xl p-6 mb-6 relative overflow-hidden animate-fadeIn">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-200 rounded-full opacity-20"></div>

            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-3 right-3 text-black hover:text-red-500 text-xl font-bold transition-all duration-200 hover:scale-110"
              aria-label="Close Welcome Section"
            >
              &times;
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center md:text-left">
                Welcome to the{" "}
                <span className="text-gray-50">Admin Dashboard</span>
              </h2>
              <p className="text-gray-600 mb-4 max-w-2xl">
                Monitor complaints, manage users, and analyze reports
                efficiently. Get started by exploring the powerful tools below.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm animate-bounce delay-200">
                  Real-time Data
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm animate-bounce delay-300">
                  Analytics
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Complaints by Ward Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl rounded-2xl p-6 mb-8 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-100 rounded-full opacity-20"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 ">
              {/* Left Side - Heading */}
              <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left animate-slideInLeft md:ml-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-3">
                  Complaints Pending <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    in Each Ward
                  </span>
                </h1>
                <p className="text-gray-600 mb-4 max-w-md ">
                  Track unresolved issues across different wards with
                  interactive visualization.
                </p>
                <div className="flex flex-wrap gap-2">
                  {wardData.slice(0, 3).map((ward, index) => (
                    <span
                      key={ward.name}
                      className="px-3 py-1 bg-white/80 backdrop-blur-sm text-amber-800 rounded-full text-sm shadow-sm transition-all hover:scale-105"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${
                          index * 0.1
                        }s forwards`,
                        opacity: 0,
                      }}
                    >
                      Ward {ward.name}: {ward.pendingComplaints}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side - Doughnut Chart */}
              <div className="lg:w-1/2 flex justify-center animate-slideInRight">
                <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full scale-90 animate-pulse-slow"></div>
                  <Doughnut
                    data={{
                      labels: wardData.map((ward) => `Ward ${ward.name}`),
                      datasets: [
                        {
                          label: "Pending Complaints",
                          data: wardData.map((ward) => ward.pendingComplaints),
                          backgroundColor: generateWardColors(wardData.length),
                          borderColor: "white",
                          borderWidth: 3,
                          hoverBorderWidth: 4,
                          hoverOffset: 10,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "65%",
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "#555",
                            font: {
                              size: 13,
                              family: "'Inter', sans-serif",
                            },
                            padding: 20,
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 13 },
                          callbacks: {
                            label: (tooltipItem) =>
                              `${tooltipItem.label}: ${tooltipItem.raw} complaints`,
                          },
                        },
                      },
                      animation: {
                        animateScale: true,
                        animateRotate: true,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complaints Overview Section */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 mb-6 shadow-lg border border-gray-100">
          {/* Header */}
          <div className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Complaints Overview
            </h3>
            <p className="text-gray-500">
              Manage and track all citizen complaints
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col">
              <label
                htmlFor="search"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Search Complaints
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="      ID, Category, Description..."
                  className="pl-10 w-full border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary p-2 sm:p-3 rounded-lg shadow-sm transition duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="ward"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Ward
              </label>
              <select
                id="ward"
                className="border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary p-2 sm:p-3 rounded-lg shadow-sm transition duration-200"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option value="">All Wards</option>
                {[...Array(20).keys()].map((ward) => (
                  <option key={ward + 1} value={ward + 1}>
                    Ward {ward + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="status"
                className="border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary p-2 sm:p-3 rounded-lg shadow-sm transition duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setWardFilter("");
                  setStatusFilter("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 sm:py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          {filteredComplaints.length > 0 ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Complaint ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Ward
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Assigned To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="hover:bg-teal-50 transition duration-150 ease-in-out cursor-pointer"
                        onClick={() => {
                          /* Add click handler to view complaint details */
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-primary">
                            #{complaint.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-s">
                            Ward {complaint.ward_no}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              complaint.status === "pending"
                                ? "bg-red-100 text-red-700"
                                : complaint.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {complaint.status
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {complaint.field_officer_id ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                <span className="text-primary font-medium">
                                  {complaint.officer_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {complaint.officer_name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openOfficerModal(complaint);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-lime-700 hover:bg-lime-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                            >
                              <svg
                                className="-ml-0.5 mr-1 h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                              </svg>
                              Assign Officer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No complaints found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || wardFilter || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "There are currently no complaints in the system"}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setWardFilter("");
                    setStatusFilter("");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredComplaints.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredComplaints.length}</span>{" "}
                complaints
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Reports Summary Section */}
        <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 mb-8 shadow-lg border border-gray-100 overflow-hidden relative animate-fadeIn">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 opacity-10 rounded-full -mr-16 -mt-16 animate-float-slow"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 opacity-10 rounded-full -ml-20 -mb-20 animate-float"></div>

          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Left Side - Heading and Summary */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left animate-slideInLeft  md:ml-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-orange-700">
                  Reports Overview
                </span>
              </h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Real-time insights into complaint resolution progress
              </p>
            </div>

            {/* Right Side - Circular Stats */}
            <div className="w-full lg:w-1/2 flex justify-center items-center animate-slideInRight">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-y-6 sm:gap-4 items-center">
                {/* Pending */}
                <div className="relative group">
                  <div
                    className="flex flex-col items-center justify-center bg-white p-2 rounded-full shadow-sm border-[25px] border-red-300 transition-all duration-300 group-hover:border-red-400 group-hover:shadow-md"
                    style={{ width: "12rem", height: "12rem" }}
                  >
                    <span className="text-xs font-medium text-gray-500 mb-1">
                      Pending
                    </span>
                    <p className="text-2xl font-bold text-red-500">
                      {reportData.pending}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 mx-auto w-3/4 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${
                            (reportData.pending / reportData.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="relative group">
                  <div
                    className="flex flex-col items-center justify-center bg-white p-2 rounded-full shadow-sm border-[25px] border-amber-300 transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-md"
                    style={{ width: "12rem", height: "12rem" }}
                  >
                    <span className="text-xs font-medium text-gray-500 mb-1">
                      In Progress
                    </span>
                    <p className="text-2xl font-bold text-amber-500">
                      {reportData.in_progress}
                    </p>
                    <div className="left-0 right-0 mx-auto w-3/4 h-1.5  rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${
                            (reportData.inProgress / reportData.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Resolved */}
                <div className="relative group">
                  <div
                    className="flex flex-col items-center justify-center bg-white p-2 rounded-full shadow-sm border-[25px] border-green-300 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-md"
                    style={{ width: "12rem", height: "12rem" }}
                  >
                    <span className="text-xs font-medium text-gray-500 mb-1">
                      Resolved
                    </span>
                    <p className="text-2xl font-bold text-green-500">
                      {reportData.resolved}
                    </p>
                    <div className="left-0 right-0 mx-auto w-3/4 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${
                            (reportData.resolved / reportData.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Generate Reports Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 px-6 sm:px-10 rounded-3xl shadow-xl border border-orange-100/50 w-full mb-12 sm:mb-20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mt-16 -mr-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/20 rounded-full -mb-20 -ml-20"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header with decorative elements */}
            <div className="text-center mb-10 sm:mb-14 relative">
              <div className="absolute -top-2 -left-4 w-8 h-8 rounded-full bg-amber-200/40 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-orange-200/40 animate-pulse delay-300"></div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 relative z-10">
                Generate{" "}
                <span className="text-transparent bg-clip-text bg-primary">
                  Reports
                </span>
              </h3>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
                Download detailed reports for any date range in multiple formats
              </p>
            </div>

            {/* Date selection and download */}
            <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md border border-orange-100/50 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-5 md:gap-7 items-end">
                {/* Date inputs container */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  {/* Start Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-secondary transition duration-200 bg-white/80 hover:border-secondary"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-secondary transition duration-200 bg-white/80 hover:border-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* Download button with dropdown */}
                <div className="w-full md:w-auto relative group">
                  <button className="inline-flex items-center justify-center w-full md:w-auto px-7 py-3.5 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 transition-all duration-200 transform group-hover:scale-[1.02] hover:shadow-md">
                    <svg
                      className="-ml-1 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Generate Report
                    <svg
                      className="ml-2 -mr-1 h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Format dropdown (appears on hover) */}
                  <div className="absolute z-10 left-0 md:left-auto md:right-0 mt-2 w-44 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-gray-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <div className="py-1.5">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition flex items-center group">
                        <div className="p-1.5 mr-3 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition">
                          <svg
                            className="h-4 w-4 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">PDF Format</div>
                          <div className="text-xs text-gray-400">
                            Print-ready
                          </div>
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition flex items-center group">
                        <div className="p-1.5 mr-3 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition">
                          <svg
                            className="h-4 w-4 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">CSV Format</div>
                          <div className="text-xs text-gray-400">
                            Spreadsheet data
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent reports section */}
            <div className="mt-8 text-center">
              <button className="text-sm font-medium inline-flex items-center group transition">
                <span className="text-secondary group-hover:text-primary transition">
                  View recent reports
                </span>
                <svg
                  className="ml-2 h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Assign Officer Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Overlay with fade-in animation */}
          <div
            className="absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal container with scale-in animation */}
          <div className="relative w-full max-w-md transform transition-all duration-300 ease-out sm:max-w-xl">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* Modal header */}
              <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Assign Officer
                    <span className="block text-sm font-normal opacity-90 mt-1">
                      Complaint #{selectedComplaint.id}
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full p-1 transition hover:bg-white/20"
                    aria-label="Close Modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Search & Filter Inputs */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search officers..."
                      className="w-full rounded-lg border-transparent bg-white/20 pl-10 pr-4 py-2 text-white placeholder-white/70 focus:border-white/30 focus:bg-white/30 focus:ring-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Filter by ward..."
                      className="w-full rounded-lg border-transparent bg-white/20 pl-10 pr-4 py-2 text-white placeholder-white/70 focus:border-white/30 focus:bg-white/30 focus:ring-0"
                      value={wardFilter}
                      onChange={(e) => setWardFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Officers List */}
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {filteredOfficers.length ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredOfficers.map((officer) => (
                      <li
                        key={officer.id}
                        className="group flex items-center justify-between p-3 transition hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-primary font-medium">
                            {officer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {officer.name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <svg
                                className="mr-1.5 h-3.5 w-3.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Ward {officer.ward}
                            </p>
                          </div>
                        </div>
                        <button
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group-hover:opacity-100 sm:opacity-0"
                          onClick={async () => {
                            try {
                              await assignOfficer(
                                selectedComplaint.id,
                                officer.id,
                                officer.name
                              );
                              setIsModalOpen(false);
                              window.location.reload();
                            } catch (err) {
                              console.error(err);
                              alert("Failed to assign officer.");
                            }
                          }}
                        >
                          Assign
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No officers found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || wardFilter
                        ? "Try adjusting your search or filter criteria."
                        : "There are currently no officers available."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
