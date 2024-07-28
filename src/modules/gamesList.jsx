import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useGamesContext } from '../context/useGamesContext'
import { useUserContext } from "../context/useUserContext";

const GamesList = () => {
    const { games, setGames } = useGamesContext();
    const [token, setToken] = useState("");
    const { user } = useUserContext();
    const [likes, setLikes] = useState([]);
    const navigate = useNavigate();
    const getGamesUrl = "http://localhost:3000/api/games";

    const getLikes = async () => {
        const likesUrl = `http://localhost:3000/api/likes/`;
        const response = await axios.get(likesUrl);
        const data = response.data;
        setLikes(data);
    }

    useEffect(() => {
        const getGames = async () => {
            if (getGames.length < 1) {
                const response = await axios.get(getGamesUrl);
                const newGames = response.data;
                setGames(newGames);
            }
        }

        setToken(localStorage.getItem("token"));
        getGames();
        getLikes();
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);


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

    const sendLike = async (e) => {
        if (!token) { return };

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

    const generateLikeButton = (game) => {
        const actualLike = likes.find((like) => like.id === game.id);

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

    const generateEditButton = (game) => {
        if (user.type === "admin") {
            return (
                <>
                    <button key={game.id} onClick={() => navigate(`/adminPage/editGame/${game.id}`)}>Edit</button>
                </>)
        } else if (user.type === "mod") {
            return (
                <>
                    <button key={game.id} onClick={() => navigate(`/modPage/editGame/${game.id}`)}>Edit</button>
                </>)
        }
    }

    const goToPost = (game) => {
        navigate(`/posts/${game.id}`);
    }

    return (
        <>
            {games && games.map((game) =>
            (
                <div key={game.id}>
                    <p>{game.tittle}</p>
                    <p>{game.genre}</p>
                    <p>{game.developer}</p>
                    <p>{getFormattedDate(game.release)}</p>
                    <button onClick={() => goToPost(game)}>Ver posts</button>
                    {likes && generateLikeButton(game)}
                    {generateEditButton(game)}
                </div>
            ))}
        </>)

}

export default GamesList;