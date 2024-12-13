"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import SearchBar from "./SearchBar"; // Підключаємо SearchBar
import WishlistButton from "./WishlistButton"; // Підключаємо WishlistButton
import styles from "./Header.module.css";
import LoadButton from "./LoadButton";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isUserChecked, setIsUserChecked] = useState(false); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // Для збереження URL аватарки

  useEffect(() => {
    if (user !== undefined && user !== null) { 
      console.log("User Object:", user); // Виводимо весь об'єкт користувача
  
      if (user?.id) { 
        console.log("User ID:", user.id); // Виводимо user.id
        setIsUserChecked(true); 
  
        fetch(`http://localhost:5221/api/user/${user.id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("User Data from API:", data); // Додаємо лог для перевірки даних
            if (data?.avatar?.fileName) {
              console.log("Avatar File Name:", data.avatar.fileName); // Виводимо ім'я файлу аватарки
              setProfileImage(`http://localhost:5221/avatars/${data.avatar.fileName}`);
            } else {
              console.warn("Avatar not found. Using default avatar.");
              setProfileImage(`http://localhost:5221/avatars/avatar.webp`);
            }
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
            setProfileImage(`http://localhost:5221/avatars/avatar.webp`);
          });
      } else {
        console.warn("User ID is not defined.");
        setProfileImage(`http://localhost:5221/avatars/avatar.webp`);
      }
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
    setUser(null); 
    router.push("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  if (!isUserChecked) return null;

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
            <li><Link href="/tv">TV Shows</Link></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <SearchBar />
          <WishlistButton /> 
          <LoadButton />
        
          <button
            onClick={toggleDropdown}
            className={styles.authButton}
          >
             {user ? (
              <img
                src={profileImage ? profileImage : "/img/avatar.webp"}
                alt="Profile"
                className={styles.avatar}
              />
            ) : (
              <img
                src="/img/avatar.webp"
                alt="Login"
                className={styles.avatar}
              />
            )}
          </button>

          {isDropdownVisible && (
            <div className={styles.dropdownMenu}>
              {user ? (
                <>
                  <button
                    onClick={() => router.push("/profile")}
                    className={styles.dropdownItem}
                  >
                     <img
                  src="/img/settings-02.png"
                  alt="Settings"
                  className={styles.icon}
                />
                    Settings
                  </button>
                  <hr className={styles.separator} />
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                     <img
                      src="/img/door-01.png"
                      alt="Exit"
                      className={styles.icon}
                    />
                    Exit
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className={styles.dropdownItem}
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}