import { useEffect, useState } from "react";
import { useUserContext } from "../../context/useUserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Profile.css'

//Module to generate a the profile page for a logged user. Shows his user data.
const Profile = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [token, setToken] = useState("");
    const [userGames, setUserGames] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [likes, setLikes] = useState([]);

    const getGamesUrl = "https://gamefeed-back.onrender.com/api/games/user/";
    const getPostsUrl = "https://gamefeed-back.onrender.com/api/posts/user/";
    const getLikesUrl = "https://gamefeed-back.onrender.com/api/likes/user/";

    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
        getLikes();
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        if (!localStorage.getItem("token")) { navigate("/"); }
        getUserGames();
        getUserPosts();
        getUserLikes();
    }, [user, likes])

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

    const getUserGames = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getGamesUrl + user.id);
                const data = response.data;
                setUserGames(data);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    const getUserPosts = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getPostsUrl + user.id);
                const data = response.data;
                setUserPosts(data);
            } catch (error) {
                //console.log(error);
            };
        };
    };

    const getUserLikes = async () => {
        if (user.id) {
            try {
                const response = await axios.get(getLikesUrl + user.id);
                const data = response.data;
                setUserLikes(data);
            } catch (error) {
                //console.log(error);
            };
        };
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

    const generateLikeButton = (type, element) => {
        let actualLike;
        let button;

        if (type === "game") {
            actualLike = likes.find((like) => like.id === element.id);
        } else if (type === "post") {
            actualLike = likes.find((like) => like.post_id === element.id);
        };

        if (actualLike) {
            userLikes.forEach(like => {
                if (actualLike.id === like.likes_id && like.user_id === user.id) {
                    button = <button className="profile--removeLikeButton" value={actualLike.id} onClick={(e) => sendLike(e)}>Remove Like</button>;
                };
            });
        };

        if (token) {
            return (
                <>
                    {button}
                </>);
        };
    };

    return (
        <div className="profile">
            <h2 className="profile--tittle">Te encuentras en tu perfil, {user.name}</h2>
            <div className="profile--userData">
                <h3>Información de usuario</h3>
                <p className="profile--text profile--name">Nombre: <span>{user.name}</span></p>
                <p className="profile--text profile--email">Correo: <span>{user.email}</span></p>
                <p className="profile--text profile--nick">Nick: <span>{user.nick}</span></p>
            </div>
            <div className="profile--userStats">
                <h3>Estadisticas de usuario</h3>
                <p className="profile--text">Juegos creados: <span>{userGames ? userGames.length : "0"}</span></p>
                <p className="profile--text">Post creados: <span>{userPosts ? userPosts.length : "0"}</span></p>
                <p className="profile--text">Likes enviados: <span>{userLikes ? userLikes.length : "0"}</span></p>
            </div>
            <div className="profile--userGames">
                <h3>Juegos creados</h3>
                {userGames.length > 0 ? userGames.map((game, index) =>
                (
                    <div className="profile--gameCard" key={game.id}>
                        <p className="profile--text"><span>{index + 1}:</span> {game.tittle}</p>
                        {likes && generateLikeButton("game", game)}
                    </div>
                ))
                    : <p>Sin juegos creados</p>
                }
            </div>
            <div className="profile--userPosts">
                <h3>Posts creados</h3>
                {userPosts.length > 0 ? userPosts.map((post, index) =>
                (
                    <div className="profile--postCard" key={post.id}>
                        <div className="profile--postCardData">
                            <p className="profile--text"><span>{post.post_type}:</span> {post.content}</p>
                            {likes && generateLikeButton("post", post)}
                        </div>
                    </div>
                ))
                    : <p>Sin posts creados</p>
                }
            </div>
        </div>
    );
};

export default Profile;