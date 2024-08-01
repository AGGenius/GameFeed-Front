import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"

function Nav() {
  const { user, setUser } = useUserContext();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      setToken(token);

      const userId = jwtDecode(token).id;

      const getUserData = async () => {
        const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}/`);
        const newUser = userResponse.data;
        setUser(newUser);
      };

      getUserData();
    }
  }, [])
  
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [user]);

  const generateCreateButton = () => {
    if (token) {
        return (
            <>
              <Link className={"nav--homeLink"} to="/addGame">Añadir juego</Link>
            </>)
    }
}
  return (
    <nav className={"nav"}>
      <h1 className={"nav--webTittle"}>Gamer Rest</h1>
      <div className={"nav--navWrap"}>
        <div className={"nav--linkWrap"}>
          <Link className={"nav--homeLink"} to="/">Listado de juegos</Link>
          {generateCreateButton()}
        </div>
        <div className={"nav--logModule"}>
          <Login />
        </div>
      </div>
    </nav>
  )
}

export default Nav