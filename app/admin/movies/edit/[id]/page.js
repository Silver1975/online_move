"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditMoviePage({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5221/api/movie/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await response.json();
        setMovie(data);
        setFormData({
          name: data.name,
          description: data.description,
          restrictedRating: data.restrictedRating,
          duration: data.duration,
          firstAirDate: data.firstAirDate,
          lastAirDate: data.lastAirDate,
          imdbRating: data.imdbRating,
          amountOfEpisodes: data.amountOfEpisodes,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5221/api/movie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update movie");
      }
      alert("Movie updated successfully");
      router.push("/admin/movies");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading movie data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" , color:"#fff"}}>
      <h1>Edit Movie: {movie?.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Restricted Rating:
            <input
              type="text"
              name="restrictedRating"
              value={formData.restrictedRating || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Duration (in minutes):
            <input
              type="number"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            First Air Date:
            <input
              type="date"
              name="firstAirDate"
              value={formData.firstAirDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Last Air Date:
            <input
              type="date"
              name="lastAirDate"
              value={formData.lastAirDate?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            IMDb Rating:
            <input
              type="number"
              step="0.1"
              name="imdbRating"
              value={formData.imdbRating || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Amount of Episodes:
            <input
              type="number"
              name="amountOfEpisodes"
              value={formData.amountOfEpisodes || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}