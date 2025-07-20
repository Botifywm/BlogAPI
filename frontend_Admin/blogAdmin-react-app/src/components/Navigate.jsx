import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBar({ currentUser }) {
  const [dropDown, setDropDown] = useState(false);

  function toggleDropdown() {
    if (dropDown) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  }
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    console.log("Logging out...");
  };

  return (
    <div className="navBar">
      <div className="userLinks">
        {currentUser && (
          <Link to={"/home"} className="navLink">
            Home
          </Link>
        )}
        <a href="https://blog-api-public.vercel.app/" className="navLink">
          Public Blog
        </a>
        {currentUser && (
          <Link className="navLink" to={"/postForm"}>
            Create New
          </Link>
        )}
      </div>

      <div className="navigate">
        {currentUser && (
          <div onClick={toggleDropdown} className="userDropdown">
            <p>
              Welcome, {currentUser.username}!{" "}
              <span className="dropdownArrow">▼</span>
            </p>

            <div>
              {dropDown && (
                <div className="dropdownMenu">
                  <button onClick={handleLogout} className="logoutBtn">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
