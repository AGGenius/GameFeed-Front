import { useEffect, useState } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import './Profile.css'

//Module to generate a the profile page for a logged user. Shows his user data.
const Profile = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            userId: 0, email: "", name: "", nick: "", pass1: "", pass2: "", active: "", confirmationPass: ""
        }
    });
    const navigate = useNavigate();

    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");
    const [userGames, setUserGames] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [editFormState, setEditFormState] = useState(false);
    const [likes, setLikes] = useState([]);
    //Edit states
    const [userEdit, setUserEdit] = useState("");
    const [updateStatus, setUpadteStatus] = useState("");
    const [finalUpdateStatus, seFinalUpadteStatus] = useState("");
    //User values
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [active, setActive] = useState(false);
    const [confirmationPass, setConfirmationPass] = useState("");
    ///seePasswords
    const [passwordType, setPassworodType] = useState("password");
    const [pass1Type, setPass1Type] = useState("password");
    const [pass2Type, setPass2Type] = useState("password");
    //password checks  
    const [passwordState, setPasswordState] = useState([]);

    const getGamesUrl = "https://gamefeed-back.onrender.com/api/games/user/";
    const getPostsUrl = "https://gamefeed-back.onrender.com/api/posts/user/";
    const getLikesUrl = "https://gamefeed-back.onrender.com/api/likes/user/";
    const editUserUrl = "https://gamefeed-back.onrender.com/api/users/";
    const likesUrl = "https://gamefeed-back.onrender.com/api/likes/";

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
        getLikes();
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        getUserGames();
        getUserPosts();
        getUserLikes();
    }, [user, likes])

    useEffect(() => {
        if (editFormState) {
            getUserData();
        };
    }, [editFormState]);

    useEffect(() => {
        setUserData();
    }, [userEdit]);

    function setUserData() {
        setEmail(userEdit.email);
        setName(userEdit.name);
        setNick(userEdit.nick);
        setActive(userEdit.active);

        reset({ email: userEdit.email, name: userEdit.name, nick: userEdit.nick, active: userEdit.active });
    };

    const getUserData = async () => {
        const response = await axios.get(editUserUrl + user.id);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setUserEdit("");
        } else {
            const newUserData = response.data;
            setUserEdit(newUserData);
            setUpadteStatus("");
        };
    };

    const getLikes = async () => {
        try {
            const response = await axios.get(likesUrl);
            const data = response.data;
            setLikes(data);
        } catch (error) {
            //console.log(error);
        };
    };

    const getUserGames = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getGamesUrl + user.id);
                const data = response.data;
                setUserGames(data);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    const getUserPosts = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getPostsUrl + user.id);
                const data = response.data;
                setUserPosts(data);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    const getUserLikes = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getLikesUrl + user.id);
                const data = response.data;
                setUserLikes(data);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    const sendLike = async (e) => {
        if (!token) { return };

        const user_id = user.id;
        const likes_id = e.target.value;

        if (user_id && likes_id) {
            const payload = {
                user_id,
                likes_id,
            }

            const response = await axios.post(likesUrl, payload);
            const data = response.data;
            setLikes(data);
        };
    };

    const generateLikeButton = (type, element) => {
        let actualLike;
        let button;

        if (type === "game") {
            actualLike = likes.find((like) => like.id === element.id);
        } else if (type === "post") {
            actualLike = likes.find((like) => like.post_id === element.id);
        }

        if (actualLike) {
            { } userLikes.forEach(like => {
                if (actualLike.id === like.likes_id && like.user_id === user.id) {
                    button = <button className="profile--removeLikeButton" value={actualLike.id} onClick={(e) => sendLike(e)}>Remove Like</button>;
                }
            })
        }

        if (token) {
            return (
                <>
                    {button}
                </>);
        }
    };

    const manageEditFormState = () => {
        const state = editFormState;

        if (!state) {
            setPass1("");
            setPass2("");
            setConfirmationPass("");
            reset({ pass1: "", pass2: "", password: ""});
        }

        setEditFormState(!state);
    }

    //Function to send the data once is validated to the back-end.
    const editUser = async (data) => {
        if (data) {
            const payload = {
                email: data.email,
                name: data.name,
                nick: data.nick,
                pass1: data.pass1,
                pass2: data.pass2,
                active: data.active,
                password: data.confirmationPass
            }

            checkPassSecurity(pass1);

            if (passwordState.length === 0) {
                try {
                    let response;

                    if (pass1 && pass2) {
                        response = await axios.put(editUserUrl + "editInfoPass/" + user.id, payload);
                    } else {
                        response = await axios.put(editUserUrl + "editInfo/" + user.id, payload);
                    }

                    setUserEdit("");
                    seFinalUpadteStatus(response.data.estado);
                    manageEditFormState();
                    const userResponse = await axios.get(editUserUrl + user.id);
                    const newUser = userResponse.data;
                    setUser(newUser);
                } catch (error) {
                    setUpadteStatus(error.response.data.estado);
                };
            };
        };
    };

    //Function to delete the user. It has a confirmation window that is necessary to accept to finally delete the element.
    const deleteUser = async () => {
        const confirmation = await confirm("Confirma para borrar el usuario");

        if (confirmation) {
            await axios.delete(editUserUrl + user.id);
            localStorage.removeItem("token");
            setUser({});
            navigate("/");
        };
    };

    //Function to check the password strength. Uses array of error messages and regex validators to check and reply on each case.
    const checkPassSecurity = (checkPass) => {
        const passwordChecklist = [
            "Tiene que tener al menos 6 caracteres",
            "Debe incluir al menos 1 numero",
            "Debe incluir al menos 1 letra minuscula",
            "Debe incluir al menos 1 letra mayuscula",
            "Deve incluir al menos 1 caracter especial"
        ]

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[0-9]/ },
            { regex: /[a-z]/ },
            { regex: /[A-Z]/ },
            { regex: /[^A-Za-z0-9]/ }
        ];

        let actualCheckList = [];

        if (checkPass) {

            validationRegex.forEach((item, i) => {

                let isValid = item.regex.test(checkPass);

                if (!isValid) {
                    actualCheckList.push(passwordChecklist[i])
                }
            });
        };

        setPasswordState(actualCheckList);
    };

    const managePass1Type = () => {
        let newType = "";

        if (pass1Type === "password") {
            newType = "text";
            setPass1Type(newType);
        } else {
            newType = "password";
            setPass1Type(newType);
        }
    }

    const managePass2Type = () => {
        let newType = "";

        if (pass2Type === "password") {
            newType = "text";
            setPass2Type(newType);
        } else {
            newType = "password";
            setPass2Type(newType);
        }
    }

    const managePasswordType = () => {
        let newType = "";

        if (passwordType === "password") {
            newType = "text";
            setPassworodType(newType);
        } else {
            newType = "password";
            setPassworodType(newType);
        }
    }

    return (
        <div className="profile">
            {editFormState &&
                <div className="profile--editFormBack">
                    <div className="profile--editFormWrap">
                        <form className="profile--editForm" onSubmit={handleSubmit((data) => editUser(data))}>
                            <label htmlFor="editUserEmail">Correo</label>
                            <input id="editUserEmail" type="text" {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} value={email ? email : ""} onChange={(e) => setEmail(e.target.value)}></input>
                            {errors.email?.message && <p className="profile--editFormError">{errors.email?.message}</p>}

                            <label htmlFor="editUserName">Nombre</label>
                            <input id="editUserName" type="text" {...register("name", { required: { value: true, message: "Se debe introducir el nombre." } })} value={name ? name : ""} onChange={(e) => setName(e.target.value)}></input>
                            {errors.name?.message && <p className="profile--editFormError">{errors.name?.message}</p>}

                            <label htmlFor="editUserNick">Nick</label>
                            <input id="editUserNick" type="text" {...register("nick", { required: { value: true, message: "Se debe introducir el nick." } })} value={nick ? nick : ""} onChange={(e) => setNick(e.target.value)}></input>
                            {errors.nick?.message && <p className="profile--editFormError">{errors.nick?.message}</p>}

                            <label htmlFor="editUserPass1">Nueva contraseña</label>
                            <div className="profile--passwordWrap">
                                <input id="editUserPass1" autoComplete="new-password" type={pass1Type} {...register("pass1", { required: { value: false } })} value={pass1 ? pass1 : ""} onChange={(e) => setPass1(e.target.value)}></input>
                                <span className="profile--eyeWrap">
                                    <i className={pass1Type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePass1Type()} />
                                </span>
                            </div>
                            {errors.pass1?.message && <p className="profile--editFormError">{errors.pass1?.message}</p>}

                            <label htmlFor="editUserPass2">Repite la contraseña</label>
                            <div className="profile--passwordWrap">
                                <input id="editUserPass2" autoComplete="new-password" type={pass2Type} {...register("pass2", { required: { value: false } })} value={pass2 ? pass2 : ""} onChange={(e) => setPass2(e.target.value)}></input>
                                <span className="profile--eyeWrap">
                                    <i className={pass2Type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePass2Type()} />
                                </span>
                            </div>
                            {errors.pass2?.message && <p className="profile--editFormError">{errors.pass2?.message}</p>}
                            {passwordState &&
                                <ul>
                                    {passwordState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                                </ul>}

                            <label htmlFor="editUserState">Estado</label>
                            <input id="editUserState" type="checkbox" {...register("active")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>

                            <label htmlFor="editUserPass2" className="profile--passwordLabel">Contraseña actual</label>
                            <div className="profile--passwordWrap">
                                <input id="editUserPass2" type={passwordType}{...register("confirmationPass", { required: { value: true, message: "Tienes que introducir tu contraseña para realizar cambios" } })} value={confirmationPass ? confirmationPass : ""} onChange={(e) => setConfirmationPass(e.target.value)}></input>
                                <span className="profile--eyeWrap">
                                    <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePasswordType()} />
                                </span>
                            </div>
                            {errors.confirmationPass?.message && <p className="profile--editFormError">{errors.confirmationPass?.message}</p>}
                            {updateStatus && <p>{updateStatus}</p>}
                            <button className="profile--editFormButton" type="submit">Guardar cambios</button>
                            <button className="profile--deleteButton" onClick={deleteUser}>Borrar usuario</button>
                        </form>
                        <button className="profile--cancelButton" onClick={manageEditFormState}>Cancelar</button>
                    </div>
                </div>
            }
            <h2 className="profile--tittle">Te encuentras en tu perfil, {user.name}</h2>
            <div className="profile--userData">
                <h3>Información de usuario</h3>
                <p className="profile--text profile--name">Nombre: <span>{user.name}</span></p>
                <p className="profile--text profile--email">Correo: <span>{user.email}</span></p>
                <p className="profile--text profile--nick">Nick: <span>{user.nick}</span></p>
                {finalUpdateStatus && <p>{finalUpdateStatus}</p>}
                <button className="profile--editButton" onClick={manageEditFormState}>Modificar los datos</button>
            </div>
            <div className="profile--userStats">
                <h3>Estadisticas de usuario</h3>
                <p className="profile--text">Juegos creados: <span>{userGames ? userGames.length : "0"}</span></p>
                <p className="profile--text">Post creados: <span>{userPosts ? userPosts.length : "0"}</span></p>
                <p className="profile--text">Likes enviados: <span>{userLikes ? userLikes.length : "0"}</span></p>
            </div>
            <div className="profile--userGames">
                <h3>Juegos creados</h3>
                {userGames.length > 0 ? userGames.map((game, index) =>
                (
                    <div className="profile--gameCard" key={game.id}>
                        <p className="profile--text"><span>{index + 1}:</span> {game.tittle}</p>
                        {likes && generateLikeButton("game", game)}
                    </div>
                ))
                    : <p>Sin juegos creados</p>
                }
            </div>
            <div className="profile--userPosts">
                <h3>Posts creados</h3>
                {userPosts.length > 0 ? userPosts.map((post, index) =>
                (
                    <div className="profile--postCard" key={post.id}>
                        <div className="profile--postCardData">
                            <p className="profile--text"><span>{post.post_type}:</span> {post.content}</p>
                            {likes && generateLikeButton("post", post)}
                        </div>
                    </div>
                ))
                    : <p>Sin posts creados</p>
                }
            </div>
        </div>
    );
};

export default Profile;