import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function EditUser() {
    //Search
    const [userId, setUserId] = useState("");
    const [userEdit, setUserEdit] = useState("");
    const [updateStatus, setUpadteStatus] = useState("");
    //User values
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [type, setType] = useState("");
    const [active, setActive] = useState(false);

    const { user } = useUserContext();
    const navigate = useNavigate();
    const editUserUrl = "http://localhost:3000/api/users/";

    useEffect(() => {
        if (!localStorage.getItem("token") || (Object.keys(user).length !== 0 && user.type !== "admin")) { navigate("/"); }
    }, [user])

    
    useEffect(() => {
        setEmail(userEdit.email);
        setName(userEdit.name);
        setNick(userEdit.nick)
        setType(userEdit.type)
        setActive(userEdit.active)
    }, [userEdit])
    

    const editUser = async (e) => {
        e.preventDefault();

        if (email && name && nick && type) {
            const payload = {
                email,
                name,
                nick,
                type,
                active
            }

            const response = await axios.put(editUserUrl + userId, payload);
            setUserEdit("");
            setUpadteStatus(response.data.estado);
        }
    }

    const deleteUser = async () => {
        const confirmation = await confirm("Confirma para borrar el usuario");

        if (confirmation) {
            const response = await axios.delete(editUserUrl + userId);
            setUserEdit("");
            setUpadteStatus(response.data.estado);
        }
    }

    const checkUser = async (e) => {
        e.preventDefault();

        const response = await axios.get(editUserUrl + userId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setUserEdit("");
        } else {
            const newUserData = response.data;
            setUserEdit(newUserData);
            setUpadteStatus("");
        }
    }

    return (
        <>
            <div>
                <form onSubmit={checkUser}>
                    <label htmlFor="searchGame">ID del usuario</label>
                    <input id="searchGame" type="number" value={userId} onChange={(e) => setUserId(e.target.value)}></input>
                    <button type="submit">Traer usuario</button>
                </form>
            </div>
            {userEdit &&
                <div>
                    <form onSubmit={editUser}>
                        <label htmlFor="editUserEmail">Correo</label>
                        <input id="editUserEmail" type="text" value={email ? email : ""} onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor="editUserName">Nombre</label>
                        <input id="editUserName" type="text" value={name ? name : ""} onChange={(e) => setName(e.target.value)}></input>
                        <label htmlFor="editUserNick">Nick</label>
                        <input id="editUserNick" type="text" value={nick ? nick : ""} onChange={(e) => setNick(e.target.value)}></input>
                        <label htmlFor="editUserType">Tipo</label>
                        <input id="editUserType" type="text" value={type ? type : ""} onChange={(e) => setType(e.target.value)}></input>
                        <label htmlFor="editUserState">Estado</label>
                        <input id="editUserState" type="checkbox" value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        <button type="submit">Guardar cambios del usuario</button>
                    </form>
                    <button onClick={deleteUser}>Borrar usuario</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </>
    )
}

export default EditUser;