"use client";

import { useEffect, useState } from "react";
import styles from "./MoviePage.module.css";
import Tabs from "@/app/components/Tabs";
import { useAuth } from "@/app/contexts/AuthContext";

export default function MoviePage({ params }) {
  const { movieId } = params;
  const [movie, setMovie] = useState(null);
  const { user } = useAuth(); // Отримуємо інформацію про користувача
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/movie/${movieId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch("http://localhost:5221/api/User/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(movie.id), // Просто число без ключа
      });
  
      if (!response.ok) {
        throw new Error("Failed to add movie to favourites.");
      }
      const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
      console.log("Movie added to favourites!");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!movie) {
    return <p>Loading...</p>; // Можна замінити на скелетон
  }
  return (
    <>
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: `url(http://localhost:5221/Posters/${movie?.poster?.fileName})`,
        }}
      >
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>{movie.name}</h1>
            <p>{movie.description}</p>
            <div className={styles.flexElements}>
              <div className={styles.element}>{movie.tags?.join(", ")}</div>
              <div className={styles.element}>{movie.firstAirDate?.split("-")[0]}</div>
              <div className={styles.element}>{movie.amountOfEpisodes} season</div>
              <div className={styles.element}>{movie.restrictedRating}</div>
            </div>
            <div className={styles.actionRow}>
              <button className={styles.watchNow}> <span>Watch now</span></button>
              <button
                className={`${styles.bookmark} ${isAddedToFavorites ? styles.added : ""}`}
                onClick={handleAddToFavorites}
                disabled={isAddedToFavorites}
              >
                {isAddedToFavorites ? "Added" : <img src="/img/bi_bookmark.png" alt="Wishlist" />}
              </button>
              <button className={styles.bookmark} >
                 <img src="/img/Group 2.png" alt="Group" />
              </button>
              <button className={styles.bookmark} >
                 <img src="/img/download 01.png" alt="download" />
              </button>
              <button className={styles.bookmark} >
                 <img src="/img/Frame 249.png" alt="like" />
              </button>
              <button className={styles.bookmark} >
                 <img src="/img/Frame 248.png" alt="dislike" />
              </button>
              <button className={styles.bookmark} >
                 <img src="/img/Frame 250.png" alt="Share" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Tabs movie={movie} />
    </>
  );
}