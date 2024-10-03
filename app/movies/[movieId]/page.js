"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Movie.module.css'; // Підключаємо CSS модуль для стилізації

// Функція для отримання даних про фільм
async function fetchData(id) {
  const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movie) {
    throw new Error('Movie data not found');
  }

  return result.data.movie;
}

export default function MovieId({ params }) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || 1; // Отримуємо сторінку з параметрів або за замовчуванням 1
  const [movie, setMovie] = useState(null); // Ініціалізуємо стан для фільму
  const [loading, setLoading] = useState(true); // Ініціалізуємо стан для завантаження

  useEffect(() => {
    let isMounted = true;

    const loadMovie = async () => {
      const fetchedMovie = await fetchData(params.movieId);
      if (isMounted) {
        setMovie(fetchedMovie);
        setLoading(false);
      }
    };

    loadMovie();

    return () => {
      isMounted = false; // Відключення операцій при розмонтуванні
    };
  }, [params.movieId]);

  if (loading) {
    return (
      <div className={styles.skeletonPage}>
        <div className={styles.skeletonBreadcrumbs}>
          <span className={styles.skeletonText} style={{ width: '150px' }}></span>
          <span className={styles.skeletonDivider}>&gt;</span>
          <span className={styles.skeletonText} style={{ width: '200px' }}></span>
        </div>
        <div className={styles.skeletonMovieDetails}>
          {/* Скелетон для постера */}
          <div className={styles.skeletonPoster}></div>

          {/* Скелетон для текстової інформації */}
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonYear}></div>
            <div className={styles.skeletonGenres}>
              <span className={styles.skeletonGenre}></span>
              <span className={styles.skeletonGenre}></span>
              <span className={styles.skeletonGenre}></span>
            </div>
            <div className={styles.skeletonSummary}></div>
            <div className={styles.skeletonSummary}></div>
            <div className={styles.skeletonSummary}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <p>Фільм не знайдено!</p>;
  }

  return (
    <div className={styles.moviePage}>
      {/* Хлібні крихти з посиланням на відповідну сторінку пагінації */}
      <nav className={styles.breadcrumbs}>
        <Link href={`/?page=${currentPage}`}>Головна</Link> &gt;
        <span>{movie.title}</span>
      </nav>

      <div className={styles.movieDetails}>
        <div className={styles.poster}>
          <Image
            src={movie.large_cover_image}
            alt={movie.title}
            width={300}
            height={450}
            className={styles.posterImage}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.year}>Year: {movie.year}</p>

          {/* Перевірка, чи існує `genres` */}
          {movie.genres && movie.genres.length > 0 ? (
            <ul className={styles.genres}>
              {movie.genres.map((genre, index) => (
                <li key={index} className={styles.genre}>
                  {genre}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noGenres}>Жанри не вказані</p>
          )}

          <p className={styles.summary}>{movie.summary}</p>
        </div>
      </div>
    </div>
  );
}