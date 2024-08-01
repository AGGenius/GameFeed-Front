import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";
import './Posts.css'

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
            const complexUrl = postURL + `/filter/?id=${id}&page=${page}&typeFilter=${typeFilter}&rowFilter=${rowFilter}&orderFilter=${orderFilter}`;

            const response = await axios.get(complexUrl);
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
                    {actualLike && <button className="posts--gameCardButton" value={actualLike.id} onClick={(e) => sendLike(e)}>Likes: {actualLike.value} </button>}
                </>)
        }

        return (
            <>
                {actualLike && <button className="posts--gameCardButton" disabled={true}>Likes: {actualLike.value} </button>}
            </>)
    }

    //Adaptable con condicional
    const generateEditButton = (post) => {
        if (user.type === "admin") {
            return (
                <>
                    <button className="posts--gameCardButton" key={game.id} onClick={() => navigate(`/adminPage/editPost/${post.id}`)}>Edit</button>
                </>)
        } else if (user.type === "mod") {

            return (
                <>
                    <button className="posts--gameCardButton" key={game.id} onClick={() => navigate(`/modPage/editPost/${post.id}`)}>Edit</button>
                </>)
        }
    }

    const generateUserButton = (post) => {
        if (user.type === "admin") {
            return (
                <>
                    <button className="posts--gameCardButton" key={post.id} onClick={() => navigate(`/adminPage/editUser/${post.user_id}`)}>{post.nick}</button>
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
                    <button className="posts--createPost" onClick={() => (createPost(game[0]))}>Crear nueva entrada</button>
                </>)
        } else {
            return (
                <>
                    <button className="posts--createPost" disabled={true}>Crear nueva entrada</button>
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
            <div className="posts--pageButtonsWrap">
                <button onClick={() => prevPage()}>&lt;</button>
                <button onClick={() => firstPage()}>pg1</button>
                <button onClick={() => nextPage()}>&gt;</button>
            </div>
        )
    }

    return (
        <div className="posts">
            <h2 className="posts--tittle">Entrada en {game[0] && game[0].tittle}</h2>
            {generateCreateButton()}
            <div className="posts--filters">
                <h3 className="posts--filtersTittle">Filtros</h3>
                <div className="posts--filtersWrap">
                    <p>Filtros</p>
                    <label htmlFor="filterType">Por tipo</label>
                    <select id="filterType" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        {postTypes && postTypes.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                        ))}
                    </select>
                    <label htmlFor="orderBy">Ordenar por</label>
                    <select id="orderBy" value={rowFilter} onChange={(e) => setRowFilter(e.target.value)}>
                        {rows && rows.map((row, i) => (
                            <option key={i} value={row}>{row}</option>
                        ))}
                    </select>
                    <label htmlFor="orderType">Orden</label>
                    <div id="orderType" className="posts--filtersSelectors">
                        <label htmlFor="option1">ASC</label>
                        <input id="option1" type="radio" value="ASC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                        <label htmlFor="option2">DESC</label>
                        <input id="option2" type="radio" value="DESC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="posts--pageButtons">
                {posts && postNav()}
                {posts && <p>Pagina: {page}</p>}
            </div>
            <div className="posts--postCardWrap">
                {posts ? posts.map((post) =>
                (
                    <div className="posts--postCard" key={post.id}>
                        <div className="posts--postCardData">
                            <p className="posts--postCardText">{post.post_type}</p>
                            <p className={["posts--postCardText", post.post_type === "spoiler" ? "hidden" : ""].join(' ')}>{post.content}</p>
                            <p className="posts--postCardText">Creado el: {getFormattedDate(post.date)}</p>
                        </div>
                        <div className="posts--postCardButtonsWrap">
                            {generateUserButton(post)}
                            {likes && generateLikeButton(post)}
                            {generateEditButton(post)}
                        </div>
                    </div>
                ))
                    : <p>Cargando datos</p>
                }
                {posts.length <= 4 && <p>Fin de las entradas de posts</p>}
            </div>
            <div className="posts--pageButtons">
                {posts && postNav()}
                {posts && <p>Pagina: {page}</p>}
            </div>
        </div >)

}

export default Posts;