import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [postList, setPostList] = useState([]);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/getAllPosts`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setPostList(data);
        console.log(data);
      } catch (err) {
        console.log(err);
        setError("Unsuccessful fetching of posts");
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="headerBlog">
        <p>Explore Blog Posts.</p>
      </div>
      {error && <p className="errorMsg">{error}</p>}

      <div className="blogCardsContainer">
        {postList.map((post) => (
          <div className="blogCard">
            <div className="imgContainer">
              <img
                className="postImg"
                src={`${post.imageUrl}/400/300`}
                alt=""
              />
            </div>
            <Link
              className="blogCardTitle"
              to={`/post/${post.id}`}
              key={post.id}
            >
              <h3>{post.title}</h3>
            </Link>
            <p>
              {post.content.length > 100
                ? post.content.slice(0, 100) + "..."
                : post.content}
            </p>
            <small>
              Published: {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
