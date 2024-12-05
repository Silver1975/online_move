"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

export default function MoviesAdminPage() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    name: "",
    description: "",
    restrictedRating: "PG",
    duration: "",
    firstAirDate: "",
    lastAirDate: "",
    amountOfEpisodes: "",
    imdbRating: "",
    countries: "",
    tags: "",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [bigPosterFile, setBigPosterFile] = useState(null);
  const [imageTitleFile, setImageTitleFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5221/api/movie");
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async () => {
    setError("");

    const formData = new FormData();
    formData.append("name", newMovie.name);
    formData.append("description", newMovie.description);
    formData.append("restrictedRating", newMovie.restrictedRating);
    formData.append("duration", newMovie.duration);
    formData.append("firstAirDate", newMovie.firstAirDate);
    formData.append("lastAirDate", newMovie.lastAirDate);
    formData.append("amountOfEpisodes", newMovie.amountOfEpisodes);
    formData.append("imdbRating", newMovie.imdbRating);
    formData.append("countries", newMovie.countries);
    formData.append("tags", newMovie.tags);
    formData.append("poster", posterFile);
    formData.append("background", backgroundFile);
    formData.append("bigPoster", bigPosterFile);
    formData.append("imageTitle", imageTitleFile);

    try {
      const response = await fetch("http://localhost:5221/api/movie", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add movie");
      fetchMovies();
      setNewMovie({
        name: "",
        description: "",
        restrictedRating: "PG",
        duration: "",
        firstAirDate: "",
        lastAirDate: "",
        amountOfEpisodes: "",
        imdbRating: "",
        countries: "",
        tags: "",
      });
      setPosterFile(null);
      setBackgroundFile(null);
      setBigPosterFile(null);
      setImageTitleFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMovie = async (id) => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/movie/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete movie");
      fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{color:"#fff"}}>Manage Movies</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.moviesList}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className={styles.movieItem}>
              <p style={{color:"#fff"}}>
                <strong>{movie.name}</strong> ({movie.firstAirDate?.split("-")[0]})
              </p>
              <div className={styles.actions}>
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
                <button onClick={() => router.push(`/admin/movies/${movie.id}/edit`)}>
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 style={{color:"#fff"}}>Add New Movie</h2>
      <div className={styles.inputGroup}>
        <label>Name:</label>
        <input
          type="text"
          value={newMovie.name}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <label>Description:</label>
        <textarea
          value={newMovie.description}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <label>Restricted Rating:</label>
        <select
          value={newMovie.restrictedRating}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, restrictedRating: e.target.value }))
          }
        >
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
          <option value="NC-17">NC-17</option>
        </select>
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={newMovie.duration}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, duration: e.target.value }))
          }
        />
        <label>First Air Date:</label>
        <input
          type="date"
          value={newMovie.firstAirDate}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, firstAirDate: e.target.value }))
          }
        />
        <label>Last Air Date:</label>
        <input
          type="date"
          value={newMovie.lastAirDate}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, lastAirDate: e.target.value }))
          }
        />
        <label>Amount of Episodes:</label>
        <input
          type="number"
          value={newMovie.amountOfEpisodes}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, amountOfEpisodes: e.target.value }))
          }
        />
        <label>IMDb Rating:</label>
        <input
          type="number"
          step="0.1"
          value={newMovie.imdbRating}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, imdbRating: e.target.value }))
          }
        />
        <label>Countries (comma-separated):</label>
        <input
          type="text"
          value={newMovie.countries}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, countries: e.target.value }))
          }
        />
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          value={newMovie.tags}
          onChange={(e) =>
            setNewMovie((prev) => ({ ...prev, tags: e.target.value }))
          }
        />
        <label>Poster:</label>
        <input type="file" onChange={(e) => setPosterFile(e.target.files[0])} />
        <label>Background:</label>
        <input type="file" onChange={(e) => setBackgroundFile(e.target.files[0])} />
        <label>Big Poster:</label>
        <input type="file" onChange={(e) => setBigPosterFile(e.target.files[0])} />
        <label>Image Title:</label>
        <input type="file" onChange={(e) => setImageTitleFile(e.target.files[0])} />
        <button onClick={addMovie}>Add Movie</button>
      </div>
    </div>
  );
}