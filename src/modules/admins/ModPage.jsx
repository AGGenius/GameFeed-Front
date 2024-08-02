import { useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useUserContext } from "../../context/useUserContext";
import './ModPage.css'

//Mod module to be shown only when an admin user is logged. If accessed directly when no user is logged or not a valid type of user, redirects to the home page.
function ModPage() {
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (!localStorage.getItem("token") || user.type !== "mod") { navigate("/"); }
    }, [user])


    return (
        <>
            <div className="modPage">
                <Link to="/modPage/editGame">Edit Game</Link>
                <Link to="/modPage/editPost">Edit Post</Link>
            </div>
            <Outlet />
        </>)

}

export default ModPage;