"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "../components/Pagination"; // Компонент пагінації
import styles from "../page.module.css";

async function searchMovies(query, page = 1, pageSize = 15) {
  try {
    const res = await fetch("http://localhost:5221/api/movie/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        search: query,
        sortBy: null,
        sortDesc: false,
        filters: null,
        page,
        pageSize,
      }),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();
    return {
      movies: data || [], // Виправлено для правильного оброблення масиву
      totalResults: (data?.length || 0) * pageSize, // Оцінюємо загальну кількість результатів
    };
  } catch (error) {
    console.error("Помилка пошуку:", error);
    return { movies: [], totalResults: 0 };
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 9; // Кількість фільмів на сторінку

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5221/api/movie/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search: query,
            page: currentPage,
            pageSize,
            sortBy: null,
            sortDesc: false,
            filters: null,
          }),
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        console.log("Fetched movies:", data); // Лог для перевірки
        setMovies(data.items || []); // Збереження фільмів
        setTotalResults(data.totalPages * pageSize || 0); // Загальна кількість результатів
      } catch (error) {
        console.error("Помилка завантаження:", error);
      }
      setLoading(false);
    };

    loadMovies();
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    router.push(`/search?query=${query}&page=${page}`);
  };

  // Показуємо скелетон під час завантаження
  if (loading)
    return (
      <div className={styles.skeletonContainer}>
        {[...Array(pageSize)].map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div
              style={{
                height: "200px",
                width: "300px",
                backgroundColor: "#e0e0e0",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            />
            <div
              style={{
                height: "20px",
                width: "150px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                textAlign: "center",
              }}
            />
          </div>
        ))}
      </div>
    );

  return (
    <div className={styles.page}>
      <h1 style={{textAlign: "center", color:"#fff"}}>Результати пошуку для: "{query}"</h1>
      <p style={{textAlign: "center",margin:"20px"}}><Link href={`/advancedsearch`} style={{color:"#fff", padding:"5px 10px", borderRadius:"4px", textDecoration:"none",backgroundColor:"#0070f3"}}>Advanced Search</Link></p>
      <main className={styles.main}>
      
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <img
                className={styles.moviePoster}
                src={`http://localhost:5221/posters/${movie.poster.fileName}`}
                alt={movie.name}
                width={200}
                height={300}
              />
              <div className={styles.movieTitle}>
                <Link href={`/movies/${movie.id}`}>{movie.name}</Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{textAlign: "center", color:"#fff"}}>Фільми не знайдено</p>
        )}
      </main>

      {/* Пагінація */}
      {totalResults > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalResults / pageSize)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}