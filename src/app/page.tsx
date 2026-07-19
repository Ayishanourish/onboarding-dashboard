"use client";

import { useEffect, useState } from "react";
import { OnboardingData } from "@/lib/types";
import { normaliseData } from "@/lib/onboarding";
import PropertyCard from "@/components/PropertyCard";
import SummaryBar from "@/components/SummaryBar";
import FilterBar, { Filter } from "@/components/FilterBar";
import StepsModal from "@/components/StepsModal";
import { Property } from "@/lib/types";
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Property | null>(null);

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
  const live = properties.filter((p) => p.derivedStatus === "live").length;
  const attention = properties.filter((p) => p.derivedStatus === "attention").length;

  const visible = filter === "all"
    ? properties
    : properties.filter((p) => p.derivedStatus === filter);

  return (
    <>
      <SummaryBar total={properties.length} live={live} attention={attention} />
      <FilterBar active={filter} onChange={setFilter} />
      <div className={styles.grid}>
        {visible.map((p) => (
          <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
        ))}
      </div>
      {selected && (
        <StepsModal property={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
