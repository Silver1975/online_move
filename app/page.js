"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Slider from './components/Slider';
import MoviesSlider from "./components/MoviesSlider";
import ComediesSlider from "./components/ComediesSlider";
import ActionSlider from './components/ActionSlider';
import MoviesForChildrenSlider from './components/MoviesForChildrenSlider';
import Pagination from './components/Pagination'; // Підключаємо наш компонент пагінації
import styles from './page.module.css';

async function fetchData(page = 1, limit = 15) {
  const res = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${page}`);
  const result = await res.json();

  if (!result || !result.data || !result.data.movies) {
    throw new Error('Movies not found');
  }

  return {
    movies: result.data.movies,
    totalResults: result.data.movie_count,
  };
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const { movies, totalResults } = await fetchData(currentPage, limit);
      setMovies(movies);
      setTotalPages(Math.ceil(totalResults / limit));
      setLoading(false);
    };

    loadMovies();
  }, [currentPage]);

  const handlePageChange = (page) => {
    router.push(`/?page=${page}`);
  };

  return (
   
    <div className={styles.page}>
       <Slider />
       <p className={styles.sectionTitle}>Action</p>
       <ActionSlider />
       <p className={styles.sectionTitle}>For children</p>
       <MoviesForChildrenSlider />
       <p style={{color:"#ff7432"}} className={styles.sectionTitle}>Top drams</p> 
       <MoviesSlider />
       <p className={styles.sectionTitle}>For funy evening</p> 
      <ComediesSlider />

    
    </div>
  );
}