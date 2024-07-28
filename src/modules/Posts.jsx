import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";

function Posts() {
    const { user } = useUserContext();
    const [ token, setToken ] = useState("");
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [game, setGame] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const postByGameURL = "http://localhost:3000/api/posts/game/";
    const getGameUrl = "http://localhost:3000/api/games/";

    //Igual
    const getLikes = async () => {
        const likesUrl = `http://localhost:3000/api/likes/`;
        const response = await axios.get(likesUrl);
        const data = response.data;
        setLikes(data);
    }

    useEffect(() => {
        const getGame = async () => {
            const response = await axios.get(getGameUrl + id);
            const newGame = response.data;
            setGame(newGame);
        }

        const getPosts = async () => {

            const response = await axios.get(postByGameURL + id);
            const newPosts = response.data;
            setPosts(newPosts);
        }

        setToken(localStorage.getItem("token"));
        getGame();
        getPosts();
        getLikes();
    }, []);

    //Igual
    const getFormattedDate = (queryDate) => {
        const date = new Date(queryDate);
        const year = date.getFullYear();

        function twoDigitsDate(string) {
            return string = string.length > 1 ? string : '0' + string;
        }

        let month = (1 + date.getMonth()).toString();
        month = twoDigitsDate(month)

        let day = date.getDate().toString();
        day = twoDigitsDate(day)

        return month + '-' + day + '-' + year;
    };

    //Igual
    const sendLike = async (e) => {
        if (!user.id) { return };

        const user_id = user.id;
        const likes_id = e.target.value;
        const likesUrl = `http://localhost:3000/api/likes/`;

        if (user_id && likes_id) {
            const payload = {
                user_id,
                likes_id,
            }

            const response = await axios.post(likesUrl, payload);
            const data = response.data;
            setLikes(data)
        }
    }

    //Adaptable con condicional
    const generateLikeButton = (post) => {
        const actualLike = likes.find((like) => like.post_id === post.id);

        if (token) {
            return (
                <>
                    {actualLike && <button value={actualLike.id} onClick={(e) => sendLike(e)}>Likes: {actualLike.value} </button>}
                </>)
        }

        return (
            <>
                {actualLike && <button disabled={true}>Likes: {actualLike.value} </button>}
            </>)
    }

    //Adaptable con condicional
    const generateEditButton = (post) => {
        if (user.type === "admin") {

            return (
                <>
                    <button key={game.id} onClick={() => navigate(`/adminPage/editPost/${post.id}`)}>Edit</button>
                </>)
        } else if (user.type === "mod") {

            return (
                <>
                    <button key={game.id} onClick={() => navigate(`/modPage/editPost/${post.id}`)}>Edit</button>
                </>)
        }
    }

    const generateUserButton = (post) => {
        if (user.type === "admin") {

            return (
                <>
                    <button key={post.id} onClick={() => navigate(`/adminPage/editUser/${post.user_id}`)}>{post.nick}</button>
                </>)
        } else {
            return (
                <>
                    <p>Por: {post.nick}</p>
                </>)
        }
    }

    const generateCreateButton = () => {
        if (user.type === "admin") {

            return (
                <>
                    <button onClick={() => (createPost(game[0]))}>Crear entrada</button>
                </>)
        } else {
            return (
                <>
                    <button disabled={true}>Crear entrada</button>
                </>)
        }
    }

    const createPost = (game) => {
        if (!token) { return };
        navigate(`/addPost/${game.id}`);
    }

    return (
        <>
            <h2>POSTS FOR {game[0] && game[0].tittle}</h2>
            {generateCreateButton()}
            {posts && posts.map((post) =>
            (
                <div key={post.id}>
                    <p>{post.type}</p>
                    <p>{post.content}</p>
                    <p>{getFormattedDate(post.date)}</p>
                    {generateUserButton(post)}
                    {likes && generateLikeButton(post)}
                    {generateEditButton(post)}
                </div>
            ))}
        </>)

}

export default Posts;