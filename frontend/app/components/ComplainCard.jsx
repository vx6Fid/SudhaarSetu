import React from "react";

function ComplainCard({ complaint }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{complaint.category}</h3>
      <p className="text-gray-600 text-sm mt-1">Category: {complaint.location}</p>
      <p className="text-gray-600 text-sm">Ward: {complaint.ward_no}</p>
      <p className="text-gray-500 text-xs mt-2">Filed on: {new Date(complaint.created_at).toLocaleDateString()}</p>
    </div>
  );
}

export default ComplainCard;
