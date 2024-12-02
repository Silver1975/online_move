"use client";

import styles from "./Details.module.css";

export default function Details({ description, genres }) {
  return (
    <div className={styles.detail}>
      <h3>Description</h3>
      <p>{description || "Description not available."}</p>
      
      <h3>Genres</h3>
      <p>{genres.length > 0 ? genres.join(", ") : "No genres available."}</p>
      
      <h3>Watch offline</h3>
      <p>Download and watch everywhere you go.</p>
    </div>
  );
}