"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./RelatedMoviesSlider.module.css";

export default function RelatedMoviesSlider({ movieId, tags }) {
    const [relatedMovies, setRelatedMovies] = useState([]);
    const sliderRef = useRef(null);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("http://localhost:5221/api/movie"); // Заміна на ваш API для отримання списку фільмів
          const movies = await response.json();
  
          const filteredMovies = movies.filter(
            (movie) =>
              movie.id !== movieId && movie.tags.some((tag) => tags.includes(tag))
          );
  
          setRelatedMovies(filteredMovies);
        } catch (error) {
          console.error("Помилка завантаження пов'язаних фільмів:", error);
        }
      };
  
      fetchMovies();
    }, [movieId, tags]);
  
    const scrollLeft = () => {
      sliderRef.current.scrollBy({
        left: -300, // Змінити на розмір елемента
        behavior: "smooth",
      });
    };
  
    const scrollRight = () => {
      sliderRef.current.scrollBy({
        left: 300, // Змінити на розмір елемента
        behavior: "smooth",
      });
    };
  
    return (
      <div className={styles.sliderWrapper}>
        <button className={styles.scrollButtonLeft} onClick={scrollLeft}>
          &#8592;
        </button>
        <div className={styles.sliderContainer} ref={sliderRef}>
          {relatedMovies.slice(0, 10).map((movie) => (
            <div className={styles.box1} key={movie.id}>
              <div className={styles.boxImage1}>
              <Link href={`/movies/${movie.id}`}>
              <img src={`http://localhost:5221/bigPosters/${movie?.bigPoster?.fileName}`} alt={`Poster of ${movie.title}`} />
              </Link>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.scrollButtonRight} onClick={scrollRight}>
          &#8594;
        </button>
      </div>
    );
  }
  