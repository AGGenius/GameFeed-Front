import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';

const AddGame = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            tittle: "", genre: "", developer: "", release: ""
        }
    });

    const [createStatus, setCreateStatus] = useState("");
    const { user } = useUserContext();
    const navigate = useNavigate();
    const addGameURL = "http://localhost:3000/api/games/create/";

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

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    const createGame = async (data) => {
        if (data) {
            const payload = {
                tittle: data.tittle,
                genre: data.genre,
                developer: data.developer,
                release: data.release,
                user_id: user.id
            }

            try {
                const response = await axios.post(addGameURL, payload);
            
                setCreateStatus(response.data.estado);
            } catch (error) {
                const errors = error.response.data.errors;

                errors.map((error) => {
                    if (error.path == "tittle" && error.msg === `The game  ${data.tittle} already exists.`) {
                        setCreateStatus("El juego que se intenta añadir ya existe.");
                    };
                });
            };
        };
    };

    return (
        <>
            <form onSubmit={handleSubmit((data) => createGame(data))}>
                <label htmlFor="createGameTittle">Titulo</label>
                <input id="createGameTittle" type="text" {...register("tittle", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                {errors.tittle?.message && <p>{errors.tittle?.message}</p>}
                <label htmlFor="createGameGenre">Genero</label>
                <select id="createGameGenre" {...register("genre", { required: { value: true, message: "Se debe introducir el genero." } })}>
                    {genres && genres.sort().map((genre, i) => (
                        <option key={i} value={genre}>{genre}</option>
                    ))}
                </select>
                {errors.genre?.message && <p>{errors.genre?.message}</p>}
                <label htmlFor="createGameDevelopa">Desarrollador</label>
                <input id="createGameDevelopa" type="text" {...register("developer", { required: { value: true, message: "Se debe introducir el desarrollador." } })}></input>
                {errors.developer?.message && <p>{errors.developer?.message}</p>}
                <label htmlFor="createGameRelease">Fecha de salida</label>
                <input id="createGameRelease" type="text" defaultValue={"YYYY-MM-DD"} {...register("release", { required: { value: true, message: "Se debe introducir la fecha de salida," }})}></input>
                {errors.release?.message && <p>{errors.release?.message}</p>}
                <button type="submit">Crear juego</button>
            </form>
            {createStatus && <p>{createStatus}</p>}
        </>
    )
}

export default AddGame;