"use client";

import { useEffect, useState } from "react";
import styles from "./AdminTagsPage.module.css";

export default function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState({
    name: "",
    description: "",
    slug: "",
    isGenre: false,
    parentId: null,
  });

  // Fetch tags from the API
  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5221/api/tag");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Handle adding a new tag
  const handleAddTag = async () => {
    try {
      const res = await fetch("http://localhost:5221/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      if (!res.ok) throw new Error("Failed to add tag");

      setNewTag({
        name: "",
        description: "",
        slug: "",
        isGenre: false,
        parentId: null,
      });
      fetchTags(); // Refresh the tag list
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async (id) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`http://localhost:5221/api/tag/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete tag");

      fetchTags(); // Refresh the tag list
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle input change for adding a new tag
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTag((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading tags...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1>Manage Tags</h1>

      <div className={styles.addTagForm}>
        <h2>Add New Tag</h2>
        <input
          type="text"
          name="name"
          value={newTag.name}
          onChange={handleInputChange}
          placeholder="Tag Name"
        />
        <input
          type="text"
          name="description"
          value={newTag.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="slug"
          value={newTag.slug}
          onChange={handleInputChange}
          placeholder="Slug"
        />
        <div className="checkboxWrapper">
            <label className="checkboxLabel">
            <span>Is Genre</span>
            <input
                type="checkbox"
                name="isGenre"
                checked={newTag.isGenre}
                onChange={(e) =>
                    setNewTag((prev) => ({ ...prev, isGenre: e.target.checked }))
                }
                />
                
            </label>
        </div>
        <select
          name="parentId"
          value={newTag.parentId || ""}
          onChange={(e) =>
            setNewTag((prev) => ({ ...prev, parentId: e.target.value || null }))
          }
        >
          <option value="">No Parent</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTag}>Add Tag</button>
      </div>

      <h2>Tags List</h2>
      <ul className={styles.tagList}>
        {tags.map((tag) => (
          <li key={tag.id} className={styles.tagItem}>
            <div>
              <strong>{tag.name}</strong> ({tag.slug})
              <p>{tag.description}</p>
              <p>Genre: {tag.isGenre ? "Yes" : "No"}</p>
              {tag.parent && <p>Parent: {tag.parent.name}</p>}
            </div>
            <button onClick={() => handleDeleteTag(tag.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}