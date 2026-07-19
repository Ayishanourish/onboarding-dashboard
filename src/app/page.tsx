"use client";

import { useEffect, useState } from "react";
import { OnboardingData, Property } from "@/lib/types";
import { normaliseData } from "@/lib/onboarding";
import PropertyCard from "@/components/PropertyCard";
import SummaryBar from "@/components/SummaryBar";
import FilterBar, { Filter } from "@/components/FilterBar";
import StepsModal from "@/components/StepsModal";
import SkeletonCard from "@/components/SkeletonCard";
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
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

  const isLoading = !data && !error;
  const owner = data?.owner;

  if (error) return <p style={{ padding: 32, color: "var(--ms-attention-text)" }}>Error: {error}</p>;

  const properties = data ? normaliseData(data) : [];
  const live = properties.filter((p) => p.derivedStatus === "live").length;
  const attention = properties.filter((p) => p.derivedStatus === "attention").length;

  const query = search.trim().toLowerCase();
  const visible = properties
    .filter((p) => filter === "all" || p.derivedStatus === filter)
    .filter((p) => !query || p.name.toLowerCase().includes(query));

  return (
    <>
      <header className={styles.topbar}>
        <span className={styles.wordmark}>Madestays</span>
        {owner && (
          <div className={styles.ownerInfo}>
            <span className={styles.ownerName}>{owner.name}</span>
            <span className={styles.ownerManager}>{owner.accountManager}</span>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Your onboarding at a glance</h1>
            <p className={styles.heroSubtitle}>
              Track the progress of each property below. Click any card to open the
              full onboarding checklist and see exactly what&rsquo;s needed to get it live.
            </p>
          </section>

          <SummaryBar total={properties.length} live={live} attention={attention} />

          <div className={styles.toolbar}>
            <FilterBar active={filter} onChange={setFilter} />
            <input
              className={styles.search}
              type="search"
              placeholder="Search properties…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {visible.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No properties found</p>
              <p className={styles.emptySubtitle}>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {visible.map((p) => (
                <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <StepsModal property={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
