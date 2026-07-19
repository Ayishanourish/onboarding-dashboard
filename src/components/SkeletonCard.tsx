import styles from "./SkeletonCard.module.css";

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.image} ${styles.shimmer}`} />
      <div className={styles.body}>
        <div className={`${styles.nameLine} ${styles.shimmer}`} />
        <div className={`${styles.nameLineShort} ${styles.shimmer}`} />
        <div className={`${styles.metaLine} ${styles.shimmer}`} />
      </div>
    </div>
  );
}
