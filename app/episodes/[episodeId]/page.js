"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EpisodePlayerPage({ params }) {
  const { episodeId } = params; // Отримуємо id епізоду з URL
  const [videoUrl, setVideoUrl] = useState("");
  const [episodeData, setEpisodeData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/episode/${episodeId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Не вдалося завантажити епізод");
        }

        const data = await response.json();
        setEpisodeData(data); // Зберігаємо дані епізоду
        setVideoUrl(`http://localhost:5221/api/episode/stream/${episodeId}`); // Формуємо URL для відео
      } catch (error) {
        console.error("Помилка завантаження епізоду:", error);
        router.push("/404"); // Перенаправлення на сторінку 404 у разі помилки
      }
    };

    fetchEpisode();
  }, [episodeId, router]);

  if (!episodeData) {
    return <p>Завантаження...</p>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{episodeData.Name}</h1>
      <p>{episodeData.Description}</p>
      <video
        controls
        style={{ width: "100%", maxWidth: "800px" }}
        src={videoUrl}
      >
        Ваш браузер не підтримує відео.
      </video>
    </div>
  );
}