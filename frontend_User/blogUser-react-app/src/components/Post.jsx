import { useState, useEffect } from "react";

function Post({ postId }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);

  // Get Post API
  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3030/api/getPost/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //using authentication just to get the who is in the current session so that
          //we can dynamically show the edit/delete options on the comment for the current user
          authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // Create Comment API
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3030/api/createComment/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: comment }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError("Failed to create Comment");
      }
      console.log("comments: ", data);
      await fetchPost();
      setComment("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong for Comment");
    }
  }

  // Update Comment API
  async function handleEdit(e, commentId) {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3030/api/updateComment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: editComment }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError("Failed to update Comment");
      }
      console.log("updateComments: ", data);
      setEditCommentId(null);
      await fetchPost();
    } catch (err) {
      console.log(err);
      setError("Something went wrong for updating Comment");
    }
  }

  function showEdit(commentId, content) {
    setEditComment(content);
    if (editCommentId === null) {
      setEditCommentId(commentId);
    } else {
      setEditCommentId(null);
      setEditCommentId(commentId);
    }
  }

  // Delete Comment API
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
        <p className="commentHeader">Comments ({post.comments.length})</p>
        {post.comments.map((comment) => {
          return (
            <div key={comment.id} className="commentContent">
              {comment.id !== editCommentId && <p>{comment.content}</p>}
              <p className="commentUser">{comment.user.username}</p>
              {post.currentUserId === comment.user.id && (
                <div>
                  {editCommentId === comment.id && (
                    <form
                      action="PUT"
                      onSubmit={(e) => handleEdit(e, comment.id)}
                      id="editComment"
                      className="editCommentContainer"
                    >
                      <textarea
                        id="editCommentText"
                        rows="2"
                        columns="35"
                        value={editComment}
                        type="text"
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <div className="commentModifyBtns">
                        <button className="updateCommentBtn" type="submit">
                          Update
                        </button>
                        <span className="spanSeparator">|</span>
                        <button
                          className="cancelUpdateBtn"
                          onClick={() => setEditCommentId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {editCommentId !== comment.id && (
                    <div className="commentModifyBtns">
                      <button
                        className="editCommentBtn"
                        onClick={() => showEdit(comment.id, comment.content)}
                      >
                        Edit
                      </button>
                      <span className="spanSeparator">|</span>
                      <button
                        className="delCommentBtn"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="commentInputContainer">
        <form
          action="POST"
          onSubmit={handleSubmit}
          className="commentInputForm"
        >
          <textarea
            id="content"
            rows="3"
            type="text"
            placeholder="Write Comments"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div>
            <button className="submitCommentBtn" type="submit">
              Submit Comment
            </button>
          </div>
        </form>
      </div>
      <div className="footer">
        <p className="creator">Made by Zeo / Wei Ming</p>
      </div>
    </div>
  );
}

export default Post;
