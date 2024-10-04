"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../page.module.css';

async function searchMovies(query, page = 1) {
  const res = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${query}&limit=15&page=${page}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movies) {
    return [];
  }

  return result.data.movies;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const fetchedMovies = await searchMovies(query, currentPage);
      setMovies(fetchedMovies);
      setLoading(false);
    };

    loadMovies();
  }, [query, currentPage]);

  if (loading) return (
    <div className={styles.skeletonContainer}>
      {[...Array(15)].map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div style={{ height: '300px', width: '200px', backgroundColor: '#e0e0e0', marginBottom: '10px', borderRadius: '8px' }} />
          <div style={{ height: '20px', width: '150px', backgroundColor: '#e0e0e0' , borderRadius: '4px', textAlign: 'center'}} />
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.page}>
      <h1>Результати пошуку для: "{query}"</h1>
      <main className={styles.main}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <Image
                className={styles.moviePoster}
                src={movie.medium_cover_image}
                alt={movie.title}
                width={200}
                height={300}
              />
              <div className={styles.movieTitle}>
                <Link href={`/search/${movie.id}?query=${query}&page=${currentPage}`}>{movie.title}</Link>
              </div>
            </div>
          ))
        ) : (
          <p>Фільми не знайдено</p>
        )}
      </main>

      {/* Показуємо пагінацію лише якщо знайдено 15 фільмів */}
      {movies.length === 15 && (
        <div className={styles.pagination}>
          <Link href={`/search?query=${query}&page=${currentPage - 1}`} passHref>
            <button disabled={currentPage === 1}>Попередня</button>
          </Link>
          <span>Сторінка {currentPage}</span>
          <Link href={`/search?query=${query}&page=${currentPage + 1}`} passHref>
            <button>Наступна</button>
          </Link>
        </div>
      )}
    </div>
  );
} 