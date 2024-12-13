"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Favorites.module.css"; // Підключаємо стилі

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5221/api/user/favourite", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch favorite movies.");
        }

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, isLoading, router]);

  const handleRemoveFavorite = async (movieId) => {
    try {
      const res = await fetch(`http://localhost:5221/api/user/favourite?movieId=${movieId}`, {
        method: "DELETE",
        credentials: "include", 
      });
  
      if (!res.ok) {
        throw new Error("Failed to remove favorite movie.");
      }
  
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading || loading) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "white" }}>{error}</p>;
  }

  if (!favorites.length) {
    return <p style={{ color: "white" }}>No favorite movies found.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Favorite Movies</h1>

      <div className={styles.moviesGrid}>
        {favorites.map((movie) => (
          <div key={movie.id} className={styles.movieCard}>
            <a href={`/movies/${movie.id}`} className={styles.posterLink}>
              <img
                src={`http://localhost:5221/posters/${movie?.poster}`} 
                alt={movie.name}
                className={styles.poster}
              />
            </a>
            <div className={styles.movieInfo}>
              <a
                href={`/movies/${movie.id}`}
                className={styles.movieTitle}
              >
                {movie.name}
              </a>
              <button
                onClick={() => handleRemoveFavorite(movie.id)}
                className={styles.deleteButton}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}