import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function EditPost() {
    //Direct Link
    const { id } = useParams()
    //Search
    const [postId, setPostId] = useState("");
    const [post, setPost] = useState("");
    const [updateStatus, setUpadteStatus] = useState("");
    //Post values
    const [postType, setPostType] = useState("");
    const [content, setContent] = useState("");
    const [gameId, setGameId] = useState("");
    const [userId, setUserId] = useState("");
    const [active, setActive] = useState(false);

    const { user } = useUserContext();
    const navigate = useNavigate();
    const editPostUrl = "http://localhost:3000/api/posts/";
    
    const setPostData = () => {
        setPostType(post.post_type);
        setContent(post.content);
        setGameId(post.game_id);
        setUserId(post.user_id)
        setActive(post.active)
    }

    useEffect(() => {
        if (id) {
            setPostId(id);
        }
    }, [])

    useEffect(() => {
        if (!localStorage.getItem("token") || (user.type !== "admin" && user.type !== "mod")) { navigate("/"); }
    }, [user])

    useEffect(() => {
        setPostData();
    }, [post])

    useEffect(() => {
        if(postId) {
            checkPost();
            setPostData();
        }
    }, [postId])

    const editPost = async (e) => {
        e.preventDefault();

        if (postType && content && gameId && userId) {
            const payload = {
                post_type: postType,
                content,
                game_id: gameId,
                user_id: userId,
                active
            }

            const response = await axios.put(editPostUrl + postId, payload);
            setPost("");
            setUpadteStatus(response.data.estado);
        }
    }

    const deletePost = async () => {
        const confirmation = await confirm("Confirma para borrar la entrada");

        if (confirmation) {
            const response = await axios.delete(editGameUrl + gameId);
            setPost("");
            setUpadteStatus(response.data.estado);
        }
    }

    const checkPost = async (e) => {
        if(e) { e.preventDefault(); }  

        const response = await axios.get(editPostUrl + postId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setPost("");
        } else {
            const newPost = response.data;
            setPost(newPost[0]);
            setUpadteStatus("");
        }
    }

    return (
        <>
            <div>
                <form onSubmit={checkPost}>
                    <label htmlFor="searchPost">ID del post</label>
                    <input id="searchPost" type="number" value={postId} onChange={(e) => setPostId(e.target.value)}></input>
                    <button type="submit">Traer post</button>
                </form>
            </div>
            {post &&
                <div>
                    <form onSubmit={editPost}>
                        <label htmlFor="editPostType">Tipo</label>
                        <input id="editPostType" type="text" value={postType ? postType : ""} onChange={(e) => setPostType(e.target.value)}></input>
                        <label htmlFor="editPostContent">Contenido</label>
                        <textarea id="editPostContent" type="text" value={content ? content : ""} onChange={(e) => setContent(e.target.value)}></textarea>
                        <label htmlFor="editPostGameId">ID del juego</label>
                        <input id="editPostGameId" type="text" value={gameId ? gameId : ""} onChange={(e) => setGameId(e.target.value)}></input>
                        <label htmlFor="editPostUserId">ID del usuario</label>
                        <input id="editPostUserId" type="text" value={userId ? userId : ""} onChange={(e) => setUserId(e.target.value)}></input>
                        <label htmlFor="editPostState">Estado</label>
                        <input id="editPostState" type="checkbox" value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        <button type="submit">Guardar cambios del post</button>
                    </form>
                    <button onClick={deletePost}>Borrar post</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </>
    )
}

export default EditPost;