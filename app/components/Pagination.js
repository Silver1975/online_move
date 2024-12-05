import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Функція для генерації сторінок
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Додаємо перші сторінки або більше, залежно від поточної сторінки
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Масив сторінок для відображення
  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      {/* Кнопка переходу на першу сторінку */}
      <button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ""} ${styles.firstLastButton}`}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        &laquo; First
      </button>

      {/* Кнопка переходу на попередню сторінку */}
      <button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Відображення номерів сторінок */}
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <span key={index} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={index}
            className={`${styles.pageButton} ${number === currentPage ? styles.active : ""}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        )
      )}

      {/* Кнопка переходу на наступну сторінку */}
      <button
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

      {/* Кнопка переходу на останню сторінку */}
      <button
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ""} ${styles.firstLastButton}`}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Lost &raquo;
      </button>
    </div>
  );
};

export default Pagination;