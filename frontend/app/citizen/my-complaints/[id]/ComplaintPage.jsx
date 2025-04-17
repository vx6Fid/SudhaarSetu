'use client';

import { useEffect, useState } from 'react';
import ComplaintDetails from '@/app/components/ComplaintDetails';

export default function ComplaintPageClient({ id }) {
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint/${id}`);
        if (!res.ok) throw new Error('Failed to fetch complaint');

        const data = await res.json();
        setComplaint(data.complaint);
      } catch (err) {
        console.error(err);
      }
    }

    fetchComplaint();
  }, [id]);

  if (!complaint) return <p>Loading complaint...</p>;

  return <ComplaintDetails complaint={complaint} />;
}
