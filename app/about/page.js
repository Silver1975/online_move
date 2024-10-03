import styles from './About.module.css';

export const metadata = {
    title: "Про проект",
    
  };

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Про проект</h1>
        <p className={styles.description}>
          Це дипломний проект студентів ItStep, який був розроблений для демонстрації навичок веб-розробки. Проект містить каталог фільмів з детальною інформацією про кожен з них.
        </p>
      </div>
    </div>
  );
}