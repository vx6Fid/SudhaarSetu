'use client'
import React, { useState } from "react";

const CreateOrganizationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contact_no: "",
    logo_url: "",
    categories: "",
    wards: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch("/admin/create-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust token retrieval if needed
        },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories.split(",").map((cat) => cat.trim()),
          wards: formData.wards.split(",").map((w) => w.trim()),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setResponseMsg({ type: "error", message: data.error || "Failed to create organization" });
      } else {
        setResponseMsg({ type: "success", message: data.message });
        setFormData({
          name: "",
          description: "",
          email: "",
          contact_no: "",
          logo_url: "",
          categories: "",
          wards: "",
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setResponseMsg({ type: "error", message: "Something went wrong!" });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create Organization</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "email", "contact_no", "logo_url", "categories", "wards"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize mb-1">{field.replace("_", " ")}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              placeholder={field === "categories" || field === "wards" ? "Comma-separated values" : ""}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          {loading ? "Creating..." : "Create Organization"}
        </button>
      </form>

      {responseMsg && (
        <div
          className={`mt-4 text-center px-4 py-2 rounded-md ${
            responseMsg.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {responseMsg.message}
        </div>
      )}
    </div>
  );
};

export default CreateOrganizationForm;
