"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function ManageFieldOfficers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWard, setSearchWard] = useState("");
  const [officerCount, setOfficerCount] = useState(0);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});

  const fetchOfficerDetails = async (officer_id) => {
    try {
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
    }
  };

  const removeOfficer = async (officer_id) => {
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

      alert("Officer removed successfully!");
      setOfficerCount(officerCount - 1);
      setFieldOfficers((prev) =>
        prev.filter((officer) => officer.id !== officer_id)
      );
      setSelectedOfficer({});
    } catch (error) {
      console.error("Error removing officer:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchOfficers = async () => {
      let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/officers`);

      const fieldOfficers = await fetch(url).then((res) => res.json());
      setOfficerCount(fieldOfficers.count);
      setFieldOfficers(fieldOfficers.officers);
    };

    fetchOfficers();
  }, []);

  // 🔍 Filtering officers based on search input
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
              className="border border-gray-300 rounded p-2 w-full md:w-80 text-black"
            />
            <input
              type="number"
              placeholder="Search by Ward Number"
              value={searchWard}
              onChange={(e) => setSearchWard(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full md:w-80 text-black"
            />
          </div>
        </nav>
      </header>

      {/* Officer Detail Card */}
      {selectedOfficer && selectedOfficer.id && (
        <section className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-md mx-auto">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
            Officer Details
          </h3>
          <p>
            <strong>ID:</strong> {selectedOfficer.id}
          </p>
          <p>
            <strong>Name:</strong> {selectedOfficer.name}
          </p>
          <p>
            <strong>Ward:</strong> {selectedOfficer.ward}
          </p>

          <div className="justify-between flex items-center gap-4 mt-4">
            <div>
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedOfficer.status === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {selectedOfficer.status === "active" ? "Working" : "On Leave"}
              </span>
            </div>

            <button
              className="border border-1 bg-red-400 text-white p-2 rounded-lg"
              onClick={() => removeOfficer(selectedOfficer.id)}
            >
              Remove Officer
            </button>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main>
        {filteredOfficers.length > 0 ? (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
            <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-4">
              Field Officers Overview
            </h3>
            <p>Field Officers: {officerCount}</p>
            <table className="table-auto w-full min-w-[600px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-secondary-light text-gray-900">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Ward</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-secondary-light">
                    <td className="border border-gray-300 px-4 py-2">
                      {officer.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {officer.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {officer.ward}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-bold ${
                        officer.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {officer.status === "active" ? "Working" : "On Leave"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => fetchOfficerDetails(officer.id)}
                        className="text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <p className="text-center text-red-600 text-lg font-semibold">
            No field officers found matching the search criteria.
          </p>
        )}
      </main>
    </div>
  );
}

export default ManageFieldOfficers;
