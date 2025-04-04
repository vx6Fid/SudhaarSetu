"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function FieldOfficerDetails() {
  const { id } = useParams();
  const [fieldOfficer, setFieldOfficer] = useState(null);

  useEffect(() => {
    const fetchFieldOfficer = async () => {
      try {
        const response = await fetch(`/api/fieldOfficers/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch field officer details");
        }
        const data = await response.json();
        setFieldOfficer(data);
      } catch (error) {
        console.error("Error fetching field officer details:", error);
      }
    };

    fetchFieldOfficer();
  }, [id]);

  if (!fieldOfficer) {
    return (
      <p className="text-center text-red-600 text-lg font-semibold">
        Loading Field Officer Details...
      </p>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-6">
      {/* Header */}
      <header className="bg-[#2D5BFF] text-white shadow-md rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold">Field Officer Details</h1>
      </header>

      {/* Main Content */}
      <main className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-primary-dark mb-4">{fieldOfficer.name}</h2>
        <p><strong>Ward:</strong> {fieldOfficer.ward}</p>
        <p><strong>Complaints Handled:</strong> {fieldOfficer.complaintsHandled}</p>
        <p><strong>Pending Complaints:</strong> {fieldOfficer.pending}</p>
        <p><strong>Resolved Complaints:</strong> {fieldOfficer.resolved}</p>
        <p><strong>Status:</strong> {fieldOfficer.status}</p>
        <p><strong>Contact:</strong> {fieldOfficer.contact}</p>
        <p><strong>Phone:</strong> {fieldOfficer.phone}</p>
        <p><strong>Address:</strong> {fieldOfficer.address}</p>
      </main>
    </div>
  );
}

export default FieldOfficerDetails;