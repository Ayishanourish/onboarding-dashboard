import styles from "./SummaryBar.module.css";

type Props = {
  total: number;
  live: number;
  attention: number;
};

export default function SummaryBar({ total, live, attention }: Props) {
  return (
    <div className={styles.bar}>
      <Stat label="Total properties" value={total} />
      <Stat label="Live" value={live} />
      <Stat label="Need attention" value={attention} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.stat}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
