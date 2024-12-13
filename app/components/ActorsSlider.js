"use client";

import React, { useState, useEffect } from "react";
import styles from "./ActorsSlider.module.css";

export default function ActorsSlider({ movieId }) {
  const [actors, setActors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6; // Оголошуємо, що на одному слайді буде 9 акторів

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage < actors.length ? prevIndex + itemsPerPage : 0 // Повертаємось до початку
    );
  };



  return (
    <div className={styles.sliderContainer}>
      {actors.length > 0 ? (
        <>
          
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
          <button onClick={handleNext} className={styles.navButton}>
            <img src="/img/vector-arrow.svg" alt="Next" className={styles.navIcon} />
          </button>
        </>
      ) : (
        <p className={styles.noActors}>No actors available</p>
      )}
    </div>
  );
}