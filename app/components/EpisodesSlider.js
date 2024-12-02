"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./EpisodesSlider.module.css";

export default function EpisodesSlider({ seasonId }) {
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/episode/${seasonId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Не вдалося завантажити епізоди");
        }

        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        console.error("Помилка завантаження епізодів:", error);
      }
    };

    fetchEpisodes();
  }, [seasonId]);

  const handleNext = () => {
    if (currentIndex + itemsPerPage < episodes.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  };

  const visibleEpisodes = episodes.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className={styles.slider}>
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={styles.navButton}
      >
        &lt;
      </button>

      <div className={styles.episodes}>
        {visibleEpisodes.map((episode) => (
          <div key={episode.id} className={styles.box}>
            <div className={styles.boxImage}>
              <img
                src={`http://localhost:5221/episode/${episode?.image?.fileName}`}
                alt={episode.name}
                className={styles.image}
              />
              <span className={styles.imageText}>{episode.duration} min</span>
            </div>
            <p className={styles.boxSubtitle}>Episode {episode.number}</p>
            <h3 className={styles.boxTitle}>{episode.name}</h3>
            <p className={styles.boxDescription}>{episode.description}</p>
            <Link href={`/episodes/${episode.id}`}>
            <p className={styles.watchLink}>Watch Now</p>
          </Link>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentIndex + itemsPerPage >= episodes.length}
        className={styles.navButton}
      >
        &gt;
      </button>
    </div>
  );
}
