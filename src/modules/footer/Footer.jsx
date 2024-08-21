import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import './Footer.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Footer() {
    const [token, setToken] = useState("");

    useEffect(() => {
    }, []);

    return (
        <footer className="footer">
            <nav className="footer--nav">
                <Link className="footer--navLink" to="/about" >Sobre mi</Link>
                <Link className="footer--navLink" to="/contact" >Contacto</Link>
            </nav>
        </footer>
    );
};

export default Footer