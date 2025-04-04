"use client";

import { useState } from "react";
import "leaflet/dist/leaflet.css";

function ManageFieldOfficers() {
  const fieldOfficers = [
    { id: 1, name: "Amit Sharma", ward: 5, complaintsHandled: 25, pending: 5, resolved: 20, status: "Active" },
    { id: 2, name: "Priya Verma", ward: 3, complaintsHandled: 18, pending: 2, resolved: 16, status: "On Leave" },
    { id: 3, name: "Rohan Gupta", ward: 7, complaintsHandled: 30, pending: 10, resolved: 20, status: "Active" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchWard, setSearchWard] = useState("");

  const filteredOfficers = fieldOfficers.filter((officer) => {
    return (
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchWard === "" || officer.ward === parseInt(searchWard))
    );
  });

  return (
    <div className="bg-primary-light min-h-screen p-6">
      {/* Header Section */}
      <header className="bg-primary text-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-center">
        <nav className="w-full flex flex-col md:flex-row justify-between items-center">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full md:w-80 text-black" // Added text-black for visibility
            />
            <input
                type="number"
                placeholder="Search by Ward Number"
                value={searchWard}
                onChange={(e) => setSearchWard(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full md:w-80 text-black" // Added text-black for visibility
            />
            </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {filteredOfficers.length > 0 ? (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
            <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">Field Officers Overview</h3>
            <table className="table-auto w-full min-w-[600px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-secondary-light text-gray-900">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Ward</th>
                  <th className="border border-gray-300 px-4 py-2">Complaints Handled</th>
                  <th className="border border-gray-300 px-4 py-2">Pending</th>
                  <th className="border border-gray-300 px-4 py-2">Resolved</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-secondary-light">
                    <td className="border border-gray-300 px-4 py-2">{officer.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{officer.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{officer.ward}</td>
                    <td className="border border-gray-300 px-4 py-2">{officer.complaintsHandled}</td>
                    <td className="border border-gray-300 px-4 py-2">{officer.pending}</td>
                    <td className="border border-gray-300 px-4 py-2">{officer.resolved}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${
                        officer.status === "Active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {officer.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`/admin/fieldOfficer/fieldOfficerInfo/${officer.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <p className="text-center text-red-600 text-lg font-semibold">
            No field officers found matching the search criteria. Please try a different name or ward number.
          </p>
        )}
      </main>
    </div>
  );
}

export default ManageFieldOfficers;