"use client";

import dynamic from "next/dynamic";

const OfficerComplaints = dynamic(() => import("../components/OfficerComplaint"), {
  ssr: false, // This disables SSR and avoids window errors
});

export default OfficerComplaints;
