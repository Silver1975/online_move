"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./MoviePage.module.css";

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query; // Отримуємо ID фільму з URL
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/movie/${id}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}   style={{
        backgroundImage: `url(http://localhost:5221${movie.bigPoster})`,
      }}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>{movie.name}</h1>
            <p>{movie.description}</p>
            <div className={styles.flexElements}>
              <div className={styles.element}>
                {movie.tags ? movie.tags.join(", ") : "No tags"}
              </div>
              <div className={styles.element}>
                {movie.firstAirDate ? new Date(movie.firstAirDate).getFullYear() : "Unknown"}
              </div>
              <div className={styles.element}>
                {movie.amountOfEpisodes ? `${movie.amountOfEpisodes} episodes` : "No episodes"}
              </div>
              <div className={styles.element}>{movie.restrictedRating || "No rating"}</div>
            </div>
            <div className={styles.actionRow}>
              <button className={styles.watchNow}>Watch now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className={styles.tabSection}>
        <div className={styles.container}>
          {/* Радіокнопки для вкладок */}
          <input type="radio" id="tab1" name="tab" defaultChecked />
          <label className={styles.tabItem} htmlFor="tab1">
            Episodes
          </label>

          <input type="radio" id="tab2" name="tab" />
          <label className={styles.tabItem} htmlFor="tab2">
            Details
          </label>

          <input type="radio" id="tab3" name="tab" />
          <label className={styles.tabItem} htmlFor="tab3">
            Extras/Cast
          </label>

          <input type="radio" id="tab4" name="tab" />
          <label className={styles.tabItem} htmlFor="tab4">
            Related
          </label>

          <input type="radio" id="tab5" name="tab" />
          <label className={styles.tabItem} htmlFor="tab5">
            Reviews
          </label>

          {/* Вкладки */}
          <div className={styles.tabContent}>
            {/* Episodes */}
            <div className={styles.contentSection} id="content1">
              {/* Компонент Episodes */}
              <p>Here will be Episodes Component</p>
            </div>

            {/* Details */}
            <div className={styles.contentSection} id="content2">
              <h3>Description</h3>
              <p>{movie.description}</p>
              <h3>Genres</h3>
              <p>{movie.tags ? movie.tags.join(", ") : "No genres"}</p>
            </div>

            {/* Extras / Cast */}
            <div className={styles.contentSection} id="content3">
              {/* Компонент Extras / Cast */}
              <p>Here will be Extras / Cast Component</p>
            </div>

            {/* Related */}
            <div className={styles.contentSection} id="content4">
              {/* Компонент Related */}
              <p>Here will be Related Movies Component</p>
            </div>

            {/* Reviews */}
            <div className={styles.contentSection} id="content5">
              {/* Компонент Reviews */}
              <p>Here will be Reviews Component</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}