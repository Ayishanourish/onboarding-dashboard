"use client";

import { useState } from "react";
import Image from "next/image";
import { Property } from "@/lib/types";
import styles from "./PropertyCard.module.css";

type Props = Pick<Property, "name" | "location" | "image">;

export default function PropertyCard({ name, location, image }: Props) {
  const [imgError, setImgError] = useState(false);

  const showImage = image && !imgError;

  return (
    <div className={styles.card}>
      {showImage ? (
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className={styles.placeholder} />
      )}
      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.location}>{location}</p>
      </div>
    </div>
  );
}
