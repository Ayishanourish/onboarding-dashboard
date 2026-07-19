"use client";

import { useEffect } from "react";
import { Property, StepStatus } from "@/lib/types";
import styles from "./StepsModal.module.css";

const STATUS_LABELS: Record<StepStatus, string> = {
  complete: "Complete",
  in_progress: "In progress",
  action_required: "Action required",
  not_started: "Not started",
  on_hold: "On hold",
  unknown: "Unknown",
};

type Props = {
  property: Property;
  onClose: () => void;
};

export default function StepsModal({ property, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${property.name} onboarding steps`}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{property.name}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <ul className={styles.list}>
          {property.steps.map((step) => (
            <li key={step.id} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepLabel}>{step.label}</span>
                <span className={`${styles.badge} ${styles[step.status]}`}>
                  {STATUS_LABELS[step.status]}
                </span>
              </div>
              {step.note && <p className={styles.note}>{step.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
