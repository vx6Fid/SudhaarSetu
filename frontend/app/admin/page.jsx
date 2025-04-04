"use client";

import React, { useEffect, useState } from 'react';

function Page() {
  const [complaints, setComplaints] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [reportData, setReportData] = useState({ pending: 0, resolved: 0 });

  // Fetch data dynamically
  useEffect(() => {
    // Simulate fetching complaints data
    const fetchComplaints = async () => {
      const complaintsData = await fetch('/api/complaints').then((res) => res.json());
      setComplaints(complaintsData);
    };

    // Simulate fetching ward data
    const fetchWardData = async () => {
      const wardData = await fetch('/api/wards').then((res) => res.json());
      setWardData(wardData);
    };

    // Simulate fetching report data
    const fetchReportData = async () => {
      const reportData = await fetch('/api/reports').then((res) => res.json());
      setReportData(reportData);
    };

    fetchComplaints();
    fetchWardData();
    fetchReportData();
  }, []);

  return (
    <div className="bg-primary-light min-h-screen p-4 md:p-6">
      {/* Main Content */}
      <main>
        {/* Welcome Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-primary-dark mb-2">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-secondary-dark">
            Monitor complaints, manage users, and analyze reports efficiently.
          </p>
        </section>

        {/* Complaints Overview Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
            Complaints Overview
          </h3>
          {complaints.length > 0 ? (
            <table className="w-full border-collapse border border-secondary-light text-sm md:text-base">
              <thead>
                <tr className="bg-secondary-light text-left">
                  <th className="border border-secondary px-3 py-2">ID</th>
                  <th className="border border-secondary px-3 py-2">Title</th>
                  <th className="border border-secondary px-3 py-2">Status</th>
                  <th className="border border-secondary px-3 py-2">Assigned To</th>
                  <th className="border border-secondary px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-secondary-light">
                    <td className="border border-secondary px-3 py-2">{complaint.id}</td>
                    <td className="border border-secondary px-3 py-2">{complaint.title}</td>
                    <td className="border border-secondary px-3 py-2">{complaint.status}</td>
                    <td className="border border-secondary px-3 py-2">{complaint.assignedTo}</td>
                    <td className="border border-secondary px-3 py-2">
                      <a href={`/admin/complaints/${complaint.id}`} className="text-primary hover:underline">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold">No Complaints To Show</p>
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
                <h4 className="text-lg font-semibold text-primary-dark">{ward.name}</h4>
                <p className="text-xl font-bold text-primary-dark">{ward.pendingComplaints}</p>
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
              <h4 className="text-lg font-semibold text-primary-dark">Pending Complaints</h4>
              <p className="text-2xl font-bold text-primary-dark">{reportData.pending}</p>
            </div>
            <div className="bg-primary-light border border-primary rounded-lg p-4 text-center">
              <h4 className="text-lg font-semibold text-primary-dark">Resolved Complaints</h4>
              <p className="text-2xl font-bold text-primary-dark">{reportData.resolved}</p>
            </div>
          </div>

        {/* Download Reports Section */}
          <div className="mt-6 text-center md:text-left">
            <h4 className="text-lg font-semibold text-primary-dark">Generate Reports</h4>
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
    </div>
  );
}

export default Page;