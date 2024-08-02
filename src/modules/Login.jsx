import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/useUserContext";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'

//Module to generate a login form. The content reacts when the users is logged to display a welcome message and the logout button. 
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const [updateStatus, setUpadteStatus] = useState("");
    const loginURL = "https://gamefeed-back.onrender.com/api/users/login/"

    const sendLogin = async (data) => {
        if (data) {
            const payload = {
                email: data.email,
                password: data.password
            };

            try {
                const response = await axios.post(loginURL, payload);
                const userData = response.data;

                localStorage.setItem("token", userData.token);

                const userResponse = await axios.get(`https://gamefeed-back.onrender.com/api/users/${userData.userId}/`);
                const newUser = userResponse.data;
                setUser(newUser);
                navigate("/");
            } catch (err) {
                setUpadteStatus(err.response.data.estado);
            };
        };
    };

    const logOut = () => {
        localStorage.removeItem("token");
        setUser({});
        navigate("/");
    };

    const logPage = (
        <>
            <form className="login--logForm" onSubmit={handleSubmit((data) => sendLogin(data))}>
                <div className="login--formInputWrap">
                    <input {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} id="userEmail" type="text" placeholder={"email"}></input>
                    {errors.email?.message && <p>{errors.email.message}</p>}
                    <input {...register("password", { required: { value: true, message: "Se debe introducir la contraseña." } })} id="userPass" type="password" placeholder={"contraseña"}></input>
                    {errors.password?.message && <p>{errors.password.message}</p>}
                </div>
                <button type="submit">Iniciar sesion</button>
            </form>
            {updateStatus && <p>{updateStatus}</p>}
        </>
    );

    const logoutPage = (
        <div className="login--logedData">
            <p>Bienvenido {user.name}</p>
            <button onClick={logOut}>Cerrar sesion</button>
        </div>
    );

    return (
        <>
            {user.id ? logoutPage : logPage}
        </>
    );
};

export default Login;