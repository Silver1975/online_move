"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import styles from "./AuthForm.module.css";

export default function AuthForm({ isLogin = false }) {
  const { fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    email: "",
    birthday: "",
    gender: "1",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes(".AspNetCore.Application.Id");
    if (token) {
      router.push("/profile");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:5221/api/auth/login"
      : "http://localhost:5221/api/auth/register";
    const body = isLogin
      ? { login: formData.login, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Помилка при виконанні запиту");
      }

      await fetchUser(); // Оновлюємо дані користувача після успішного входу

      router.push("/profile");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h1 className={styles.title}>{isLogin ? "Вхід" : "Реєстрація"}</h1>

      <input
        type="text"
        name="login"
        placeholder="Логін"
        value={formData.login}
        onChange={handleChange}
        required
        className={styles.inputField}
      />

      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        required
        className={styles.inputField}
      />

      {!isLogin && (
        <>
          <input
            type="email"
            name="email"
            placeholder="Електронна пошта"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />

          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            className={styles.inputField}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="1">Чоловік</option>
            <option value="2">Жінка</option>
            <option value="3">Інше</option>
            <option value="4">Не вказано</option>
          </select>
        </>
      )}

      {isLogin && (
        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Запам'ятати мене</label>
        </div>
      )}

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <button type="submit" className={styles.submitButton}>
        {isLogin ? "Увійти" : "Зареєструватися"}
      </button>
    </form>
  );
}