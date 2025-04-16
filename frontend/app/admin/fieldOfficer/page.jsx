"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

function ManageFieldOfficers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWard, setSearchWard] = useState("");
  const [officerCount, setOfficerCount] = useState(0);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [org_name, setOrgName] = useState("");
  const fetchOfficerDetails = async (officer_id) => {
    try {
      setIsLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`);
      url.searchParams.append("role", "officer");
      url.searchParams.append("user_id", officer_id);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setSelectedOfficer(data.user);
    } catch (error) {
      console.error("Error fetching officer details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeOfficer = async (officer_id) => {
    if (!confirm("Are you sure you want to remove this officer?")) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/remove-user/${officer_id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove officer.");
      }

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up";
      notification.textContent = "Officer removed successfully!";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("animate-fade-out");
        setTimeout(() => notification.remove(), 300);
      }, 3000);

      setOfficerCount(officerCount - 1);
      setFieldOfficers((prev) =>
        prev.filter((officer) => officer.id !== officer_id)
      );
      setSelectedOfficer({});
    } catch (error) {
      console.error("Error removing officer:", error.message);
      const errorNotification = document.createElement("div");
      errorNotification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up";
      errorNotification.textContent = error.message;
      document.body.appendChild(errorNotification);

      setTimeout(() => {
        errorNotification.classList.add("animate-fade-out");
        setTimeout(() => errorNotification.remove(), 300);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchOfficers = async () => {
      setIsLoading(true);
      try {
        let url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/officers`
        );
        const fieldOfficers = await fetch(url).then((res) => res.json());
        setOfficerCount(fieldOfficers.count);
        setFieldOfficers(fieldOfficers.officers);
      } catch (error) {
        console.error("Error fetching officers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setOrgName(localStorage.getItem("user-org"));
    fetchOfficers();
  }, []);

  const filteredOfficers = fieldOfficers.filter((officer) => {
    const nameMatch = officer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const wardMatch = searchWard
      ? officer.ward.toString() === searchWard
      : true;
    return nameMatch && wardMatch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Add global animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* Action Buttons to  */}
      <div className="w-full flex justify-end mb-4 space-x-3">
        <Link
          href="/admin/fieldOfficer/create-officer"
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-md transition-all duration-200 font-medium text-sm flex items-center shadow-sm hover:shadow-md"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Officer
        </Link>

        {!org_name ? (
          <Link
            href="/admin/fieldOfficer/create-organization"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md transition-all duration-200 font-medium text-sm flex items-center shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Create Organization
          </Link>
        ) : (
          <Link
            href="/admin/fieldOfficer/view-organization"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md transition-all duration-200 font-medium text-sm flex items-center shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            View Organization
          </Link>
        )}
      </div>

      {/* Header Section */}
      <header className="bg-gradient-to-r from-secondary to-primary text-white shadow-xl rounded-2xl p-6 mb-8 animate-fade-in h-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Manage Field Officers
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-600"
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
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-500 focus:ring-2 focus:ring-black focus:outline-none placeholder-gray-600 text-white transition-all duration-200"
              />
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <input
                type="number"
                placeholder="Search by Ward Number"
                value={searchWard}
                onChange={(e) => setSearchWard(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-500 focus:ring-2 focus:ring-black focus:outline-none placeholder-gray-600 text-white transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Officer Detail Card */}
      {selectedOfficer && selectedOfficer.id && (
        <section className="max-w-4xl mx-auto mb-8 animate-fade-in-up relative">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden hover-scale transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOfficer({})}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 p-1 sm:p-0 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close officer details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 hover:text-gray-700"
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

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Officer Details
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-0">
                      <span className="font-medium w-16 sm:w-20">ID:</span>
                      <span className="bg-green-100 text-primary px-2 py-1 rounded text-xs sm:text-sm font-mono">
                        {selectedOfficer.id}
                      </span>
                    </p>
                    <p className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-0">
                      <span className="font-medium w-16 sm:w-20">Name:</span>
                      <span className="text-gray-800">
                        {selectedOfficer.name}
                      </span>
                    </p>
                    <p className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-0">
                      <span className="font-medium w-16 sm:w-20">Ward:</span>
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Ward {selectedOfficer.ward}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                  <span
                    className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      selectedOfficer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOfficer.status === "active" ? (
                      <>
                        <span className="w-2 h-2 mr-1 sm:mr-2 bg-green-500 rounded-full"></span>
                        Active
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 mr-1 sm:mr-2 bg-red-500 rounded-full"></span>
                        On Leave
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => removeOfficer(selectedOfficer.id)}
                    className="mt-3 sm:mt-4 w-full sm:w-auto flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm sm:text-base shadow hover:shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove Officer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-full mx-auto ">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredOfficers.length > 0 ? (
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm mr-3">
                    {officerCount}
                  </span>
                  Field Officers Overview
                </h3>
                <p className="text-gray-500 text-sm">
                  Showing {filteredOfficers.length} of {officerCount} officers
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-primary ">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Ward
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOfficers.map((officer, index) => (
                      <tr
                        key={officer.id}
                        className={`hover:bg-green-50 transition-colors duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          <p className="flex items-center">
                            <span className="bg-green-100 text-green-950 px-2 py-1 rounded-lg text-sm font-mono">
                              {officer.id}
                            </span>
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {officer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {officer.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-600">
                            Ward {officer.ward}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              officer.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {officer.status === "active"
                              ? "Active"
                              : "On Leave"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => fetchOfficerDetails(officer.id)}
                            className="text-primary hover:text-green-950 mr-4 flex items-center transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No officers found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchWard("");
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ManageFieldOfficers;
