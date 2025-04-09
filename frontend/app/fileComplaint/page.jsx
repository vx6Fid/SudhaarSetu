"use client";
import dynamic from "next/dynamic";

const FileComplaint = dynamic(() => import("./FileComplaint"), {
  ssr: false,
});

export default FileComplaint;
