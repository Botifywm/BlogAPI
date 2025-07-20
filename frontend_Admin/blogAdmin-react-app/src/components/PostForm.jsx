import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const posting = await fetch(`${API_BASE}/api/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, imageUrl, published }),
      });
      const data = await posting.json();

      if (!posting.ok) {
        setError(data.error || "Failed to create post.");
      }
      navigate("/home");
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }
  }

  return (
    <div>
      <div className="newPostHeader">
        <p>New Post..</p>
      </div>
      {error && <p className="errorMsg">{error}</p>}
      <form action="POST" onSubmit={handleSubmit} className="postForm">
        <div className="newPostTitle">
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="newPostContent">
          <label htmlFor="content">Body: </label>
          <textarea
            id="content"
            rows="15"
            cols="70"
            type="text"
            placeholder="Start Writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="newPostImage">
          <label htmlFor="imageUrl">Image Url: </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        <div className="publishNow">
          <p className="publishHeader">Publish Now: </p>
          <input
            id="published"
            type="radio"
            name="publishStatus"
            value="true"
            checked={published === true}
            onChange={() => setPublished(true)}
          />
          <label htmlFor="publish">Yes</label>

          <input
            id="notPublished"
            type="radio"
            name="publishStatus"
            value={false}
            checked={published === false}
            onChange={() => setPublished(false)}
          />
          <label htmlFor="notPublished">No</label>
        </div>

        <button className="postSubmitBtn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostForm;
