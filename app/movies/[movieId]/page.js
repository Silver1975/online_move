"use client";

import { useEffect, useState } from "react";
import styles from "./MoviePage.module.css";
import Tabs from "@/app/components/Tabs";

export default function MoviePage({ params }) {
  const { movieId } = params;
  const [movie, setMovie] = useState(null);

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

  if (!movie) {
    return <p>Loading...</p>; // Можна замінити на скелетон
  }

  return (
    <>
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: `url(http://localhost:5221/bigPosters/${movie?.bigPoster?.fileName})`,
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
              <button className={styles.watchNow}>Watch now</button>
            </div>
          </div>
        </div>
      </section>

      <Tabs movie={movie} />
    </>
  );
}