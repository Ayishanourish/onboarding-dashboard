import { PropertyStatus } from "@/lib/types";
import styles from "./FilterBar.module.css";

type Filter = PropertyStatus | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "attention", label: "Needs attention" },
  { value: "in_progress", label: "In progress" },
  { value: "not_started", label: "Not started" },
];

type Props = {
  active: Filter;
  onChange: (filter: Filter) => void;
};

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className={styles.bar}>
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          className={`${styles.button} ${active === value ? styles.active : ""}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export type { Filter };
