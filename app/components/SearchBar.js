"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css'; // Підключаємо стилі

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
      setQuery(''); // Очистити поле після пошуку
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}></button>
    </form>
  );
}