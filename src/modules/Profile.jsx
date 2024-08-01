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
    <div className="profile">
        <h2 className="profile--tittle">Te encuentras en tu perfil, {user.name}</h2>
        <p className="profile--text profile--name">Nombre: <span>{user.name}</span></p>
        <p className="profile--text profile--email">Correo: <span>{user.email}</span></p>
        <p className="profile--text profile--nick">Nick: <span>{user.nick}</span></p>
    </div>)

}

export default Profile;