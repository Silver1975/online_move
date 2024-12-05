import { useState, useEffect } from "react";
import ActorsSlider from "./ActorsSlider";
import EpisodesSlider from "./EpisodesSlider";
import RelatedMoviesSlider from "./RelatedMoviesSlider";
import styles from "./Tabs.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function Tabs({ movie }) {
  const [activeTab, setActiveTab] = useState("details");
  const [seasons, setSeasons] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Завантаження сезонів для movie.id
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/season/${movie.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch seasons");
        }
        const data = await response.json();
        setSeasons(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeasons();
  }, [movie.id]);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchComments();
    }
  }, [activeTab]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5221/api/Comment?episodeId=${movie.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        <button
          className={`${styles.tabItem} ${activeTab === "details" ? styles.active : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "episodes" ? styles.active : ""}`}
          onClick={() => setActiveTab("episodes")}
        >
          Episodes
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "cast" ? styles.active : ""}`}
          onClick={() => setActiveTab("cast")}
        >
          Cast
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "related" ? styles.active : ""}`}
          onClick={() => setActiveTab("related")}
        >
          Related
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "reviews" ? styles.active : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "details" && (
          <div className={styles.detail}>
            <h3>Description</h3>
            <p>{movie.description}</p>
            <h3>Genres</h3>
            <p>{movie.tags.join(", ")}</p>
            <h3>Watch offline</h3>
            <p>Download and watch everywhere you go.</p>
          </div>
        )}
        {activeTab === "episodes" && (
          <div>
            <h3 className={styles.title}>Episodes</h3>
            {seasons.length > 0 ? (
              seasons.map((season) => (
                <div key={season.id} className={styles.seasonBlock}>
                  <h4 style={{color:"#fff"}}>{season.name || `Season ${season.number}`}</h4>
                  <EpisodesSlider seasonId={season.id} />
                </div>
              ))
            ) : (
              <p>No seasons available.</p>
            )}
          </div>
        )}
        {activeTab === "cast" && (
          <div>
            <h3 className={styles.title}>Cast</h3>
            <ActorsSlider movieId={movie.id} />
          </div>
        )}
        {activeTab === "related" && (
          <div>
            <h3 className={styles.title}>Related Movies</h3>
            <RelatedMoviesSlider movieId={movie.id} tags={movie.tags} />
          </div>
        )}
          {activeTab === "reviews" && (
          <div>
            <h3 className={styles.title}>Reviews</h3>
            {/* Вивести огляди */}
            
            {/*{loading ? (
           //   <p>Loading...</p>
           // ) : error ? (
           //   <p>Error: {error}</p>
           // ) : comments.length > 0 ? (   */}
              <CommentList comments={comments} episodeId={movie.id} />
           {/*// ) : (
           //   <p>No reviews yet.</p>
           // )}  */}
          </div>
          
        )}
      </div>
    </div>
  );
}

function Comment({ reply }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Повний шлях до аватара
  const avatarUrl = reply.avatar
    ? `http://localhost:5221/avatars/${reply.avatar}`
    : "../img/vector-ava.svg";

  return (
    <div className={styles.comment}>
      <img
        src={avatarUrl}
        alt="Commenter Avatar"
        className={styles.commentAvatar}
      />
          <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{reply.login}</span>
          <span className={styles.commentDate}>{formatDate(reply.createAt)}</span>
          <button className={styles.respondButton}>Respond</button>
        </div>
        <p className={styles.commentText}>{reply.text}</p>
      </div>
    </div>
  );
}

function CommentList({ comments, episodeId }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);

  const handleCommentSubmit = async (e) => {
      e.preventDefault();
    
      if (!commentText.trim()) {
        setError("Comment cannot be empty.");
        return;
      }
    
      if (!user) {
        setError("User is not authenticated.");
        return;
      }
    
      setError(null);
    
      const params = new URLSearchParams({
        episodeId: episodeId,
        text: commentText,
        //parentId: 0, // Замініть на потрібний ParentId, якщо є
      });
    
      try {
        const response = await fetch(`http://localhost:5221/api/Comment?${params.toString()}`, {
          method: "POST",
          credentials: "include", // Вказуємо, що потрібно передати куки
        });
    
        if (!response.ok) {
          throw new Error("Failed to add comment.");
        }
    
        setCommentText("");
      } catch (err) {
        setError(err.message);
      }
    };

  return (
    <div>
      {user ? (

        <form onSubmit={handleCommentSubmit} style={{display:"flex", alignItems: "center", gap: "16", marginBottom: "20px", width: "50%", marginLeft: "auto",marginRight: "auto" }}>
          <img src="../img/vector-ava.svg" alt="User Avatar" style={{width: "47px", height: "47px"}} />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add your comment..."
            rows="3"
            style={{ width: "100%", margin: "10px", marginTop: "10px", height: "47px",
                backgroundColor: "#505050a3", color: "#fff", border: "none", borderRadius:"4px"
            }}
          />
          <button type="submit" style={{ padding: "12px 36px", height: "47px", color: "#fff", backgroundColor: "#ff7043",
            border: "none", borderRadius: "4px"
           }}>
            Add
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      ) : (
        <p style={{ color: "gray" }}>You need to log in to add comments.</p>
      )}

      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment reply={comment} />
          {comment.replies?.length > 0 && (
            <div style={{ marginLeft: "20px" }}>
              {comment.replies.map((reply) => (
                <Comment key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}