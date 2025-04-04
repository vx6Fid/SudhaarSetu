"use client";

import React, { useEffect, useState } from "react";
import ViewProfile from "../../components/ViewProfile";

function Page() {
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    async function fetchAdminDetails() {
      try {
        let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`);
        url.searchParams.append("user_id", localStorage.getItem("userId"));
        url.searchParams.append("role", "admin"); // Updated role to "admin"
        const response = await fetch(url);
        const data = await response.json();
        setAdminDetails(data.user);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    }

    fetchAdminDetails();
  }, []);

  if (!adminDetails) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return <ViewProfile userDet={adminDetails} />;
}

export default Page;