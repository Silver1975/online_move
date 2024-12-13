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

  const handleWatchMore = (movieId) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <div className={styles.sliderWrapper}>
      {movies.length > 0 ? (
        <>
          <div className={styles.sliderContent}>
            <div className={styles.slider}>
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
                  <span>Watch more</span>
                </button>
              </div>
            </div>
          </div>
  
          <button onClick={handleNextSlide} className={styles.arrowRight}>
            <img src="/img/vector-arrow.svg" alt="Next" />
          </button>
          <button className={styles.bookmark} >
           <img src="/img/bi_bookmark.png" alt="Wishlist" />
          </button>
          <button className={styles.bookmark} >
                 <img src="/img/Group 2.png" alt="Group" />
          </button>
        </>
      ) : (
        <div className={styles.skeleton}></div>
      )}
    </div>
  );
}