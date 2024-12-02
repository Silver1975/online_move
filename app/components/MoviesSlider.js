"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./MoviesSlider.module.css";

export default function MoviesSlider() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch("http://localhost:5221/api/movie");
      const data = await response.json();
      const filteredMovies = data.filter((movie) =>
        movie.tags.includes("Drama")
      );

      setMovies(filteredMovies);
    };

    fetchMovies();
  }, []);

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleWatchMore = (movieId) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <div className={styles.slider}>
      {movies.length > 0 ? (
        <>
          <button onClick={handlePrevSlide} className={styles.arrowLeft}>
            &#8249;
          </button>
          <div className={styles.slide}>
            <img
              src={`http://localhost:5221/bigPosters/${movies[currentIndex]?.bigPoster?.fileName}`}
              alt={movies[currentIndex].name}
              className={styles.slideImage}
            />
            <h2 className={styles.slideTitle}>{movies[currentIndex].name}</h2>
            <p className={styles.slideDescription}>
              {movies[currentIndex].description}
            </p>
            <button
              className={styles.button}
              onClick={() => handleWatchMore(movies[currentIndex].id)}
            >
              Watch more
            </button>
          </div>
          <button onClick={handleNextSlide} className={styles.arrowRight}>
            &#8250;
          </button>
        </>
      ) : (
        <div className={styles.skeleton}></div>
      )}
    </div>
  );
}