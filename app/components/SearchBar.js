"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css'; // Створіть відповідний CSS файл для стилізації

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Пошук фільмів..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        Пошук
      </button>
    </form>
  );
}