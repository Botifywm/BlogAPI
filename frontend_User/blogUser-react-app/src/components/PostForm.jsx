import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const posting = await fetch("http://localhost:3030/api/createPost", {
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
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form action="POST" onSubmit={handleSubmit} className="postForm">
        <label htmlFor="title">Title: </label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

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

        <label htmlFor="imageUrl">Image Url: </label>
        <input
          id="imageUrl"
          type="text"
          placeholder="image Url here"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <p>Publish Now?</p>
        <div>
          <input
            id="published"
            type="radio"
            name="publishStatus"
            value="true"
            checked={published === true}
            onChange={() => setPublished(true)}
          />
          <label htmlFor="publish">Yes</label>
        </div>
        <div>
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

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default PostForm;
