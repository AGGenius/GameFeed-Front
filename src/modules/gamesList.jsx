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
    const [rowFilter, setRowFilter] = useState("id");
    const [orderFilter, setOrderFilter] = useState("ASC");

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

    const getGamesFiltered = async () => {
        try {
            const payload = {
                page,
                genreFilter,
                rowFilter,
                orderFilter
            }

            const complexUrl = getGamesUrl + "filter/";

            const response = await axios.post(complexUrl, payload);
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
                getGamesFiltered();
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGamesFiltered();
        getLikes();
    }, []);

    useEffect(() => {
        getGamesFiltered();
    }, [page]);
    
    useEffect(() => {
        if(page === 1) { getGamesFiltered(); }
        setPage(1);
    }, [orderFilter, rowFilter, genreFilter]);

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
            <h2>JUEGOS</h2>
            <p>Filtros</p>
            <label htmlFor="filterGenre">Por genero</label>
            <select id="filterGenre" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                <option value=""></option>
                <option value="Aventura">Aventura</option>
                <option value="JRPG">JRPG</option>
                <option value="Accion">Accion</option>
                <option value="Terror">Terror</option>
                <option value="Plataformas">Plataformas</option>
            </select>
            <label htmlFor="orderBy">Ordenar por</label>
            <select id="orderBy" value={rowFilter} onChange={(e) => setRowFilter(e.target.value)}>
                <option value="id">ID</option>
                <option value="tittle">Titulo</option>
                <option value="developer">Desarrolladora</option>
                <option value="release">Salida</option>
            </select>
            <div>
                <label htmlFor="option1">Ascendente</label>
                <input id="option1" type="radio" value="ASC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                <label htmlFor="option2">Descendente</label>
                <input id="option2" type="radio" value="DESC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
            </div>
            <button onClick={() => console.log("1")}>Filtrar</button>
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