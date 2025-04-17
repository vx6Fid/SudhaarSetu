"use client";
import React, { useEffect, useState } from "react";

import ViewProfile from "../../components/ViewProfile";

function Page() {
  const [userDet, setUserDet] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`);
        url.searchParams.append("user_id", localStorage.getItem("userId"));
        if (localStorage.getItem("userRole") === "field_officer") {
          url.searchParams.append("role", "officer");
        } else url.searchParams.append("role", "citizen");
        const response = await fetch(url);
        const data = await response.json();
        setUserDet(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    fetchDetails();
  }, []);

  if (!userDet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        {/* Animated spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Loading text with subtle animation */}
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading user data...
        </p>

        {/* Optional progress indicator */}
        <div className="w-1/2 bg-gray-200 rounded-full h-1.5 max-w-xs">
          <div className="bg-blue-600 h-1.5 rounded-full w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  return <ViewProfile userDet={userDet} />;
}

export default Page;
