import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import './EditPost.css'

//Module to control the edition of post data. Uses form validation to check that none are empty. Populates the fields with the post to edit to make it easier for admin/mod.

function EditPost() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            postId: 0, post_type: "", content: "", game_id: "", user_id: "", active: ""
        }
    });

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
    const editPostUrl = "https://gamefeed-back.onrender.com/api/posts/";

    const postTypes = [
        "opinion",
        "analisis",
        "critica",
        "spoiler",
        "teoria"
    ];

    //Function to populate the fields with the actual data on the element to edit.
    const setPostData = () => {
        setPostType(post.post_type);
        setContent(post.content);
        setGameId(post.game_id);
        setUserId(post.user_id)
        setActive(post.active)

        reset({ post_type: post.post_type, content: post.content, game_id: post.game_id, user_id: post.user_id, active: post.active });
    };

    //Basic re-render on direct link access to populate the form with the item data.
    useEffect(() => {
        if (id) { setPostId(id); }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("token") || (user.type !== "admin" && user.type !== "mod")) { navigate("/"); }
    }, [user]);

    useEffect(() => {
        setPostData();
    }, [post]);

    useEffect(() => {
        if(postId) {
            checkPost();
        }
    }, [postId]);

    //Function to send the data once is validated to the back-end.
    const editPost = async (data) => {
        if (data) {
            const payload = {
                post_type: data.post_type,
                content: data.content,
                game_id: data.game_id,
                user_id: data.user_id,
                active: data.active
            };

            try {
                const response = await axios.put(editPostUrl + postId, payload);
                setPost("");
                setUpadteStatus(response.data.estado);
            } catch (error) {
                console.log(error)
                setUpadteStatus("");
            };
        };
    };

    //Function to delete the post. It has a confirmation window that is necessary to accept to finally delete the element.
    const deletePost = async () => {
        const confirmation = await confirm("Confirma para borrar la entrada");

        if (confirmation) {
            const response = await axios.delete(editGameUrl + gameId);
            setPost("");
            setUpadteStatus(response.data.estado);
        };
    };

    //Function search for the selected item.
    const checkPost = async (e) => {
        if(e) { e.preventDefault(); };

        const response = await axios.get(editPostUrl + postId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setPost("");
        } else {
            const newPost = response.data;
            setPost(newPost[0]);
            setUpadteStatus("");
        };
    };

    return (
        <div className="editPost">
            <h2 className="editPost--tittle">Pagina de edición de posts</h2>
            <div className="editPost--searchFormWrap">
                <form className="editPost--searchForm" onSubmit={checkPost}>
                    <label htmlFor="searchPost">ID del post</label>
                    <input id="searchPost" type="number" value={postId} onChange={(e) => setPostId(e.target.value)}></input>
                    <button type="submit">Traer post</button>
                </form>
            </div>
            {post &&
                <div className="editPost--editFormWrap">
                    <form className="editPost--editForm" onSubmit={handleSubmit((data) => editPost(data))}>
                        <label htmlFor="editPostType">Tipo</label>
                        <select id="editPostType" {...register("post_type", { required: { value: true, message: "Se debe introducir el tipo." } })} value={postType ? postType : ""} onChange={(e) => setPostType(e.target.value)}>
                            {postTypes && postTypes.sort().map((type, i) => (
                                <option key={i} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.post_type?.message && <p className="editPost--editFormError">{errors.post_type?.message}</p>}
                        <label htmlFor="editPostContent">Contenido</label>
                        <textarea id="editPostContent" type="text" {...register("content", { required: { value: true, message: "Se debe introducir un contenido." } })} value={content ? content : ""} onChange={(e) => setContent(e.target.value)}></textarea>
                        {errors.content?.message && <p className="editPost--editFormError">{errors.content?.message}</p>}
                        <label htmlFor="editPostGameId">ID del juego</label>
                        <input id="editPostGameId" type="text" {...register("game_id", { required: { value: true, message: "Se debe introducir el id del juego." } })} value={gameId ? gameId : ""} onChange={(e) => setGameId(e.target.value)}></input>
                        {errors.game_id?.message && <p className="editPost--editFormError">{errors.game_id?.message}</p>}
                        <label htmlFor="editPostUserId">ID del usuario</label>
                        <input id="editPostUserId" type="text" {...register("user_id", { required: { value: true, message: "Se debe introducir el id del usuario." } })} value={userId ? userId : ""} onChange={(e) => setUserId(e.target.value)}></input>
                        {errors.user_id?.message && <p className="editPost--editFormError">{errors.user_id?.message}</p>}
                        <label htmlFor="editPostState">Estado</label>
                        <input id="editPostState" type="checkbox" {...register("active")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        <button className="editPost--editFormButton" type="submit">Guardar cambios</button>
                    </form>
                    <button className="editPost--deleteButton" onClick={deletePost}>Borrar post</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </div>
    )
}

export default EditPost;