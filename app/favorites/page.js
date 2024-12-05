"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoading) return; // Чекаємо завершення завантаження даних користувача

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
      console.log("Removing movie with ID:", movieId);
  
      const res = await fetch("http://localhost:5221/api/user/favourite?movieId=" + movieId, {
        method: "DELETE",
        credentials: "include", // Передаємо куки для авторизації
      });
  
      if (!res.ok) {
        throw new Error("Failed to remove favorite movie.");
      }
  
      // Оновлення списку фільмів
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error("Error removing favorite:", err.message);
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
    <div>
      <h1 style={{ color: "white" }}>My Favorite Movies</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((movie) => (
          <li
            key={movie.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              color: "white",
            }}
          >
            <a
              href={`/movies/${movie.id}`}
              style={{ color: "#61dafb", textDecoration: "none" }}
            >
              {movie.name}
            </a>
            <button
              onClick={() => handleRemoveFavorite(movie.id)}
              style={{
                backgroundColor: "#ff7043",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}