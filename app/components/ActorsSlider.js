"use client";

import React, { useState, useEffect } from "react";
import styles from "./ActorsSlider.module.css";

export default function ActorsSlider({ movieId }) {
  const [actors, setActors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/movie/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch actors");
        const data = await response.json();
        setActors(data.people || []);
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchActors();
  }, [movieId]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, actors.length - 6)
    );
  };



  return (
    <div className={styles.sliderContainer}>
      {actors.length > 0 ? (
        <>
          <button
            className={styles.arrowLeft}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            &#8249;
          </button>
          <div className={styles.slider}>
            {actors.slice(currentIndex, currentIndex + 6).map((actor) => (
              <div key={actor.id} className={styles.actor}>
                
                <img
  src={actor?.image?.fileName 
    ? `http://localhost:5221/person/${actor.image.fileName}` 
    : 'http://localhost:5221/person/avatar.webp'}
  alt={`${actor.firstName} ${actor.lastName}`}
  className={styles.actorImage}
/>
                <p className={styles.actorName}>
                  {actor.firstName} {actor.lastName}
                </p>
              </div>
            ))}
          </div>
          <button
            className={styles.arrowRight}
            onClick={handleNext}
            disabled={currentIndex + 6 >= actors.length}
          >
            &#8250;
          </button>
        </>
      ) : (
        <p className={styles.noActors}>No actors available</p>
      )}
    </div>
  );
}