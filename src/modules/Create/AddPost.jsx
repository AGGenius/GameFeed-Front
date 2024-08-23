import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import './AddPost.css'

//Module to control the creation of entries for a given game.
const AddPost = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            type: "", content: ""
        }
    });

    const [createStatus, setCreateStatus] = useState("");
    const { user } = useUserContext();
    const [game, setGame] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const getGameUrl = "https://gamefeed-back.onrender.com/api/games/";
    const addPostUrl = "https://gamefeed-back.onrender.com/api/posts/create/";

    const postTypes = [
        "opinion",
        "analisis",
        "critica",
        "spoiler",
        "teoria"
    ]

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }

        const getGame = async () => {
            const response = await axios.get(getGameUrl + id);
            const newGame = response.data;
            setGame(newGame);
        }

        getGame();
    }, []);

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const createPost = async (data) => {
        if (data) {
            const payload = {
                post_type: data.type,
                content: data.content,
                user_id: user.id,
                game_id: game[0].id
            }

            try {
                const response = await axios.post(addPostUrl, payload);
                setCreateStatus(response.data.estado);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    return (
        <div className="addPost">
            <h2 className="addPost--tittle">Nueva entrada para {game[0] && game[0].tittle}</h2>
            <form className="addPost--form" onSubmit={handleSubmit((data) => createPost(data))}>
                <label htmlFor="newPostType">Tipo</label>
                <select id="newPostType" {...register("type", { required: { value: true, message: "Se debe introducir el genero." } })}>
                    {postTypes && postTypes.sort().map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                    ))}
                </select>
                {errors.type?.message && <p className="addPost--formError">{errors.type?.message}</p>}
                <label htmlFor="newPostContent">Contenido</label>
                <textarea id="newPostContent" type="text"  {...register("content", { required: { value: true, message: "Se debe introducir un contenido." } })}></textarea>
                {errors.content?.message && <p className="addPost--formError">{errors.content?.message}</p>}
                <button className="addPost--formButton" type="submit">Añadir post</button>
            </form>
            {createStatus && <p>{createStatus}</p>}
        </div>
    )
}

export default AddPost;