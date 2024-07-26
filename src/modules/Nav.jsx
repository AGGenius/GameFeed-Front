import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"

function Nav() {
  const { user, setUser } = useUserContext();

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

  const modUser = (
    <>
      <Link to="/"><p>Modo moderador</p></Link>
    </>
  )

  const admin = (
    <>
      <Link to="/adminPage"><p>Modo administrador</p></Link>
    </>
  )

  

  return (
    <>
      <nav>
        <h1>Game Rest</h1>
        <Link to="/">Home</Link>
        <div>
          <Login />
          {user.type === "mod" && modUser}
          {user.type === "admin" && admin}
        </div>
      </nav>
    </>
  )
}

export default Nav