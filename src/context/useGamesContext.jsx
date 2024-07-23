import { createContext, useState, useContext } from "react";

const GamesContext = createContext();

export const GamesProvider = ({children}) => {
    const [games, setGames] = useState([]);

    return (
        <GamesContext.Provider value={{games, setGames}}>
            {children}
        </GamesContext.Provider>
    );
};

export const useGamesContext = () => {
    return useContext(GamesContext);
}