import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import './EditUser.css'

function EditUser() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            userId: 0, email: "", name: "", nick: "", type: "", active: ""
        }
    });
    //Direct Link
    const { id } = useParams()
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

    function setUserData() {
        setEmail(userEdit.email);
        setName(userEdit.name);
        setNick(userEdit.nick)
        setType(userEdit.type)
        setActive(userEdit.active)

        reset({ email: userEdit.email, name: userEdit.name, nick: userEdit.nick, type: userEdit.type, active: userEdit.active });
    }

    useEffect(() => {
        if (id) { setUserId(id); }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("token") || (Object.keys(user).length !== 0 && user.type !== "admin")) { navigate("/"); }
    }, [user]);

    useEffect(() => {
        setUserData();
    }, [userEdit]);

    useEffect(() => {
        if(userId) {
            checkUser();
        }
    }, [userId])

    const editUser = async (data) => {
        if (data) {
            const payload = {
                email: data.email,
                name: data.name,
                nick: data.nick,
                type: data.type,
                active: data.active
            }

            try {
                const response = await axios.put(editUserUrl + userId, payload);
                setUserEdit("");
                setUpadteStatus(response.data.estado);
            } catch (error) {
                console.log(error);
                setUpadteStatus("");
            };
        };
    };

    const deleteUser = async () => {
        const confirmation = await confirm("Confirma para borrar el usuario");

        if (confirmation) {
            const response = await axios.delete(editUserUrl + userId);
            setUserEdit("");
            setUpadteStatus(response.data.estado);
        };
    };

    const checkUser = async (e) => {
        if(e) { e.preventDefault(); };

        const response = await axios.get(editUserUrl + userId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setUserEdit("");
        } else {
            const newUserData = response.data;
            setUserEdit(newUserData);
            setUpadteStatus("");
        };
    };

    return (
        <div className="editUser">
            <h2 className="editUser--tittle">Pagina de edición de usuarios</h2>
            <div className="editUser--searchFormWrap">
                <form className="editUser--searchForm" onSubmit={checkUser}>
                    <label htmlFor="searchUser">ID del usuario</label>
                    <input id="searchUser" type="number"  onChange={(e) => setUserId(e.target.value)}></input>
                    <button type="submit">Traer usuario</button>
                </form>
            </div>
            {userEdit &&
                <div className="editUser--editFormWrap">
                    <form className="editUser--editForm" onSubmit={handleSubmit((data) => editUser(data))}>
                        <label htmlFor="editUserEmail">Correo</label>
                        <input id="editUserEmail" type="text" {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} value={email ? email : ""} onChange={(e) => setEmail(e.target.value)}></input>
                        {errors.email?.message && <p className="editUser--editFormError">{errors.email?.message}</p>}
                        <label htmlFor="editUserName">Nombre</label>
                        <input id="editUserName" type="text" {...register("name", { required: { value: true, message: "Se debe introducir el nombre." } })} value={name ? name : ""} onChange={(e) => setName(e.target.value)}></input>
                        {errors.name?.message && <p className="editUser--editFormError">{errors.name?.message}</p>}
                        <label htmlFor="editUserNick">Nick</label>
                        <input id="editUserNick" type="text" {...register("nick", { required: { value: true, message: "Se debe introducir el nick." } })} value={nick ? nick : ""} onChange={(e) => setNick(e.target.value)}></input>
                        {errors.nick?.message && <p className="editUser--editFormError">{errors.nick?.message}</p>}
                        <label htmlFor="editUserType">Tipo</label>
                        <input id="editUserType" type="text" {...register("type", { required: { value: true, message: "Se debe introducir el tipo." } })} value={type ? type : ""} onChange={(e) => setType(e.target.value)}></input>
                        {errors.type?.message && <p className="editUser--editFormError">{errors.type?.message}</p>}
                        <label htmlFor="editUserState">Estado</label>
                        <input id="editUserState" type="checkbox" {...register("active", { required: { value: true, message: "Se debe introducir el estado." } })} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        {errors.active?.message && <p className="editUser--editFormError">{errors.active?.message}</p>}
                        <button className="addGame--editFormButton" type="submit">Guardar cambios</button>
                    </form>
                    <button className="editGame--deleteButton" onClick={deleteUser}>Borrar usuario</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </div>
    )
}

export default EditUser;