import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useGamesContext } from '../context/useGamesContext'
import { useUserContext } from "../context/useUserContext";

const GamesList = () => {
    const { games, setGames } = useGamesContext();
    const [token, setToken] = useState("");

    //Pagination
    const [page, setPage] = useState(1);
    //Search
    const [searchTittle, setSearchTittle] = useState("");
    const [searchState, setSearchState] = useState("");
    //Filter
    const [genreFilter, setGenreFilter] = useState("");

    const { user } = useUserContext();
    const [likes, setLikes] = useState([]);
    const navigate = useNavigate();
    const getGamesUrl = "http://localhost:3000/api/games/";

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

    const getGamesPaged = async () => {
        try {
            let complexUrl;

            if(genreFilter) {        
                complexUrl = getGamesUrl + "page/" + page + "/" + genreFilter;
            } else {
                complexUrl = getGamesUrl + "page/" + page;
            }
            
            const response = await axios.get(complexUrl);
            const newGames = response.data;

            setGames(newGames);
        } catch (error) {
            console.log(error)
        }
    }

    const getGamesByTittle = async () => {
        try {
            if (searchTittle.length > 2) {
                const response = await axios.get(getGamesUrl + "tittle/" + searchTittle);
                const newGames = response.data;

                if (newGames.length > 0) {
                    setGames(newGames);
                    setSearchState("");
                } else {
                    setSearchState("Sin resultados");
                    setGames([]);
                }
            } else if (searchTittle.length === 0) {
                getGamesPaged();
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGamesPaged();
        getLikes();
    }, [ ,page]);

    useEffect(() => {
        setPage(1);
        getGamesPaged();
        getLikes();
    }, [genreFilter]);

    useEffect(() => {
        getGamesByTittle();
        getLikes();
    }, [searchTittle]);

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

    const nextPage = () => {
        if (games.length <= 4) { return; }

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

    const gameNav = () => {
        return (
            <>
                <button onClick={() => prevPage()}>Atras</button>
                <button onClick={() => firstPage()}>Primera</button>
                <button onClick={() => nextPage()}>Siguiente</button>
            </>
        )
    }

    const clearSearch = () => {
        setSearchState("");
        setSearchTittle("");
    }

    return (
        <>
            <div>
                <p>Filtros</p>
                <label htmlFor="filterGenre">Por genero</label>
                <select id="filterGenre" onChange={(e) => setGenreFilter(e.target.value)}>
                    <option value=""></option>
                    <option value="Aventura">Aventura</option>
                    <option value="JRPG">JRPG</option>
                    <option value="Accion">Accion</option>
                    <option value="Terror">Terror</option>
                    <option value="Plataformas">Plataformas</option>
                </select>
            </div>
            {games && gameNav()}
            {games && <p>Pagina: {page}</p>}
            <input value={searchTittle} onChange={(e) => setSearchTittle(e.target.value)}></input>
            <button onClick={() => clearSearch()}>Borrar</button>
            {searchState && <p>{searchState}</p>}
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
            {games.length <= 4 && <p>Fin de las entradas de juegos</p>}
            {games && gameNav()}
        </>)

}

export default GamesList;