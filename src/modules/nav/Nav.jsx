import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"
import './Nav.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Nav() {
  const { user, setUser } = useUserContext();
  const [token, setToken] = useState("");
  const [colapseMenu, setColapseMenu] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      setToken(token);

      const userId = jwtDecode(token).id;

      const getUserData = async () => {
        const userResponse = await axios.get(`https://gamefeed-back.onrender.com/api/users/${userId}/`);
        const newUser = userResponse.data;
        setUser(newUser);
      };

      getUserData();
    }
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [user]);

  const responsiveMenu = (e) => {
    return (
      <ul className="nav--colapsedMenuWrap">
        <p>MENU</p>
        {token && <li><Link to="/addGame" onClick={() => setColapseMenu(false)}>Añadir juego</Link></li>}
        {token && <li><Link to="/profile" onClick={() => setColapseMenu(false)}>Perfil</Link></li>}
        {user.type === "mod" && <li><Link to="/modPage" onClick={() => setColapseMenu(false)}>Modo moderador</Link></li>}
        {user.type === "admin" && <li><Link to="/adminPage" onClick={() => setColapseMenu(false)}>Modo administrador</Link></li>}
        {!token && <li><Link to="/register" onClick={() => setColapseMenu(false)}>Registrarse</Link></li>}
      </ul>
    )
  }

  return (
    <nav className={"nav"}>
      {colapseMenu && <div className="nav--responsiveMenuWrap" onClick={() => setColapseMenu(false)}>{responsiveMenu()}</div>}
      <h1 className={"nav--webTittle"}>Gamer Rest</h1>
      <div className={"nav--navWrap"}>
        <ul className={"nav--linkWrap"}>
          <li><Link to="/">Home</Link></li>
          {token && <li><Link to="/addGame" onClick={() => setColapseMenu(false)}>Añadir juego</Link></li>}
          {token && <li><Link to="/profile" onClick={() => setColapseMenu(false)}>Perfil</Link></li>}
          {user.type === "mod" && <li><Link to="/modPage" onClick={() => setColapseMenu(false)}>Modo moderador</Link></li>}
          {user.type === "admin" && <li><Link to="/adminPage" onClick={() => setColapseMenu(false)}>Modo administrador</Link></li>}
          {!token && <li><Link to="/register" onClick={() => setColapseMenu(false)}>Registrarse</Link></li>}
          <li className="nav--colapsedMenuButton"><button onClick={() => { setColapseMenu(!colapseMenu) }}>
            <div></div>
            <div></div>
            <div></div>
          </button></li>
        </ul>
        <div className={"nav--logModule"}>
          <Login />
        </div>
      </div>
    </nav>
  );
};

export default Nav