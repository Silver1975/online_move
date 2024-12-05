"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./EditMovie.module.css";

export default function EditMoviePage({ params }) {
  const { id: movieId } = params; // Отримуємо id з параметрів
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [bigPosterFile, setBigPosterFile] = useState(null);
  const [imageTitleFile, setImageTitleFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:5221/api/movie/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSave = async () => {
    setError("");
    const formData = new FormData();
    formData.append("name", movie.name);
    formData.append("description", movie.description);
    formData.append("restrictedRating", movie.restrictedRating);
    formData.append("duration", movie.duration);
    formData.append("firstAirDate", movie.firstAirDate);
    formData.append("lastAirDate", movie.lastAirDate);
    formData.append("amountOfEpisodes", movie.amountOfEpisodes);
    formData.append("imdbRating", movie.imdbRating);
    formData.append("countries", movie.countries.join(","));
    formData.append("tags", movie.tags.join(","));
    if (posterFile) formData.append("poster", posterFile);
    if (backgroundFile) formData.append("background", backgroundFile);
    if (bigPosterFile) formData.append("bigPoster", bigPosterFile);
    if (imageTitleFile) formData.append("imageTitle", imageTitleFile);

    try {
      const response = await fetch(`http://localhost:5221/api/movie/${movieId}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to save movie");
      router.push("/admin/movies");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return null;

  return (
    <div className={styles.container}>
      <h1>Edit Movie</h1>
      <div className={styles.inputGroup}>
        <label>Name:</label>
        <input
          type="text"
          value={movie.name}
          onChange={(e) => setMovie({ ...movie, name: e.target.value })}
        />
        <label>Description:</label>
        <textarea
          value={movie.description}
          onChange={(e) => setMovie({ ...movie, description: e.target.value })}
        />
        <label>Restricted Rating:</label>
        <select
          value={movie.restrictedRating}
          onChange={(e) => setMovie({ ...movie, restrictedRating: e.target.value })}
        >
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
          <option value="NC-17">NC-17</option>
        </select>
        <label>Duration:</label>
        <input
          type="number"
          value={movie.duration}
          onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
        />
        <label>First Air Date:</label>
        <input
          type="date"
          value={movie.firstAirDate}
          onChange={(e) => setMovie({ ...movie, firstAirDate: e.target.value })}
        />
        <label>Last Air Date:</label>
        <input
          type="date"
          value={movie.lastAirDate}
          onChange={(e) => setMovie({ ...movie, lastAirDate: e.target.value })}
        />
        <label>Amount of Episodes:</label>
        <input
          type="number"
          value={movie.amountOfEpisodes}
          onChange={(e) => setMovie({ ...movie, amountOfEpisodes: e.target.value })}
        />
        <label>IMDb Rating:</label>
        <input
          type="number"
          step="0.1"
          value={movie.imdbRating}
          onChange={(e) => setMovie({ ...movie, imdbRating: e.target.value })}
        />
        <label>Poster:</label>
        <input type="file" onChange={(e) => setPosterFile(e.target.files[0])} />
        <label>Background:</label>
        <input type="file" onChange={(e) => setBackgroundFile(e.target.files[0])} />
        <label>Big Poster:</label>
        <input type="file" onChange={(e) => setBigPosterFile(e.target.files[0])} />
        <label>Image Title:</label>
        <input type="file" onChange={(e) => setImageTitleFile(e.target.files[0])} />
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
