"use client";

import { useState, useEffect } from "react";
import styles from "./MoviesForChildrenSlider.module.css";
import { useRouter } from "next/navigation";

export default function MoviesForChildrenSlider() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Стан для відстеження завантаження
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); // Увімкнути стан завантаження
        const response = await fetch("http://localhost:5221/api/movie");
        const data = await response.json();

        // Фільтруємо фільми за тегом "Movies for children"
        const filteredMovies = data.filter((movie) =>
          movie.tags.includes("Movies for children")
        );

        setMovies(filteredMovies);
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      } finally {
        setLoading(false); // Вимкнути стан завантаження
      }
    };

    fetchMovies();
  }, []);

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 4 < movies.length ? prevIndex + 4 : 0
    );
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 4 >= 0 ? prevIndex - 4 : Math.max(0, movies.length - 4)
    );
  };

  const handleMovieClick = (movieId) => {
    router.push(`/movies/${movieId}`);
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + 4);

  return (
    <div className={styles.slider}>
      {loading ? (
        <div className={styles.slidesContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonBox}>
              <div className={styles.skeletonImage}></div>
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <button onClick={handlePrevSlide} className={styles.arrowLeft}>
            &#8249;
          </button>
          <div className={styles.slidesContainer}>
            {visibleMovies.map((movie) => (
              <div
                key={movie.id}
                className={styles.box}
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className={styles.boxImage}>
                  <img
                    src={`http://localhost:5221/bigPosters/${movie.bigPoster.fileName}`}
                    alt={movie.name}
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleNextSlide} className={styles.arrowRight}>
            &#8250;
          </button>
        </>
      ) : (
        <div className={styles.skeleton}>Немає фільмів...</div>
      )}
    </div>
  );
}