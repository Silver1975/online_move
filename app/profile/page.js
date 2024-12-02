"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    login: "",
    name: "",
    email: "",
    description: "",
    birthday: "",
    gender: "Не вказано",
    role: "User",
    avatar: "/avatars/avatar.webp",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const router = useRouter();
  const { user, logout } = useAuth();
  const mapGenderToUkrainian = (gender) => {
    switch (gender) {
      case "Male":
        return "Чоловік";
      case "Female":
        return "Жінка";
      case "Other":
        return "Інше";
      case "NotSpecified":
        return "Не вказано";
      default:
        return "Не визначено";
    }
  };

  const mapGenderToEnglish = (gender) => {
    switch (gender) {
      case "Чоловік":
        return "Male";
      case "Жінка":
        return "Female";
      case "Інше":
        return "Other";
      case "Не вказано":
        return "NotSpecified";
      default:
        return "NotSpecified";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5221/api/user/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Не вдалося завантажити дані профілю");
        }

        const data = await response.json();
        setProfile({
          login: data.login,
          name: data.name,
          email: data.email,
          description: data.description,
          birthday: data.birthday,
          gender: mapGenderToUkrainian(data.gender),
          role: data.role,
          avatar: data.avatar || "/avatars/avatar.webp",
        });
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditProfile({ ...profile });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      // Перевірка на розширення файлу
      const validExtensions = ["image/jpeg", "image/png"];
      if (!validExtensions.includes(file.type)) {
        console.error("Непідтримуваний формат файлу");
        return;
      }
  
      // Перевірка на розмір файлу (макс. 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        console.error("Файл перевищує допустимий розмір");
        return;
      }
  
      // Зберігаємо файл у стані
      setEditProfile((prev) => ({
        ...prev,
        avatarFile: file, // Зберігаємо файл для відправки
        avatarFile: file, // Попередній перегляд
      }));
      
    }
  };

const handleSave = async () => {
  const formData = new FormData();

  // Додати основні дані профілю
  formData.append("login", editProfile.login);
  formData.append("name", editProfile.name);
  formData.append("email", editProfile.email);
  formData.append("description", editProfile.description || "");
  formData.append("birthday", editProfile.birthday);
  formData.append("gender", mapGenderToEnglish(editProfile.gender));
  formData.append("role", editProfile.role || "User");

  // Якщо аватар оновлюється
  if (editProfile.avatarFile) {
    formData.append("avatar", editProfile.avatarFile);
  }

  try {
    const response = await fetch("http://localhost:5221/api/user", {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorMessage = await response.text(); // Отримуємо текст помилки
      console.error("Server error:", errorMessage);
      throw new Error(errorMessage);
    }
    
    // Перевіряємо, чи є відповідь JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Profile updated successfully:", data);
      // Оновлюємо стан профілю
      setProfile({
        ...editProfile,
        avatar: data.avatar || editProfile.avatar,
        gender: mapGenderToUkrainian(editProfile.gender),
      });
    } else {
      console.log("Server returned no JSON response.");
    }
    window.location.reload(); 
    // Завершуємо редагування
    setIsEditing(false);
   
  } catch (error) {
    console.error("Помилка збереження профілю:", error);
  }
};
  const handleLogout = async () => {
    await logout(); // Використовуємо logout з контексту для оновлення стану глобально
    
  };
  return (
    <div className={styles.profilePage}>
      <h1>Профіль користувача</h1>
      <div className={styles.profileContainer}>
        <img
          src={`http://localhost:5221/avatars/${profile?.avatar?.fileName}`}
          alt="Аватар користувача"
          className={styles.avatar}
        />
        <div className={styles.info}>
          {isEditing ? (
            <>
              
              <input
                type="text"
                name="name"
                value={editProfile.name}
                onChange={handleChange}
                placeholder="Повне ім'я"
                className={styles.input}
              />
              
              <input
                type="email"
                name="email"
                value={editProfile.email}
                onChange={handleChange}
                placeholder="Email"
                className={styles.input}
              />
              <textarea
                name="description"
                value={editProfile.description}
                onChange={handleChange}
                placeholder="Опис профілю"
                className={styles.input}
              />
              <select
                name="gender"
                value={editProfile.gender}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="Чоловік">Чоловік</option>
                <option value="Жінка">Жінка</option>
                <option value="Інше">Інше</option>
                <option value="Не вказано">Не вказано</option>
              </select>

              <label htmlFor="avatarUpload">Завантажити новий аватар:</label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarUpload}
                />

              <button onClick={handleSave} className={styles.saveButton}>
                Зберегти
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                Відмінити
              </button>
            </>
          ) : (
            <>
              <p><strong>Ім'я користувача:</strong> {profile.login}</p>
              <p><strong>Повне ім'я:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Опис:</strong> {profile.description}</p>
              <p><strong>Стать:</strong> {profile.gender}</p>
              
              <button onClick={handleEditClick} className={styles.editButton}>
                Редагувати профіль
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>

            Вийти
          </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}