import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function EditGame() {
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
    const navigate = useNavigate();
    const editGameUrl = "http://localhost:3000/api/games/";

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

            return month + '-' + day + '-' + year;
        };

        setTittle(game.tittle);
        setGenre(game.genre);
        setDeveloper(game.developer);
        setRelease(getFormattedDate(game.release));
        setUserId(game.user_id)
        setActive(game.active)
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
            setGameData();
        }   
    }, [gameId])

    const editGame = async (e) => {
        e.preventDefault();

        if (tittle && genre && developer && release && userId) {
            const payload = {
                tittle,
                genre,
                developer,
                release,
                user_id: userId,
                active
            }

            const response = await axios.put(editGameUrl + gameId, payload);
            setGame("");
            setUpadteStatus(response.data.estado);
        }
    }

    const deleteGame = async () => {
        const confirmation = await confirm("Confirma para borrar la entrada del juego");

        if (confirmation) {
            const response = await axios.delete(editGameUrl + gameId);
            setGame("");
            setUpadteStatus(response.data.estado);
        }
    }

    const checkGame = async (e) => {
        if(e) { e.preventDefault(); }   

        const response = await axios.get(editGameUrl + gameId);

        if (response.data.estado) {
            setUpadteStatus(response.data.estado);
            setGame("");
        } else {
            const newGame = response.data;
            setGame(newGame[0]);
            setUpadteStatus("");
        }
    }

    return (
        <>
            <div>
                <form onSubmit={checkGame}>
                    <label htmlFor="searchGame">ID del juego</label>
                    <input id="searchGame" type="number" value={gameId} onChange={(e) => setGameId(e.target.value)}></input>
                    <button type="submit">Traer juego</button>
                </form>
            </div>
            {game &&
                <div>
                    <form onSubmit={editGame}>
                        <label htmlFor="editGameTittle">Titulo</label>
                        <input id="editGameTittle" type="text" value={tittle ? tittle : ""} onChange={(e) => setTittle(e.target.value)}></input>
                        <label htmlFor="editGameGenre">Genero</label>
                        <input id="editGameGenre" type="text" value={genre ? genre : ""} onChange={(e) => setGenre(e.target.value)}></input>
                        <label htmlFor="editGameDeveloper">Desarrollador</label>
                        <input id="editGameDeveloper" type="text" value={developer ? developer : ""} onChange={(e) => setDeveloper(e.target.value)}></input>
                        <label htmlFor="editGameRelease">Fecha de salida</label>
                        <input id="editGameRelease" type="text" value={release ? release : ""} onChange={(e) => setRelease(e.target.value)}></input>
                        <label htmlFor="editGameUserId">ID de usuario creador</label>
                        <input id="editGameUserId" type="text" value={userId ? userId : ""} onChange={(e) => setUserId(e.target.value)}></input>
                        <label htmlFor="editGameActive">Estado</label>
                        <input id="editGameActive" type="checkbox" value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                        <button type="submit">Guardar cambios del juego</button>
                    </form>
                    <button onClick={deleteGame}>Borrar juego</button>
                </div>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </>
    )
}

export default EditGame;