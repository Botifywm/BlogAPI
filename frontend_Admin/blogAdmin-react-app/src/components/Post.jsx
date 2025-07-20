import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

function Post({ postId }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3030/api/getPost/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("data_admin: ", res);
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

  async function deletePost(postId) {
    try {
      const res = await fetch(
        `http://localhost:3030/api/deletePost/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        setError("Post failed to delete");
      }
      await fetchPost();
    } catch (err) {
      console.log(err);
      setError("Something went wrong when deleting.");
    }
  }

  function updatePostRedirect(
    postId,
    titlePrev,
    contentPrev,
    imageUrlPrev,
    publishedPrev
  ) {
    navigate(`/updatePost/${postId}`, {
      state: {
        titlePrev: titlePrev,
        contentPrev: contentPrev,
        imageUrlPrev: imageUrlPrev,
        publishedPrev: publishedPrev,
      },
    });
  }

  async function handleDelete(commentId) {
    try {
      const res = await fetch(
        `http://localhost:3030/api/deleteComment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError("Failed to delete Comment");
      }
      console.log("deleteComments: ", data);
      await fetchPost();
    } catch (err) {
      console.log(err);
      setError("Something went wrong for deleting Comment");
    }
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="post">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="postContainer">
        <p className="postTitle">{post.title}</p>

        <img className="postImg" src={`${post.imageUrl}/400/300`} alt="" />

        <div className="postContent">{post.content}</div>
        <div className="postDetails">
          <p>Written by: {post.author.username}</p>
          <p>Written on: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="commentContainer">
        <p className="commentHeader">Comments</p>
        {post.comments.map((comment) => {
          return (
            <div key={comment.id} className="commentContent">
              {comment.id && <p>{comment.content}</p>}
              <p className="commentUser">{comment.user.username}</p>
              <div>
                <button
                  className="deleteComment"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="editPostContainer">
        <button className="editBtns" onClick={() => deletePost(post.id)}>
          Delete Post
        </button>
        <button
          className="editBtns"
          onClick={() =>
            updatePostRedirect(
              post.id,
              post.title,
              post.content,
              post.imageUrl,
              post.published
            )
          }
        >
          Update Post
        </button>
      </div>
      <div className="footer">
        <p className="creator">Made by Zeo / Wei Ming</p>
      </div>
    </div>
  );
}

export default Post;
