"use client";

import { useEffect, useState } from "react";
import styles from "./AdminCountriesPage.module.css";

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCountry, setNewCountry] = useState({ name: "", slug: "" });

  // Fetch countries from the API
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5221/api/country");
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Handle adding a new country
  const handleAddCountry = async () => {
    try {
      const res = await fetch("http://localhost:5221/api/country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountry),
      });

      if (!res.ok) throw new Error("Failed to add country");

      setNewCountry({ name: "", slug: "" });
      fetchCountries(); // Refresh the country list
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle deleting a country
  const handleDeleteCountry = async (id) => {
    if (!confirm("Are you sure you want to delete this country?")) return;

    try {
      const res = await fetch(`http://localhost:5221/api/country/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete country");

      fetchCountries(); // Refresh the country list
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle input change for adding a new country
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCountry((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1>Manage Countries</h1>

      <div className={styles.addCountryForm}>
        <h2>Add New Country</h2>
        <input
          type="text"
          name="name"
          value={newCountry.name}
          onChange={handleInputChange}
          placeholder="Country Name"
        />
        <input
          type="text"
          name="slug"
          value={newCountry.slug}
          onChange={handleInputChange}
          placeholder="Country Slug"
        />
        <button onClick={handleAddCountry}>Add Country</button>
      </div>

      <h2>Countries List</h2>
      <ul className={styles.countryList}>
        {countries.map((country) => (
          <li key={country.id} className={styles.countryItem}>
            <span>{country.name}</span>
            <span>{country.slug}</span>
            <button onClick={() => handleDeleteCountry(country.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}