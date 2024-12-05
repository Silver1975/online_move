"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./AdvancedSearch.module.css";

async function fetchSearchResults(params) {
  try {
    const res = await fetch("http://localhost:5221/api/movie/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error("Failed to fetch search results");

    return await res.json();
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { items: [], totalPages: 1 };
  }
}

export default function AdvancedSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [sortDesc, setSortDesc] = useState(searchParams.get("sortDesc") === "true");
  const [filters, setFilters] = useState(() => {
    const storedFilters = searchParams.get("filters");
    return storedFilters ? JSON.parse(storedFilters) : {};
  });
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateUrl = () => {
    const params = new URLSearchParams({
      query,
      sortBy,
      sortDesc: sortDesc.toString(),
      filters: JSON.stringify(filters),
      page: currentPage.toString(),
    });

    router.replace(`/advancedsearch?${params.toString()}`);
  };

  const fetchMovies = async () => {
    setLoading(true);
    const response = await fetchSearchResults({
      search: query,
      sortBy,
      sortDesc,
      filters,
      page: currentPage,
      pageSize: 9,
    });

    setMovies(response.items || []);
    setTotalPages(response.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [query, sortBy, sortDesc, filters, currentPage]);

  useEffect(() => {
    updateUrl();
  }, [query, sortBy, sortDesc, filters, currentPage]);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Скидання до першої сторінки
  };

  return (
    <div className={styles.advancedSearchPage}>
      <h1 style={{textAlign:"center", color:"#fff"}}>Advanced Search</h1>
      <div className={styles.searchControls}>
        <input
          type="text"
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="imdbRating">IMDb Rating</option>
          <option value="firstAirDate">First Air Date</option>
        </select>
        <label style={{color:"#fff"}}>
          <input
            type="checkbox"
            checked={sortDesc}
            onChange={(e) => setSortDesc(e.target.checked)}
          />
          Descending
        </label>

        {/* Додаткові фільтри */}
        <select
          value={filters["type"] || ""}
          onChange={(e) => handleFilterChange("type", [e.target.value])}
        >
          <option value="">Select Type</option>
          <option value="Movie">Movie</option>
          <option value="Serial">Serial</option>
          <option value="Cartoon">Cartoon</option>
        </select>

        <select
          value={filters["country"] || ""}
          onChange={(e) => handleFilterChange("country", [e.target.value])}
        >
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles.results}>
        {loading ? (
          <div className={styles.skeletonGrid}>
            {[...Array(9)].map((_, index) => (
              <div key={index} className={styles.skeletonCard}></div>
            ))}
          </div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <h3>{movie.name}</h3>
              <p>{movie.description}</p>
              <a href={`/movies/${movie.id}`} className={styles.movieLink}>
                View Details
              </a>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <button
              key={pageNumber}
              className={currentPage === pageNumber + 1 ? styles.activePage : ""}
              onClick={() => setCurrentPage(pageNumber + 1)}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}