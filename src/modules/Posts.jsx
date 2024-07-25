import {useLocation} from "react-router-dom";

function Posts () {

    const location = useLocation();
    const {game} = location.state;
    
    return (
        <>
        <h2>POSTS FOR {game && game.tittle}</h2>
        </>)

}

export default Posts;