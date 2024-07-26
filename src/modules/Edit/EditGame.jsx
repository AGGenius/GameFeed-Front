import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function EditGame() {
    //Search
    const [gameId, setGameId] = useState("");
    const [game, setGame] = useState("");
    const [updateStatus, setUpadteStatus] = useState("");
    //Game values
    const [tittle, setTittle] = useState("");
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const [userId, setUserId] = useState("");
    const [active, setActive] = useState(false);

    const { user } = useUserContext();
    const navigate = useNavigate();
    const editGameUrl = "http://localhost:3000/api/games/";

    useEffect(() => {
        if (!localStorage.getItem("token") || (Object.keys(user).length !== 0 && user.type !== "admin")) { navigate("/"); }
    }, [user])

    useEffect(() => {
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
    }, [game])

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

            const response = await axios.put(editGameUrl+gameId, payload);
            setUpadteStatus(response.data.estado);
        }
    }

    const checkGame = async (e) => {
        e.preventDefault();

        const response = await axios.get(editGameUrl+gameId);

        if(response.data.estado) {
            setUpadteStatus(response.data.estado);
        } else {
            const newGame = response.data;
            console.log(response.data)
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
                    <input id="editGameActive" type="checkbox"  value={active ? active : false}  checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                    <button type="submit">Guardar cambios del juego</button>
                </form>
            }
            {updateStatus && <p>{updateStatus}</p>}
        </>
    )
}

export default EditGame;