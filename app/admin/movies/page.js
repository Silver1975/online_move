"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MoviesAdminPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Ініціалізація router
  
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5221/api/movie", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      const response = await fetch(`http://localhost:5221/api/movie/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", color:"#fff" }}>
      <h1>Manage Movies</h1>
      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.name}</td>
                <td>
                  <button
                    onClick={() =>  router.push(`/admin/movies/edit/${movie.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(movie.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
        onClick={() => alert("Add functionality not implemented")}
      >
        Add New Movie
      </button>
    </div>
  );
}