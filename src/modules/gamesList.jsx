import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useGamesContext } from '../context/useGamesContext'
import { useUserContext } from "../context/useUserContext";
import './gamesList.css'

//Module to generate a paged list of games. The content can be filtered and you can search for any given tittle in the data base. 
//Custom buttons are generated in each game card to access the game posts, interact with links and edit the game.
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

    const genres = [
        "",
        "accion",
        "plataformas",
        "shooter",
        "lucha",
        "beat'em up",
        "sigilo",
        "supervivencia",
        "ritmo",
        "battle royale",
        "aventura",
        "metroidvania",
        "novela-visual",
        "puzzles",
        "jrpg",
        "rpg",
        "arpg",
        "mmorpg",
        "rts",
        "estrategia",
        "simulador de vida",
        "simulador de conduccion",
        "simulador",
        "deportes",
        "terror",
        "gacha",
        "casual"
    ];

    const rows = [
        "id",
        "tittle",
        "developer",
        "release"
    ];

    const getGamesUrl = "https://gamefeed-back.onrender.com/api/games/";

    const getLikes = async () => {
        try {
            const likesUrl = `https://gamefeed-back.onrender.com/api/likes/`;
            const response = await axios.get(likesUrl);
            const data = response.data;
            setLikes(data);
        } catch (error) {
            console.log(error);
        };
    };

    const getGamesFiltered = async () => {
        try {
            const complexUrl = getGamesUrl + `/filter?page=${page}&genreFilter=${genreFilter}&rowFilter=${rowFilter}&orderFilter=${orderFilter}`;

            const response = await axios.get(complexUrl);
            const newGames = response.data;
            setGames(newGames);
        } catch (error) {
            console.log(error);
        };
    };

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
                };
            } else if (searchTittle.length === 0) {
                getGamesFiltered();
            };
        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        getGamesFiltered();
        getLikes();
    }, []);

    useEffect(() => {
        getGamesFiltered();
    }, [page]);

    useEffect(() => {
        if (page === 1) { getGamesFiltered(); }
        setPage(1);
    }, [orderFilter, rowFilter, genreFilter]);

    useEffect(() => {
        getGamesByTittle();
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
        month = twoDigitsDate(month);

        let day = date.getDate().toString();
        day = twoDigitsDate(day);

        return month + '-' + day + '-' + year;
    };

    const sendLike = async (e) => {
        if (!token) { return };

        const user_id = user.id;
        const likes_id = e.target.value;
        const likesUrl = `https://gamefeed-back.onrender.com/api/likes/`;

        if (user_id && likes_id) {
            const payload = {
                user_id,
                likes_id,
            }

            const response = await axios.post(likesUrl, payload);
            const data = response.data;
            setLikes(data);
        };
    };

    const generateLikeButton = (game) => {
        const actualLike = likes.find((like) => like.id === game.id);

        if (token) {
            return (
                <>
                    {actualLike && <button className="games--gameCardButton" value={actualLike.id} onClick={(e) => sendLike(e)}>Likes: {actualLike.value} </button>}
                </>);
        };

        return (
            <>
                {actualLike && <button className="games--gameCardButton" disabled={true}>Likes: {actualLike.value} </button>}
            </>);
    };

    const generateEditButton = (game) => {
        if (user.type === "admin") {
            return (
                <>
                    <button className="games--gameCardButton" key={game.id} onClick={() => navigate(`/adminPage/editGame/${game.id}`)}>Edit</button>
                </>);
        } else if (user.type === "mod") {
            return (
                <>
                    <button className="games--gameCardButton" key={game.id} onClick={() => navigate(`/modPage/editGame/${game.id}`)}>Edit</button>
                </>);
        };
    };

    const goToPost = (game) => {
        navigate(`/posts/${game.id}`);
    };

    const nextPage = () => {
        if (games.length <= 4) { return; }

        const newPage = page + 1;
        setPage(newPage);
    };

    const prevPage = () => {
        if (page - 1 <= 0) { return }

        let newPage = page - 1;
        setPage(newPage);
    };

    const firstPage = () => {
        if (page === 1) { return };

        const newPage = 1;
        setPage(newPage);
    };

    const gameNav = () => {
        return (
            <div className="games--pageButtonsWrap">
                <button onClick={() => prevPage()}>&lt;</button>
                <button onClick={() => firstPage()}>pg1</button>
                <button onClick={() => nextPage()}>&gt;</button>
            </div>
        );
    };

    const clearSearch = () => {
        setSearchState("");
        setSearchTittle("");
    };

    return (
        <div className="games">
            <h2 className="games--tittle">JUEGOS</h2>
            <div className="games--filters">
                <h3 className="games--filtersTittle">Filtros</h3>
                <div className="games--filtersWrap">
                    <label htmlFor="filterGenre">Por genero</label>
                    <select id="filterGenre" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                        {genres && genres.sort().map((genre, i) => (
                            <option key={i} value={genre}>{genre}</option>
                        ))}
                    </select>
                    <label htmlFor="orderBy">Ordenar por</label>
                    <select id="orderBy" value={rowFilter} onChange={(e) => setRowFilter(e.target.value)}>
                        {rows && rows.map((row, i) => (
                            <option key={i} value={row}>{row}</option>
                        ))}
                    </select>
                    <label htmlFor="orderType">Orden</label>
                    <div id="orderType" className="game--filtersSelectors">
                        <label htmlFor="option1">ASC</label>
                        <input id="option1" type="radio" value="ASC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                        <label htmlFor="option2">DESC</label>
                        <input id="option2" type="radio" value="DESC" name="order" onChange={(e) => setOrderFilter(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="games--pageButtons">
                {games && gameNav()}
                {games && <p>Pagina: {page}</p>}
            </div>
            <div className="games--searchTittleWrap">
                <label htmlFor="searchByTittle">Buscar por titulo</label>
                <input id="searchByTittle" value={searchTittle} onChange={(e) => setSearchTittle(e.target.value)}></input>
                <button onClick={() => clearSearch()}>Borrar</button>
                {searchState && <p>{searchState}</p>}
            </div>
            <div className="games--gameCardWrap">
                {games ? games.map((game) =>
                (
                    <div className="games--gameCard" key={game.id}>
                        <div className="games--gameCardData">
                            <p>Titulo: <span>{game.tittle}</span></p>
                            <p>Genero principal: <span>{game.genre}</span></p>
                            <p>Desarrollador: <span>{game.developer}</span></p>
                            <p>Fechad de salida: <span>{getFormattedDate(game.release)}</span></p>
                        </div>
                        <div className="games--gameCardButtonsWrap">
                            <button className="games--gameCardButton" onClick={() => goToPost(game)}>Ver posts</button>
                            {likes && generateLikeButton(game)}
                            {generateEditButton(game)}
                        </div>
                    </div>
                ))
                    : <p>Cargando datos</p>
                }
                {games.length <= 4 && <p>Fin de las entradas de juegos</p>}
            </div>
            <div className="games--pageButtons">
                {games && <p>Pagina: {page}</p>}
                {games && gameNav()}
            </div>
        </div>)

}

export default GamesList;