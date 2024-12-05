"use client";

import AdminRoute from "../components/AdminRoute";
import styles from './Admin.module.css';
import Link from "next/link";
export default function AdminPage() {
  return (
    <AdminRoute>
        <div className={styles.container}>
      <header className={styles.header}>
        <div>Admin Dashboard</div>
        <Link href="/logout" className={styles.navItem}>
          Logout
        </Link>
      </header>

      <nav className={styles.navbar}>
        <Link href="/admin/countries" className={styles.navItem}>
          Countries
        </Link>
        <Link href="/admin/moviestudios" className={styles.navItem}>
          Studios
        </Link>
        <Link href="/admin/movietags" className={styles.navItem}>
          Tags
        </Link>
        <Link href="/admin/persons" className={styles.navItem}>
          Persons
        </Link>
        <Link href="/admin/episodes" className={styles.navItem}>
          Episodes
        </Link>
        <Link href="/admin/movies" className={styles.navItem}>
          Movies
        </Link>
      </nav>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h3>Manage Countries</h3>
          <p>Add, view, or delete countries.</p>
          <Link href="/admin/countries">
            <button>Go to Countries</button>
          </Link>
        </div>

        <div className={styles.card}>
          <h3>Manage Seasons</h3>
          <p>Handle movie seasons and their details.</p>
          <Link href="/admin/seasons">
            <button>Go to Seasons</button>
          </Link>
        </div>

        <div className={styles.card}>
          <h3>Manage Tags</h3>
          <p>Manage tags and categories for movies.</p>
          <Link href="/admin/movietags">
            <button>Go to Tags</button>
          </Link>
        </div>

        <div className={styles.card}>
          <h3>Manage Persons</h3>
          <p>View, add, or remove persons.</p>
          <Link href="/admin/persons">
            <button>Go to Persons</button>
          </Link>
        </div>

        <div className={styles.card}>
          <h3>Manage Episodes</h3>
          <p>Manage episodes for series or shows.</p>
          <Link href="/admin/episodes">
            <button>Go to Episodes</button>
          </Link>
        </div>

        <div className={styles.card}>
          <h3>Manage Movies</h3>
          <p>Handle movies, posters, and details.</p>
          <Link href="/admin/movies">
            <button>Go to Movies</button>
          </Link>
        </div>
      </div>
      </div>
    </AdminRoute>
  );
}