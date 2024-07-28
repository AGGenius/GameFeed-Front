import { useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useUserContext } from "../../context/useUserContext";

function ModPage() {
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (!localStorage.getItem("token") || user.type !== "mod") { navigate("/"); }
    }, [user])


    return (
        <>
            <div>
                <Link to="/modPage/editGame">Edit Game</Link>
                <Link to="/modPage/editPost">Edit Post</Link>
            </div>
            <Outlet />
        </>)

}

export default ModPage;