"use client";

import { useRouter } from "next/navigation"; // Імпортуємо useRouter
import styles from './WishlistButton.module.css'; // Підключаємо стилі

export default function WishlistButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/favorites"); // Переходимо на сторінку /favorites
  };

  return (
    <button 
      className={styles.wishlistButton} 
      onClick={handleClick} // Додаємо обробник кліку
    > </button>
  );
}