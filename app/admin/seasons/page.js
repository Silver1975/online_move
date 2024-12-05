"use client";

import { useState, useEffect } from "react";
import styles from "./Admin.module.css";

export default function SeasonsAdminPage() {
  const [movieId, setMovieId] = useState("");
  const [movieName, setMovieName] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [newSeason, setNewSeason] = useState({ number: "", name: "" });
  const [editingSeason, setEditingSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovieName = async () => {
    if (!movieId) {
      setMovieName("");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5221/api/movie/${movieId}`);
      if (!response.ok) throw new Error("Failed to fetch movie name");
      const data = await response.json();
      setMovieName(data.name);
    } catch (err) {
      setError(err.message);
      setMovieName("");
    }
  };

  const fetchSeasons = async () => {
    if (!movieId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/season/${movieId}`);
      if (!response.ok) throw new Error("Failed to fetch seasons");
      const data = await response.json();
      setSeasons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSeason = async () => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/season`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: parseInt(movieId), ...newSeason }),
      });
      if (!response.ok) throw new Error("Failed to add season");
      fetchSeasons(); // Refresh the list
      setNewSeason({ number: "", name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateSeason = async () => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/season/${editingSeason.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSeason),
      });
      if (!response.ok) throw new Error("Failed to update season");
      fetchSeasons(); // Refresh the list
      setEditingSeason(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSeason = async (id) => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/season/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete season");
      fetchSeasons(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovieName();
    fetchSeasons();
  }, [movieId]);

  return (
    <div className={styles.container}>
      <h1>Manage Seasons</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label>Movie ID:</label>
        <input
          type="number"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="Enter movie ID to load seasons"
        />
      </div>

      {movieName && (
        <h2 className={styles.movieName}>
          Movie: <span>{movieName}</span>
        </h2>
      )}

      <div className={styles.seasonsList}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          seasons.map((season) => (
            <div key={season.id} className={styles.seasonItem}>
              {editingSeason && editingSeason.id === season.id ? (
                <div className={styles.editSeasonForm}>
                  <input
                    type="number"
                    value={editingSeason.number}
                    onChange={(e) =>
                      setEditingSeason((prev) => ({ ...prev, number: e.target.value }))
                    }
                  />
                  <input
                    type="text"
                    value={editingSeason.name}
                    onChange={(e) =>
                      setEditingSeason((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <button onClick={updateSeason}>Save</button>
                  <button onClick={() => setEditingSeason(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <p>
                    <strong>Season {season.number}:</strong> {season.name}
                  </p>
                  <button onClick={() => setEditingSeason(season)}>Edit</button>
                  <button onClick={() => deleteSeason(season.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <h2>Add New Season</h2>
      <div className={styles.inputGroup}>
        <label>Number:</label>
        <input
          type="number"
          value={newSeason.number}
          onChange={(e) => setNewSeason((prev) => ({ ...prev, number: e.target.value }))}
        />
        <label>Name:</label>
        <input
          type="text"
          value={newSeason.name}
          onChange={(e) => setNewSeason((prev) => ({ ...prev, name: e.target.value }))}
        />
        <button onClick={addSeason}>Add Season</button>
      </div>
    </div>
  );
}