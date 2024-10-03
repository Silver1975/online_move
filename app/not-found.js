import Link from 'next/link';
import styles from './not-found.module.css'; // Імпортуємо стилі для сторінки

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Сторінку не знайдено</h1>
      <p className={styles.description}>
        На жаль, ми не змогли знайти цю сторінку. Можливо, вона була переміщена або видалена.
      </p>
      <Link href="/">
        <button className={styles.homeButton}>Повернутися на головну</button>
      </Link>
    </div>
  );
}