import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";

function Posts() {
    const { user } = useUserContext();
    const [token, setToken] = useState("");
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [game, setGame] = useState({});

    //Pagination
    const [page, setPage] = useState(1);
    //Filter
    const [typeFilter, setTypeFilter] = useState("");
    const [rowFilter, setRowFilter] = useState("id");
    const [orderFilter, setOrderFilter] = useState("ASC");

    const navigate = useNavigate();
    const { id } = useParams();
    const postURL = "http://localhost:3000/api/posts/";
    const getGameUrl = "http://localhost:3000/api/games/";

    const postTypes = [
        "",
        "opinion",
        "analisis",
        "critica",
        "spoiler",
        "teoria"
    ]

    const rows = [
        "id",
        "date"
    ]

    //Igual
    const getLikes = async () => {
        try {
            const likesUrl = `http://localhost:3000/api/likes/`;
            const response = await axios.get(likesUrl);
            const data = response.data;
            setLikes(data);
        } catch (error) {
            console.log(error)
        }
    }

    const getGame = async () => {
        const response = await axios.get(getGameUrl + id);
        const newGame = response.data;
        setGame(newGame);
    }

    const getPostsFiltered = async () => {
        try {
            const payload = {
                id,
                page,
                typeFilter,
                rowFilter,
                orderFilter
            }

            const complexUrl = postURL + "filter/";

            const response = await axios.post(complexUrl, payload);
            const newPosts = response.data;
            setPosts(newPosts);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGame();
        getPostsFiltered();
        getLikes();
    }, []);

    useEffect(() => {
        getPostsFiltered()
    }, [page]);

    useEffect(() => {
        if (page === 1) { getPostsFiltered(); }
        setPage(1);
    }, [orderFilter, rowFilter, typeFilter]);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

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
        if (token) {
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

    const nextPage = () => {
        if (posts.length <= 4) { return; }

        const newPage = page + 1;
        setPage(newPage);
    }

    const prevPage = () => {
        if (page - 1 <= 0) { return }

        let newPage = page - 1;
        setPage(newPage);
    }

    const firstPage = () => {
        if (page === 1) { return }

        const newPage = 1;
        setPage(newPage);
    }

    const postNav = () => {
        return (
            <>
                <button onClick={() => prevPage()}>Atras</button>
                <button onClick={() => firstPage()}>Primera</button>
                <button onClick={() => nextPage()}>Siguiente</button>
            </>
        )
    }

    return (
        <>
            <h2>POSTS FOR {game[0] && game[0].tittle}</h2>
            <p>Filtros</p>
            <label htmlFor="filterType">Por tipo</label>
            <select id="filterType" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                {postTypes && postTypes.map((type) => (
                    <option value={type}>{type}</option>
                ))}
            </select>
            <label htmlFor="orderBy">Ordenar por</label>
            <select id="orderBy" value={rowFilter} onChange={(e) => setRowFilter(e.target.value)}>
                {rows && rows.map((row) => (
                    <option value={row}>{row}</option>
                ))}
            </select>
            <div>
                <label htmlFor="option1">Ascendente</label>
                <input id="option1" type="radio" value="ASC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                <label htmlFor="option2">Descendente</label>
                <input id="option2" type="radio" value="DESC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
            </div>
            {generateCreateButton()}
            {posts && postNav()}
            {posts && <p>Pagina: {page}</p>}
            {posts && posts.map((post) =>
            (
                <div key={post.id}>
                    <p>{post.post_type}</p>
                    <p>{post.content}</p>
                    <p>{getFormattedDate(post.date)}</p>
                    {generateUserButton(post)}
                    {likes && generateLikeButton(post)}
                    {generateEditButton(post)}
                </div>
            ))}
            {posts.length <= 4 && <p>Fin de las entradas de posts</p>}
            {posts && postNav()}
        </>)

}

export default Posts;