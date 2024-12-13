import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
  <div className={styles.container}>
    <div className={styles.footerItems}>
      <div className={styles.footerLinks}>
        <div className={styles.linkColumn}>
          <a href="#">FAQ</a>
          <a href="#">Help Center</a>
        </div>
        <div className={styles.linkColumn}>
          <a href="#">Account</a>
          <a href="#">Terms of Use</a>
        </div>
        <div className={styles.linkColumn}>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
        </div>
        <div className={styles.linkColumn}>
          <a href="#">Contact Us</a>
          <a href="#">Only on Netflix</a>
        </div>
        </div>
<br ></br>
      <div className={styles.socialLinksContainer}>
        <div className={styles.socialLinks}>
          <a href="https://www.youtube.com" target="_blank">
            <img src="/img/youtube.png" alt="Youtube" />
          </a>
          <a href="https://www.instagram.com" target="_blank">
            <img src="/img/instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.twitter.com" target="_blank">
            <img src="/img/twitter.png" alt="Twitter" />
          </a>
        </div> 
      </div>
      
    </div>
  </div>
</footer>
     
    
  );
}