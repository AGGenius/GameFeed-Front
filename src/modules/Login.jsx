import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/useUserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const [updateStatus, setUpadteStatus] = useState("");
    const loginURL = "http://localhost:3000/api/users/login/"

    const sendLogin = async (data) => {
        if (data) {
            const payload = {
                email: data.email,
                password: data.password
            }

            try {
                const response = await axios.post(loginURL, payload);
                const userData = response.data;

                localStorage.setItem("token", userData.token);

                const userResponse = await axios.get(`http://localhost:3000/api/users/${userData.userId}/`);
                const newUser = userResponse.data;
                setUser(newUser);
                navigate("/");
            } catch (err) {
                setUpadteStatus(err.response.data.estado);
            }
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        setUser({});
        navigate("/");
    }

    const modUser = (
        <>
            <Link to="/modPage" >Modo moderador</Link>
        </>
    )

    const admin = (
        <>
            <Link to="/adminPage" >Modo administrador</Link>
        </>
    )

    const logPage = (
        <div className="login--logFormWrap">
            <form className="login--logForm" onSubmit={handleSubmit((data) => sendLogin(data))}>
                <label htmlFor="userEmail">Email</label>
                <input {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} id="userEmail" type="text"></input>
                <label htmlFor="userPass">Contraseña</label>
                {errors.email?.message && <p>{errors.email.message}</p>}
                <input {...register("password", { required: { value: true, message: "Se debe introducir la contraseña." } })} id="userPass" type="password"></input>
                {errors.password?.message && <p>{errors.password.message}</p>}
                <button type="submit">Iniciar sesion</button>
            </form>
            <Link to="/register" className="login--registerLink">Registrarse</Link>
            {updateStatus && <p>{updateStatus}</p>}
        </div>)

    const logoutPage = (
        <div className="login--loged">
            <div className="login--linksWrap">
                <Link to="/profile">Perfil</Link>
                {user.type === "mod" && modUser}
                {user.type === "admin" && admin}
            </div>
            <div className="login--logedData">
                <p>Bienvenido {user.name}</p>
                <button onClick={logOut}>Cerrar sesion</button>
            </div>
        </div>
    )

    return (
        <>
            {user.id ? logoutPage : logPage}
        </>)
}

export default Login;