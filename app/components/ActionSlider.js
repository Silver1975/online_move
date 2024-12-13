"use client";

import { useEffect, useState } from "react";
import styles from "./MoviesForChildrenSlider.module.css";
import { useRouter } from "next/navigation";

export default function MoviesForChildrenSlider() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5221/api/movie");
        const data = await response.json();
       
       const filteredMovies = data.filter((movie) =>
        movie.tags.includes("Action")
      );

        setMovies(filteredMovies);
      } catch (error) {
        console.error("Помилка завантаження фільмів:", error);
      } finally {
        setLoading(false);
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
          
          <div className={styles.slidesContainer}>
            {visibleMovies.map((movie) => (
              <div key={movie.id} className={styles.box}>
                <div className={styles.boxImage}>
                  <img
                    src={`http://localhost:5221/bigPosters/${movie.bigPoster.fileName}`}
                    alt={movie.name}
                  />
                </div>
                <div className={styles.hoverCard}>
                  <img
                    src={`http://localhost:5221/bigPosters/${movie.bigPoster.fileName}`}
                    alt={movie.name}
                    className={styles.cardImage}
                  />
                  <h3 className={styles.movieTitle}>{movie.name}</h3>
                  <button
                    className={styles.watchButton}
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    Watch Now
                  </button>
                  <div className={styles.iconContainerc}>
                    <img 
                      src="/img/Component 21.png" 
                      alt="Bookmark" 
                      className={styles.iconClass} 
                    />
                    <img 
                      src="/img/Component 22.png" 
                      alt="Component 22" 
                      className={styles.iconClass} 
                    />
                  </div>
                  <div className={styles.flexElements}>
                    <div style={{color:"#c0c0c0", fontSize:"14", margin:"0 1px 0 12px"}} >{movie.tags?.join(", ")}</div>
                    <div style={{color:"#c0c0c0", fontSize:"14",margin:"0 1px 0 0"}}>{movie.firstAirDate?.split("-")[0]}</div>
                    <div style={{color:"#c0c0c0", fontSize:"14",margin:"0 1px 0 0"}}>{movie.amountOfEpisodes} s-ns</div>
                    <div style={{color:"#fff", fontSize:"14",fontFamily:"'Quicksand', sans-serif",margin:"0 1px 0 0"}}>{movie.restrictedRating}</div>
                  </div>
                  <p style={{color:"#fff", textAlign:"justify", fontFamily:"'Quicksand', sans-serif",fontSize:"16", margin:"12px" }} >{movie.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleNextSlide} className={styles.arrowRight}>
            <img src="/img/vector-arrow.svg" alt="Next" />
          </button>
        </>
      ) : (
        <div className={styles.skeleton}>Немає фільмів...</div>
      )}
    </div>
  );
}