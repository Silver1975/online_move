"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from './components/Pagination'; // Підключаємо наш компонент пагінації
import styles from './page.module.css';

async function fetchData(page = 1, limit = 15) {
  const res = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${page}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movies) {
    throw new Error('Movies not found');
  }

  return {
    movies: result.data.movies,
    totalResults: result.data.movie_count,
  };
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const { movies, totalResults } = await fetchData(currentPage, limit);
      setMovies(movies);
      setTotalPages(Math.ceil(totalResults / limit));
      setLoading(false);
    };

    loadMovies();
  }, [currentPage]);

  const handlePageChange = (page) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.skeletonContainer}>
          {[...Array(15)].map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div style={{ height: '300px', width: '200px', backgroundColor: '#e0e0e0', marginBottom: '10px', borderRadius: '8px' }} />
              <div style={{ height: '20px', width: '150px', backgroundColor: '#e0e0e0' , borderRadius: '4px', textAlign: 'center'}} />
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

      {/* Пагінація */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}