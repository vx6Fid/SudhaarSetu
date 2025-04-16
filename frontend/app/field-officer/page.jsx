"use client";

import dynamic from "next/dynamic";

const OfficerComplaints = dynamic(() => import("../components/OfficerComplaint"), {
  ssr: false,
});

export default OfficerComplaints;
