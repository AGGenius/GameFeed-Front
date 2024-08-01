import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"
import './Nav.css'

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

  return (
    <nav className={"nav"}>
      <h1 className={"nav--webTittle"}>Gamer Rest</h1>
      <div className={"nav--navWrap"}>
        <div className={"nav--linkWrap"}>
          <Link to="/">Listado de juegos</Link>
          {token && <Link to="/addGame">Añadir juego</Link>}
          {token && <Link to="/profile">Perfil</Link>}
          {user.type === "mod" && <Link to="/modPage" >Modo moderador</Link>}
          {user.type === "admin" && <Link to="/adminPage" >Modo administrador</Link>}
          {!token && <Link to="/register" >Registrarse</Link>}
        </div>
        <div className={"nav--logModule"}>
          <Login />
        </div>
      </div>
    </nav>
  )
}

export default Nav