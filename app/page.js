"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Header from './components/Header'; // Імпортуємо хедер

async function fetchData(page = 1) {
  const res = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=15&page=${page}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movies) {
    throw new Error('Movies not found');
  }

  return result.data.movies;
}

export default function Home() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const fetchedMovies = await fetchData(currentPage);
      setMovies(fetchedMovies);
      setLoading(false);
    };

    loadMovies();
  }, [currentPage]);

  return (
    <div className={styles.page}>
            
      <main className={styles.main}>
        {loading ? (
          <div className={styles.skeletonContainer}>
            {[...Array(15)].map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div style={{ height: '300px', width: '200px', backgroundColor: '#e0e0e0', marginBottom: '10px' }} />
                <div style={{ height: '20px', width: '150px', backgroundColor: '#e0e0e0' }} />
              </div>
            ))}
          </div>
        ) : (
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
                <Link href={`/movies/${movie.id}?page=${currentPage}`}>{movie.title}</Link>
              </div>
            </div>
          ))
        )}
      </main>

      <div className={styles.pagination}>
        <Link href={`/?page=${currentPage - 1}`} passHref>
          <button disabled={currentPage === 1}>Попередня</button>
        </Link>
        <span>Сторінка {currentPage}</span>
        <Link href={`/?page=${currentPage + 1}`} passHref>
          <button>Наступна</button>
        </Link>
      </div>
    </div>
  );
}