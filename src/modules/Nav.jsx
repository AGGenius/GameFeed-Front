import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"

function Nav() {
  const { setUser } = useUserContext();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");

      const userId = jwtDecode(token).id;

      const getUserData = async () => {
        const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}/`);
        const newUser = userResponse.data;
        setUser(newUser);
      };

      getUserData();
    }
  }, [])

  return (
    <>
      <nav>
        <h1>Game Rest</h1>
        <Link to="/">Home</Link>
        <div>
          <Login />
        </div>
      </nav>
    </>
  )
}

export default Nav