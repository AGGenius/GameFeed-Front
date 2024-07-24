import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/useUserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const loginURL = "http://localhost:3000/api/users/login/"


    

    useEffect(() => {

    }, [user])

    const sendLogin = async (e) => {
        e.preventDefault();

        if (email && password) {
            const payload = {
                email,
                password
            }

            const response = await axios.post(loginURL, payload);
            const data = response.data;
            localStorage.setItem("token", data.token);

            const userResponse = await axios.get(`http://localhost:3000/api/users/${data.userId}/`);
            const newUser = userResponse.data;
            setUser(newUser);
            navigate("/");
        }
    }

    const logOut =  () => {
        localStorage.removeItem("token");
        setUser({});
    }

    const logPage = (
        <>
            <form onSubmit={sendLogin}>
                <label htmlFor="userEmail">Email</label>
                <input id="userEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="userPass">Contraseña</label>
                <input id="userPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Iniciar sesion</button>
                <Link to="/register">Register</Link>
            </form>
        </>)

    const logoutPage = (
        <>
            <p>Bienvenido {user.name}</p>
            <button onClick={logOut}>Cerrar sesion</button>
        </>
    )

    const baseUser = (
        <>
            <Link  to="/addGame">Añadir Juego</Link>
            <Link  to="/profile">Perfil</Link>
        </>
    )

    //WIP
    const admin = (
        <>
            <Link  to="/addGame">Añadir Juego</Link>
            <Link  to="/profile">Perfil</Link>
        </>
    )

    //WIP
    const adminUser = (
        <>
            <Link  to="/addGame">Añadir Juego</Link>
            <Link  to="/profile">Perfil</Link>
        </>
    )

    return (
        <>
            {localStorage.getItem("token") ? logoutPage : logPage}
            {baseUser}
        </>)
}

export default Login;