"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import styles from "./MoviesPage.module.css";

export default function MoviesPage({ typeId, title }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Додаємо стан для відстеження завантаження

  const limit = 8; // Кількість фільмів на сторінку

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // Увімкнути стан завантаження
      try {
        const response = await fetch(`http://localhost:5221/api/movie/filter?typeId=${typeId}&page=${page}&pageSize=${limit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.items || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); // Вимкнути стан завантаження
      }
    };

    fetchMovies();
  }, [typeId, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

    return (
      <div className={styles.moviesСontainer}>
        <h1 style={{ fontSize: '16px', textAlign: 'center', color: 'white' }}>{title}</h1>
        <div className={styles.moviesGrid}>
        {loading ? (
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className={styles.skeleton}></div> // Виведення скелетонів
          ))
        ) : (
            movies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`} passHref>
                <div className={styles.movieCard}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={`http://localhost:5221/bigPosters/${movie.bigPoster?.fileName}`}
                      alt={movie.name}
                      className={styles.movieImage}
                    />
                  </div>
                  <h3 className={styles.movieTitle}>{movie.name}</h3>
                </div>
              </Link>

         ) ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    );
  }