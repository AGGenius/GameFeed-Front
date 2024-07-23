import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [registerState, setRegisterState] = useState("");
    const navigate = useNavigate();
    const registerURL = "http://localhost:3000/api/users/register/";

    useEffect (() => {
        if(localStorage.getItem("token")) {
            navigate("/");
        }
    }, [])

    const register = async (e) => {
        e.preventDefault();

        if (email && password && nick && name) {
            const payload = {
                email,
                password,
                name,
                nick
            }

            const response = await axios.post(registerURL, payload);
            const registerStatus = response.data.estado;
            console.log(registerStatus)
            setRegisterState(registerStatus);
        }
    }

    return (
        <>
            {!registerState ?
                <form onSubmit={register}>
                    <label htmlFor="newuserEmail">Email</label>
                    <input id="newuserEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <label htmlFor="newuserPass">Contraseña</label>
                    <input id="newuserPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <label htmlFor="newuserName">Name</label>
                    <input id="newuserName" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <label htmlFor="newuserNick">Nick</label>
                    <input id="newuserNick" type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                    <button type="submit">Registrarse</button>
                </form>
                :
                <p>{registerState}</p>}

        </>)

}

export default Register;