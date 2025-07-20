// import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar";
import LoginForm from "./components/LoginPage";
import PostForm from "./components/PostForm";
import Home from "./components/Home";
import Post from "./components/Post";
import UpdatePost from "./components/UpdatePost";

function App() {
  const { page, id } = useParams();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  return (
    <>
      <NavBar currentUser={user} />
      {page === "home" && <Home />}
      {page === "login" && <LoginForm />}
      {page === "postForm" && <PostForm />}
      {page === "post" && id && <Post postId={id} />}
      {page === "updatePost" && id && <UpdatePost postId={id} />}

      {!page && <LoginForm />}
    </>
  );

  // if (page === "home") return <Home />;
  // if (page === "login") return <LoginForm />;
  // if (page === "postForm") return <PostForm />;
  // if (page === "post" && id) return <Post postId={id} />;
  // if (page === "updatePost" && id) return <UpdatePost postId={id} />;

  // return <LoginForm />;
}

export default App;
