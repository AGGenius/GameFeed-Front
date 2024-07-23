import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUser} = useUserContext();
    const loginURL = "http://localhost:3000/api/users/login/"

    const sendLogin = async () => {
        if(email && password) {
            const payload = {
                email,
                password
            }
            
            const response = await axios.post(loginURL, payload);
            const data = response.data;
            localStorage.setItem("token", data.token);

            console.log(data)
            const userResponse = await axios.get(`http://localhost:3000/api/users/${data.userId}/`);
            const user = userResponse.data;
            setUser(user);
        }  
    }

    return (
        <>
            <label htmlFor="userEmail">Email</label>
            <input id="userEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <label htmlFor="userPass">Contraseña</label>
            <input id="userPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={sendLogin}>Logear</button>
            <Link to="/register">Registrarse</Link>
        </>)
}

export default Login;