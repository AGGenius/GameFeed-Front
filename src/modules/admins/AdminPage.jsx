import { useEffect } from "react";
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useUserContext } from "../../context/useUserContext";
import './AdminPage.css'

function AdminPage() {
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (!localStorage.getItem("token") || (Object.keys(user).length !== 0 && user.type !== "admin")) { navigate("/"); }
    }, [user])


    return (
        <>
            <div className="adminPage">
                <Link to="/adminPage/editGame">Edit Game</Link>
                <Link to="/adminPage/editPost">Edit Post</Link>
                <Link to="/adminPage/editUser">Edit User</Link>
            </div>
            <Outlet />
        </>)

}

export default AdminPage;