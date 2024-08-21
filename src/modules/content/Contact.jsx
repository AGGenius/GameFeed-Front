import { Link } from "react-router-dom";
import './Contact.css'

//Module to show contact information about web page creator.
function Contact() {
    return (
        <div className="contact">
            <h2 className="contact--title">Información de contacto y enlaces:</h2>
            <div className="contact--container">
                <p className="contact--text">Correo:&nbsp;</p>

                <Link to="#" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "mailto:adrianginergimenez@gmail.com";
                }} className="contact--link">
                    adrianginergimenez@gmail.com
                </Link>
            </div>
            <div className="contact--container">
                <p className="contact--text">LinkedIn:&nbsp;</p>
                <Link to="#" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://www.linkedin.com/in/aginergimenez/";
                }} className="contact--link">
                    www.linkedin.com/in/aginergimenez/
                </Link>
            </div>
            <div className="contact--container">
                <p className="contact--text">GitHub:&nbsp;</p>
                <Link to="#" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://github.com/AGGenius";
                }} className="contact--link">
                    github.com/AGGenius
                </Link>
            </div>
            <p className="contact--text">Portfolio Web: ¡Ya te encuentras allí! Explora la pagina web sin miedo</p>
            <div className="contact--container">
                <p className="contact--text"> Juegos de Android:&nbsp;</p>
                <Link to="#" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://play.google.com/store/apps/developer?id=Wild+Catta&hl=es";
                }} className="contact--link">
                    Wild Catta Google Play
                </Link>
            </div>
        </div>
    );
};

export default Contact