"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminRoute({ children }) {
  const { user, fetchUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Стан завантаження

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user) {
          await fetchUser(); // Завантажуємо користувача
        }
        if (user && user.role !== "Admin") {
          router.push("/login"); // Перенаправляємо, якщо роль не "Admin"
        }
      } catch (error) {
        console.error("Помилка перевірки авторизації:", error);
        router.push("/login"); // У разі помилки перенаправляємо на вхід
      } finally {
        setLoading(false); // Завершуємо завантаження
      }
    };

    checkUser();
  }, [user, fetchUser, router]);

  if (loading) {
    return <p>Loading...</p>; // Показуємо текст "Loading..." під час перевірки
  }

  if (!user || user.role !== "Admin") {
    return  <p
    style={{
      fontSize: "48px",
      color: "#fff", // Білий текст
      textAlign: "center",
    }}
  >
    You do not have access. Redirect to login page...
  </p>;
  }

  return <>{children}</>;
}