"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Movie.module.css'; // Підключаємо стилі

async function fetchMovieDetails(id) {
  const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movie) {
    throw new Error('Movie not found');
  }

  return result.data.movie;
}

export default function MovieDetailsPage({ params }) {
  const { movieId } = params;
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      const fetchedMovie = await fetchMovieDetails(movieId);
      setMovie(fetchedMovie);
      setLoading(false);
    };

    loadMovie();
  }, [movieId]);

  if (loading) {return(
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
  );}
  if (!movie) return <p>Фільм не знайдено!</p>;

  return (
    <div className={styles.moviePage}>
      {/* Хлібні крихти, які ведуть назад на сторінку пошуку */}
      <nav className={styles.breadcrumbs}>
        <Link href={`/search?query=${query}&page=${currentPage}`}>Пошук</Link> &gt; <span>{movie.title}</span>
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

          <ul className={styles.genres}>
            {movie.genres && movie.genres.map((genre, index) => (
              <li key={index} className={styles.genre}>
                {genre}
              </li>
            ))}
          </ul>

          <p className={styles.summary}>{movie.summary}</p>
        </div>
      </div>
    </div>
  );
}