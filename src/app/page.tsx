"use client";

import { useEffect, useState } from "react";
import { OnboardingData } from "@/lib/types";
import { normaliseData } from "@/lib/onboarding";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/onboarding-data.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
        return res.json();
      })
      .then((json: OnboardingData) => setData(json))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      });
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  const properties = normaliseData(data);

  return (
    <ul>
      {properties.map((p) => (
        <li key={p.id}>
          <PropertyCard name={p.name} location={p.location} image={p.image} />
        </li>
      ))}
    </ul>
  );
}
