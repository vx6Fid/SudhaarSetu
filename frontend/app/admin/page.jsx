"use client";

import React, { useEffect, useState } from "react";

function Page() {
  const [complaints, setComplaints] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [reportData, setReportData] = useState({ pending: 0, resolved: 0 });
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

  // Fetch data dynamically
  useEffect(() => {
    // Simulate fetching complaints data
    const fetchComplaints = async () => {
      const city = localStorage.getItem("user-city");
      let url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`
      );

      if (city) url.searchParams.append("city", city);

      const complaintsData = await fetch(url).then((res) => res.json());
      console.log(complaintsData.complaints);
      setComplaints(complaintsData.complaints);
    };

    // Simulate fetching report data
    const fetchReportData = async () => {
      const reportData = await fetch("/api/reports").then((res) => res.json());
      setReportData(reportData);
    };

    fetchComplaints();
    // fetchReportData();
  }, []);
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
    <div className="bg-primary-light min-h-screen p-4 md:p-6">
      {/* Main Content */}
      <main>
        {/* Welcome Section */}
        {showWelcome && (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-primary-dark hover:text-red-600 text-xl font-bold"
              aria-label="Close Welcome Section"
            >
              &times;
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-primary-dark mb-2 text-center md:text-left">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-secondary-dark">
              Monitor complaints, manage users, and analyze reports efficiently.
            </p>
          </section>
        )}

        {/* Complaints Overview Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
            Complaints Overview
          </h3>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by ID or Category"
              className="border border-gray-300 p-2 rounded w-full md:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Ward"
              className="border border-gray-300 p-2 rounded w-full md:w-1/6"
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Status"
              className="border border-gray-300 p-2 rounded w-full md:w-1/4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          {filteredComplaints.length > 0 ? (
            <table className="w-full border-collapse border border-secondary-light text-sm md:text-base">
              <thead>
                <tr className="bg-secondary-light text-left">
                  <th className="border border-secondary px-3 py-2">ID</th>
                  <th className="border border-secondary px-3 py-2">
                    Category
                  </th>
                  <th className="border border-secondary px-3 py-2">Ward</th>

                  <th className="border border-secondary px-3 py-2">Status</th>
                  <th className="border border-secondary px-3 py-2">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-secondary-light">
                    <td className="border border-secondary px-3 py-2">
                      {complaint.id}
                    </td>
                    <td className="border border-secondary px-3 py-2">
                      {complaint.category}
                    </td>
                    <td className="border border-secondary px-3 py-2">
                      {complaint.ward_no}
                    </td>
                    <td className="border border-secondary px-3 py-2">
                      {complaint.status}
                    </td>
                    <td className="border border-secondary px-3 py-2">
                      {complaint.field_officer_id ? (
                        complaint.officer_name
                      ) : (
                        <button
                          onClick={() => openOfficerModal(complaint)}
                          className="text-blue-500 hover:underline"
                        >
                          Assign Officer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold">
              No Complaints Found
            </p>
          )}
        </section>

        {/* Complaints Distribution by Wards */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
            Complaints Pending in Each Ward
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {wardData.map((ward, index) => (
              <div
                key={index}
                className="bg-primary-light border border-primary rounded-lg p-4 text-center"
              >
                <h4 className="text-lg font-semibold text-primary-dark">
                  Ward {ward.name}
                </h4>
                <p className="text-sm font-bold text-primary-dark">
                  {ward.pendingComplaints}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Reports & Analytics Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
            Reports & Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-light border border-primary rounded-lg p-4 text-center">
              <h4 className="text-lg font-semibold text-primary-dark">
                Pending Complaints
              </h4>
              <p className="text-2xl font-bold text-primary-dark">
                {reportData.pending}
              </p>
            </div>
            <div className="bg-primary-light border border-primary rounded-lg p-4 text-center">
              <h4 className="text-lg font-semibold text-primary-dark">
                Resolved Complaints
              </h4>
              <p className="text-2xl font-bold text-primary-dark">
                {reportData.resolved}
              </p>
            </div>
          </div>

          {/* Download Reports Section */}
          <div className="mt-6 text-center md:text-left">
            <h4 className="text-lg font-semibold text-primary-dark">
              Generate Reports
            </h4>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
              <input
                type="date"
                className="border border-primary rounded p-2 w-full md:w-auto focus:ring focus:ring-primary-light"
                placeholder="Start Date"
              />
              <input
                type="date"
                className="border border-primary rounded p-2 w-full md:w-auto focus:ring focus:ring-primary-light"
                placeholder="End Date"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded w-full md:w-auto transition duration-200">
                Download Report
              </button>
            </div>
          </div>
        </section>
      </main>
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-primary-dark mb-4">
              Assign Officer to Complaint #{selectedComplaint.id}
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name"
                className="border border-gray-300 p-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter by ward"
                className="border border-gray-300 p-2 rounded w-full"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOfficers.length ? (
                <ul className="divide-y divide-gray-200">
                  {filteredOfficers.map((officer) => (
                    <li
                      key={officer.id}
                      className="flex justify-between items-center p-2 hover:bg-primary-light rounded"
                    >
                      <div>
                        <p className="font-medium">{officer.name}</p>
                        <p className="text-sm text-gray-600">
                          Ward: {officer.ward}
                        </p>
                      </div>
                      <button
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                        onClick={async () => {
                          try {
                            await assignOfficer(
                              selectedComplaint.id,
                              officer.id,
                              officer.name
                            );
                            setIsModalOpen(false);
                            window.location.reload(); // Optional: Refresh to update assignment
                          } catch (err) {
                            console.log(err);
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
                <p className="text-center text-gray-500">No officers found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
