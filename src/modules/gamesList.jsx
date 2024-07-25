import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useGamesContext } from '../context/useGamesContext'
import { useUserContext } from "../context/useUserContext";

const GamesList = () => {
    const { games, setGames } = useGamesContext();
    const { user } = useUserContext();
    const [likes, setLikes] = useState([]);
    const url = "http://localhost:3000/api/games";

    const getLikes = async () => {
        const likesUrl = `http://localhost:3000/api/likes/`;
        const response = await axios.get(likesUrl);
        const data = response.data;
        setLikes(data);
    }

    useEffect(() => {
        const getGames = async () => {
            if (getGames.length < 1) {
                const response = await axios.get(url);
                const newGames = response.data;
                setGames(newGames);
            }
        }

        getGames();
        getLikes();
    }, []);


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
        return (
            <>
                {actualLike && <button key={actualLike.id} value={actualLike.id} onClick={(e) => sendLike(e)}>Likes: {actualLike.value} </button>}
            </>)

    }

    return (
        <>
            {games && games.map((game, index) =>
            (
                <Link key={index} to="/posts" state={{game}}> <div>
                    <p>{game.tittle}</p>
                    <p>{game.genre}</p>
                    <p>{game.developer}</p>
                    <p>{getFormattedDate(game.release)}</p>
                    {likes && generateLikeButton(game)}
                </div></Link>
            ))}
        </>)

}

export default GamesList;