import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const AddPost = () => {
    const [type, setType] = useState("");
    const [content, setContent] = useState("");
    const {user} = useUserContext();
    const [ game, setGame ] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const getGameUrl = "http://localhost:3000/api/games/";
    const addPostUrl = "http://localhost:3000/api/posts/create/";

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }

        const getGame = async () => {
            const response = await axios.get(getGameUrl+id);
            const newGame = response.data;
            setGame(newGame);
        }

        getGame();
    }, []);

    const createPost = async (e) => {
        e.preventDefault();

        if (type && content) {
            const payload = {
                type,
                content,
                user_id: user.id,
                game_id: game.id
            }

            await axios.post(addPostUrl, payload);            
            navigate("/posts", {state: {game}});
        }
    }

    return (
        <>
            <h2>NEW POST FOR {game[0] && game[0].tittle}</h2>
            <form onSubmit={createPost}>
                <label htmlFor="newPostType">Tipo</label>
                <input id="newPostType" type="text" value={type} onChange={(e) => setType(e.target.value)}></input>
                <label htmlFor="newPostContent">Contenido</label>
                <textarea id="newPostContent" type="text" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                <button type="submit">Añadir post</button>
            </form>
        </>
    )
}

export default AddPost;