import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddGame = () => {
    const [tittle, setTittle] = useState("");
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [release, setRelease] = useState("");
    const {user} = useUserContext();
    const navigate = useNavigate();
    const addGameURL = "http://localhost:3000/api/games/create/";

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, [])

    const createGame = async (e) => {
        e.preventDefault();

        if (tittle && genre && developer && release) {

            const payload = {
                tittle,
                genre,
                developer,
                release,
                user_id: user.id
            }

            await axios.post(addGameURL, payload);            
            navigate("/");
        }
    }

    return (
        <>
            <form onSubmit={createGame}>
                <label htmlFor="newGameTittle">Titulo</label>
                <input id="newGameTittle" type="text" value={tittle} onChange={(e) => setTittle(e.target.value)}></input>
                <label htmlFor="newGameGenre">Genero</label>
                <input id="newGameGenre" type="text" value={genre} onChange={(e) => setGenre(e.target.value)}></input>
                <label htmlFor="newGameDeveloper">Desarrollador</label>
                <input id="newGameDeveloper" type="text" value={developer} onChange={(e) => setDeveloper(e.target.value)}></input>
                <label htmlFor="newGameRelease">Fecha de salida</label>
                <input id="newGameRelease" type="text" value={release} onChange={(e) => setRelease(e.target.value)}></input>
                <button type="submit">Añadir juego</button>
            </form>
        </>
    )
}

export default AddGame;