import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import './EditGame.css'

function EditGame() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            gameId: 0, tittle: "", genre: "", developer: "", release: "", user_id: "", state: ""
        }
    });
    const navigate = useNavigate();

    //Direct Link
    const { id } = useParams()
    //Search
    const [gameId, setGameId] = useState("");
    const [game, setGame] = useState("");
    const [updateStatus, setUpadteStatus] = useState("");
    //Post values
    const [tittle, setTittle] = useState("");
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [userId, setUserId] = useState("");
    const [active, setActive] = useState(false);

    const { user } = useUserContext();
    const editGameUrl = "https://gamefeed-back.onrender.com/api/games/";

    const genres = [
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

    function setGameData() {
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

            return year + '-' + month + '-' + day;
        };

        const formatedData = getFormattedDate(game.release);

        setTittle(game.tittle);
        setGenre(game.genre);
        setDeveloper(game.developer);
        setRelease(formatedData);
        setUserId(game.user_id)
        setActive(game.active)

        reset({ tittle: game.tittle, genre: game.genre, developer: game.developer, release: formatedData, user_id: game.userId, state: game.active })
    }

    useEffect(() => {
        if (id) {
            setGameId(id);
        }
    }, [])

    useEffect(() => {
        if (!localStorage.getItem("token") || (user.type !== "admin" && user.type !== "mod")) { navigate("/"); }
    }, [user])

    useEffect(() => {
        setGameData();
    }, [game])

    useEffect(() => {
        if(gameId) {
            checkGame();
        }
    }, [gameId])

    const editGame = async (data) => {
        if (data) {
            const payload = {
                tittle: data.tittle,
                genre: data.genre,
                developer: data.developer,
                release: data.release,
                user_id: data.user_id,
                active: data.state
            }

            try {
                const response = await axios.put(editGameUrl + gameId, payload);
                setGame("");
                setUpadteStatus(response.data.estado);
            } catch (error) {
                console.log(error)
                setUpadteStatus("");
            }
        }
    }

    const deleteGame = async () => {
        const confirmation = await confirm("Confirma para borrar la entrada del juego");

        if (confirmation) {
            const response = await axios.delete(editGameUrl + gameId);
            setGame("");
            setUpadteStatus(response.data.estado);
        };
    };

    const checkGame = async (e) => {
        if(e) { e.preventDefault(); };

        const response = await axios.get(editGameUrl + gameId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setGame("");
        } else {
            const newGame = response.data;
            setGame(newGame[0]);
            setUpadteStatus("");
        };
    };

    return (
        <div className="editGame">
            <h2 className="editGame--tittle">Pagina de edición de juegos</h2>
            <div className="editGame--searchFormWrap">
                <form className="editGame--searchForm" onSubmit={checkGame}>
                    <label htmlFor="searchGame">ID del juego</label>
                    <input id="searchGame" type="number" value={gameId} onChange={(e) => setGameId(e.target.value)}></input>
                    <button className="editGame--searchFormButton" type="submit">Traer juego</button>
                </form>
            </div>
            {game &&
                <div className="editGame--editFormWrap">
                    <form className="editGame--editForm" onSubmit={handleSubmit((data) => editGame(data))}>
                        <label htmlFor="editGameTittle">Titulo</label>
                        <input id="editGameTittle" type="text" {...register("tittle", { required: { value: true, message: "Se debe introducir el titulo." } })} value={tittle ? tittle : ""} onChange={(e) => setTittle(e.target.value)}></input>
                        {errors.tittle?.message && <p className="editGame--editFormError">{errors.tittle?.message}</p>}
                        <label htmlFor="editGameGenre">Genero</label>
                        <select id="filterGenre" {...register("genre", { required: { value: true, message: "Se debe introducir el genero." } })} value={genre ? genre : ""} onChange={(e) => setGenre(e.target.value)}>
                            {genres && genres.sort().map((genre, i) => (
                                <option key={i} value={genre}>{genre}</option>
                            ))}
                        </select>
                        {errors.genre?.message && <p className="editGame--editFormError">{errors.genre?.message}</p>}
                        <label htmlFor="editGameDeveloper">Desarrollador</label>
                        <input id="editGameDeveloper" type="text" {...register("developer", { required: { value: true, message: "Se debe introducir el desarrollador." } })} value={developer ? developer : ""} onChange={(e) => setDeveloper(e.target.value)}></input>
                        {errors.developer?.message && <p className="editGame--editFormError">{errors.developer?.message}</p>}
                        <label htmlFor="editGameRelease">Fecha de salida</label>
                        <input id="editGameRelease" type="date" {...register("release", { required: { value: true, message: "Se debe introducir el la fecha de salida con formato YYYY-MM-DD." } })} value={release ? release : ""} onChange={(e) => setRelease(e.target.value)}></input>
                        {errors.release?.message && <p className="editGame--editFormError">{errors.release?.message}</p>}
                        <label htmlFor="editGameUserId">ID de usuario creador</label>
                        <input id="editGameUserId" type="text" {...register("user_id", { required: { value: true, message: "Se debe introducir el id del usuario original." } })} value={userId ? userId : ""} onChange={(e) => setUserId(e.target.value)}></input>
                        {errors.user_id?.message && <p className="editGame--editFormError">{errors.user_id?.message}</p>}
                        <label htmlFor="editGameActive">Estado</label>
                        <input id="editGameActive" type="checkbox" {...register("state")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        <button className="addGame--editFormButton" type="submit">Guardar cambios</button>
                    </form>
                    <button className="editGame--deleteButton" onClick={deleteGame}>Borrar juego</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </div>
    )
}

export default EditGame;