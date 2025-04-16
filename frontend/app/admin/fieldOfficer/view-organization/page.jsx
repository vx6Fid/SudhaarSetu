"use client";
import React, { useEffect, useState } from "react";

function Page() {
  const [orgDetails, setOrgDetails] = useState({});

  // Fetch organization details
  useEffect(() => {
    const org_name = localStorage.getItem("user-org");

    const fetchOrgName = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/organizations`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const orgs = data.organizations;

        const org = orgs.find((org) => org.name === org_name);
        setOrgDetails(org ? org : {});
      } catch (error) {
        console.error("Error fetching organization name:", error);
      }
    };

    fetchOrgName();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-background rounded-xl shadow-lg mt-10 border border-gray-100">
      {orgDetails.name ? (
        <div className="space-y-6">
          {/* Header with logo and basic info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={orgDetails.logo_url}
                alt={`${orgDetails.name} logo`}
                className="w-24 h-24 object-contain rounded-lg border border-gray-200 p-2 bg-gray-50"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {orgDetails.users} users
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">
                {orgDetails.name}
              </h2>
              <p className="text-gray-600 mt-2">{orgDetails.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {orgDetails.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {orgDetails.contact}
                </div>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-blue-600 font-medium">Active Officers</div>
              <div className="text-2xl font-bold text-blue-800 mt-1">
                {orgDetails.officers}
              </div>
              <div className="text-xs text-blue-500 mt-1">Field personnel</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-green-600 font-medium">Coverage</div>
              <div className="text-2xl font-bold text-green-800 mt-1">
                {orgDetails.wards?.length || 0}
              </div>
              <div className="text-xs text-green-500 mt-1">Wards covered</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-purple-600 font-medium">Categories</div>
              <div className="text-2xl font-bold text-purple-800 mt-1">
                {orgDetails.categories?.length || 0}
              </div>
              <div className="text-xs text-purple-500 mt-1">Service areas</div>
            </div>
          </div>

          {/* Categories section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Service Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {orgDetails.categories?.map((category, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-sm bg-white rounded-full border border-gray-200 shadow-sm flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Wards section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              Covered Wards
            </h3>
            <div className="flex flex-wrap gap-2">
              {orgDetails.wards?.map((ward, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-white text-gray-800 text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  Ward {ward}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading organization details...</p>
        </div>
      )}
    </div>
  );
}

export default Page;
