import Link from 'next/link';
import SearchBar from './SearchBar'; // Пошуковий рядок
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">🎥 КіноХвиля</Link>
        </div>

        {/* Пошуковий рядок у хедері */}
        <SearchBar />

        <nav className={styles.nav}>
          <Link href="/">Головна</Link>
          <Link href="/about">Про проєкт</Link>
        </nav>
      </div>
    </header>
  );
}