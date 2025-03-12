"use client";
import React, { useEffect, useState } from "react";

import ViewProfile from '../../components/ViewProfile';

function Page() {
  const [userDet, setUserDet] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        let url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`);
        url.searchParams.append("user_id", localStorage.getItem("userId"));
        url.searchParams.append("role", "citizen");
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
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
  <ViewProfile userDet={userDet} />
  );
}

export default Page;
