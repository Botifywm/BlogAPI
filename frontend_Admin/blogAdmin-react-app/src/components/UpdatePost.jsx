import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UpdatePost({ postId }) {
  const location = useLocation();
  const { titlePrev, contentPrev, imageUrlPrev, publishedPrev } =
    location.state || {};
  const [title, setTitle] = useState(titlePrev);
  const [content, setContent] = useState(contentPrev);
  const [imageUrl, setImageUrl] = useState(imageUrlPrev);
  const [published, setPublished] = useState(publishedPrev);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const resUpdate = await fetch(
        `http://localhost:3030/api/updatePost/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, content, imageUrl, published }),
        }
      );

      if (!resUpdate.ok) {
        const errorText = await resUpdate.text();
        setError(errorText || "Failed to update post.");
        return;
      }
      navigate(`/post/${postId}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }
  }

  return (
    <>
      <div className="updatePostHeader">
        <p>Update Post..</p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form action="POST" onSubmit={handleSubmit} className="postForm">
        <div className="newPostTitle">
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            type="text"
            placeholder="Title"
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
            placeholder="image Url here"
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
          <label htmlFor="published">True</label>

          <input
            id="notPublished"
            type="radio"
            name="publishStatus"
            value="false"
            checked={published === false}
            onChange={() => setPublished(false)}
          />
          <label htmlFor="notPublished">False</label>
        </div>

        <button className="postSubmitBtn" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default UpdatePost;
