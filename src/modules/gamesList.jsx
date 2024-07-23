import { useEffect } from "react";
import axios from 'axios';
import {useGamesContext} from '../context/useGamesContext'

const GamesList = () => {
    const {games, setGames} = useGamesContext();
    const url = "http://localhost:3000/api/games";

    useEffect(() => {
        const getGames = async () => {
            if(getGames.length < 1){
                const response = await axios.get(url);
                const newGames = response.data;
                
                setGames(newGames);
            } 
        }

        getGames();
    }, []);

    return (
    <>
    {games && games.map((game) => 
    (
        <div key={game.tittle}>
            <p>{game.tittle}</p>
        </div>
    ))}
    </>)

}

export default GamesList;