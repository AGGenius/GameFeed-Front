import { useUserContext } from "../context/useUserContext";

const Profile = () => {
    const {user} = useUserContext();

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