"use client";

import { useState, useEffect } from "react";
import styles from "./Admin.module.css";

export default function EpisodesAdminPage() {
  const [seasonId, setSeasonId] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState({
    number: "",
    name: "",
    description: "",
    duration: "",
    airDate: "",
    slug: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEpisodes = async () => {
    if (!seasonId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/episode/${seasonId}`);
      if (!response.ok) throw new Error("Failed to fetch episodes");
      const data = await response.json();
      setEpisodes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEpisode = async () => {
    setError("");
    if (!imageFile || !videoFile) {
      setError("Image and video files are required");
      return;
    }

    const formData = new FormData();
    formData.append("seasonId", seasonId);
    formData.append("image", imageFile);
    formData.append("video", videoFile);
    for (const key in newEpisode) {
      formData.append(key, newEpisode[key]);
    }

    try {
      const response = await fetch("http://localhost:5221/api/episode", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add episode");
      fetchEpisodes(); // Refresh the list
      setNewEpisode({
        number: "",
        name: "",
        description: "",
        duration: "",
        airDate: "",
        slug: "",
      });
      setImageFile(null);
      setVideoFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEpisode = async (id) => {
    setError("");
    try {
      const response = await fetch(`http://localhost:5221/api/episode/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete episode");
      fetchEpisodes(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [seasonId]);

  return (
    <div className={styles.container}>
      <h1 style={{color:"#fff"}}>Manage Episodes</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label>Season ID:</label>
        <input
          type="number"
          value={seasonId}
          onChange={(e) => setSeasonId(e.target.value)}
          placeholder="Enter season ID to load episodes"
        />
      </div>

      <div className={styles.episodesList}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          episodes.map((episode) => (
            <div key={episode.id} className={styles.episodeItem}>
              <p>
                <strong>Episode {episode.number}:</strong> {episode.name}
              </p>
              <p>{episode.description}</p>
              <button onClick={() => deleteEpisode(episode.id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      <h2 style={{color:"#fff"}}>Add New Episode</h2>
      <div className={styles.inputGroup}>
        <label>Number:</label>
        <input
          type="number"
          value={newEpisode.number}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, number: e.target.value }))
          }
        />
        <label>Name:</label>
        <input
          type="text"
          value={newEpisode.name}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <label>Description:</label>
        <textarea
          value={newEpisode.description}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={newEpisode.duration}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, duration: e.target.value }))
          }
        />
        <label>Air Date:</label>
        <input
          type="date"
          value={newEpisode.airDate}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, airDate: e.target.value }))
          }
        />
        <label>Slug:</label>
        <input
          type="text"
          value={newEpisode.slug}
          onChange={(e) =>
            setNewEpisode((prev) => ({ ...prev, slug: e.target.value }))
          }
        />
        <label>Image:</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <label>Video:</label>
        <input type="file" onChange={(e) => setVideoFile(e.target.files[0])} />
        <button onClick={addEpisode}>Add Episode</button>
      </div>
    </div>
  );
}