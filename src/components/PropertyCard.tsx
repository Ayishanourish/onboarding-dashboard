"use client";

import { useState } from "react";
import Image from "next/image";
import { Property } from "@/lib/types";
import styles from "./PropertyCard.module.css";

const STOP_WORDS = new Set(["the", "at", "with", "and", "of", "a", "an"]);

function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const STATUS_LABELS: Record<Property["derivedStatus"], string> = {
  live: "Live",
  attention: "Needs attention",
  in_progress: "In progress",
  not_started: "Not started",
};

type Props = { property: Property; onClick: () => void };

export default function PropertyCard({ property, onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const { name, location, image, bedrooms, derivedStatus } = property;

  const showImage = image && !imgError;

  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className={showImage ? styles.imageWrapper : styles.placeholder}>
        {showImage ? (
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
            sizes="(max-width: 700px) 100vw, 350px"
          />
        ) : (
          <div className={styles.placeholderContent}>
            <span className={styles.initials}>{initials(name)}</span>
            <span className={styles.pendingLabel}>Photography pending</span>
          </div>
        )}
        <span className={`${styles.badge} ${styles[derivedStatus]}`}>
          {STATUS_LABELS[derivedStatus]}
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.meta}>
          {location} &middot; {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
