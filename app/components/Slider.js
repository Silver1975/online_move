"use client";
import { useState, useEffect } from "react";
import styles from "./Slider.module.css"; // Підключаємо стилі

const images = [
  {
    src: "/img/Rectangle1.png",
    title: "Batman",
    description:
      "A killer targets Gotham's elite sending Batman on an investigation. As evidence mounts, he must forge new relationships, unmask the culprit, and bring justice to corruption.",
  },
  {
    src: "/img/Rectangle2.png",
    title: "Superman",
    description:
      "Superman must battle his greatest foes while striving to maintain the hope and trust of the people of Metropolis.",
  },
  {
    src: "/img/Rectangle3.png",
    title: "Wonder Woman",
    description:
      "Wonder Woman embarks on a journey to save the world and uncover the truth about her past.",
  },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Активуємо ефект затемнення
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setFade(false); // Повертаємо прозорість
      }, 500);
    }, 3000); // Інтервал між слайдами

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slider}>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].title}
        className={`${styles.image} ${fade ? styles.fade : ""}`}
      />

      <div className={styles.captionContainer}>
        <h1 className={styles.title}>{images[currentIndex].title}</h1>
        <p className={styles.description}>
          {images[currentIndex].description}
        </p>
        <button className={styles.button} onClick={() => alert("Coming soon!")}>
          Whatch soon
        </button>
      </div>

      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}