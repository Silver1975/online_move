"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5221/api/auth/me", {
        credentials: "include",
      });
      console.log("Response status:", response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUser(data);
      } else {
        console.log("Error response from API:", await response.text());
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log("User in AuthContext:", user);
    fetchUser();
  }, []);

  const logout = async () => {
    // Виконання запиту до сервера для видалення куки
    await fetch("http://localhost:5221/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });
    // Очищення стану користувача в контексті
    setUser(null);
    router.push("/login");
};
  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser,logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);