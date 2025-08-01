import { useState, useEffect } from "react";

function PostPublic({ postId }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  // Get Post API
  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/getPostPublic/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError("Failed to fetch post");
      }
      console.log("fetchPOst", data);
      setPost(data);
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="post">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="postContainer">
        <p className="postTitle">{post.title}</p>
        <div className="imgContainer">
          <img className="postImg" src={`${post.imageUrl}/400/300`} alt="" />
        </div>
        <div className="postContent">{post.content}</div>
        <div className="postDetails">
          <p>Written by: {post.author.username}</p>
          <p>Written on: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="commentContainer">
        <p className="commentHeader">Comments ({post.comments.length})</p>
        {post.comments.map((comment) => {
          return (
            <div key={comment.id} className="commentContent">
              <p>{comment.content}</p>
              <p className="commentUser">{comment.user.username}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostPublic;
