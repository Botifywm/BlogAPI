// import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navigate";
import LoginForm from "./components/LoginPage";
import RegisterForm from "./components/RegisterPage";
import Home from "./components/Home";
import Post from "./components/Post";
import PostPublic from "./components/PostPublic";

function App() {
  const { page, id } = useParams();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  return (
    <>
      <NavBar currentUser={user} />
      {page === "home" && <Home currentUser={user} />}
      {page === "login" && <LoginForm />}
      {page === "register" && <RegisterForm />}
      {page === "post" && id && <Post postId={id} />}
      {page === "postPublic" && id && <PostPublic postId={id} />}

      {!page && <LoginForm />}
    </>
  );
}

export default App;
