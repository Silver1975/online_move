"use client";

import { useState, useEffect } from "react";
import styles from "./AdminPersons.module.css";

export default function AdminPersons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newPerson, setNewPerson] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaImage: "",
    image: null,
  });

  const fetchPersons = async () => {
    try {
      const response = await fetch("http://localhost:5221/api/person");
      if (!response.ok) throw new Error("Failed to fetch persons.");
      const data = await response.json();
      setPersons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newPerson).forEach((key) => {
      if (newPerson[key]) formData.append(key, newPerson[key]);
    });

    try {
      const response = await fetch("http://localhost:5221/api/person", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add person.");
      fetchPersons();
      setNewPerson({
        firstName: "",
        lastName: "",
        birthDate: "",
        deathDate: "",
        biography: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaImage: "",
        image: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      const response = await fetch(`http://localhost:5221/api/person/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete person.");
      fetchPersons();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 style={{color:"#fff"}}>Manage Persons</h1>
      <form onSubmit={handleAddPerson} className={styles.form}>
        <input
          type="text"
          placeholder="First Name"
          value={newPerson.firstName}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newPerson.lastName}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
        />
        <input
          type="date"
          value={newPerson.birthDate}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, birthDate: e.target.value }))
          }
        />
        <input
          type="date"
          value={newPerson.deathDate}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, deathDate: e.target.value }))
          }
        />
        <textarea
          placeholder="Biography"
          value={newPerson.biography}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, biography: e.target.value }))
          }
        ></textarea>
        <input
          type="text"
          placeholder="Slug"
          value={newPerson.slug}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, slug: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Meta Title"
          value={newPerson.metaTitle}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, metaTitle: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Meta Description"
          value={newPerson.metaDescription}
          onChange={(e) =>
            setNewPerson((prev) => ({
              ...prev,
              metaDescription: e.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="Meta Image"
          value={newPerson.metaImage}
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, metaImage: e.target.value }))
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setNewPerson((prev) => ({ ...prev, image: e.target.files[0] }))
          }
        />
        <button type="submit" className={styles.submitButton}>Add Person</button>
      </form>

      <ul className={styles.personList}>
        {persons.map((person) => (
          <li key={person.id} className={styles.personItem}>
            <div>
              <strong>ID:</strong> {person.id}
            </div>
            <p>
              <strong>Name:</strong> {person.firstName} {person.lastName}
            </p>
            {person.image && (
              <img
                src={`http://localhost:5221/person/${person.image.fileName}`}
                alt={`${person.firstName} ${person.lastName}`}
                className={styles.personImage}
              />
            )}
            <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}