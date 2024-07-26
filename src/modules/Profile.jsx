import { useEffect } from "react";
import { useUserContext } from "../context/useUserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const {user} = useUserContext();

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, [])

    //Añadir editar cosas basicas como el Nick, email, contraseña y desactivar cuenta (borrarla?)(tengo el endpoint?)
    return (
    <>
        <h2>Estas en tu perfil {user.name}</h2>
        <p>Nombre: {user.name}</p>
        <p>Correo: {user.email}</p>
        <p>Nick: {user.nick}</p>
    </>)

}

export default Profile;