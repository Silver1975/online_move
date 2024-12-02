"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import SearchBar from "./SearchBar"; // Підключаємо SearchBar
import WishlistButton from "./WishlistButton"; // Підключаємо WishlistButton
import styles from "./Header.module.css";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isUserChecked, setIsUserChecked] = useState(false); // Слідкуємо за станом ініціалізації користувача

  useEffect(() => {
    if (user !== undefined) {
      setIsUserChecked(true); // Ініціалізація завершена
    }
  }, [user]);

  const handleLoginClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5221/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null); // Очищаємо стан користувача після виходу
    router.push("/login");
  };

  if (!isUserChecked) return null; // Показуємо порожній компонент, поки не завершиться ініціалізація

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Logo</Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li><Link href="/serials">Serials</Link></li>
            <li><Link href="/movies">Movies</Link></li>
            <li><Link href="/drams">Drams</Link></li>
            <li><Link href="/cartoons">Cartoons</Link></li>
              
            
          </ul>
        </nav>

        <div className={styles.actions}>
          <SearchBar />
          <WishlistButton /> {/* Додаємо кнопку списку бажань */}
        
        
          <button onClick={handleLoginClick} className={styles.authButton}>
          
        </button>
        {user && (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Exit 
          </button>
          
        )}
       
        </div>
      </div>
      
    </header>
  );
}