import { Link } from "react-router-dom";
import './About.css'

//Module to show information about webpage creator.
function About() {
    return (
        <div className="about">
            <h2 className="about--title">Así que quieres saber cosas sobre el creador de este proyecto...</h2>
            <h3 className="about--subtitle">Adelante, te cuento un poco sobre mi:</h3>
            <p className="about--text">
                Soy Adrián Giner Giménez, programador con conocimientos de lenguajes de programación JavaScript, C#, Java, Python, 
                y tecnologías como HTML, CSS, SQL, PostgreSQL, MongoDB, Unity3D, Git, React.js, Node.js, ampliando mis conocimientos 
                en estas y otras tecnologías cada día.
            </p>
            <p className="about--text">
                Mi pasión por los videojuegos, lectura, dibujo y rompecabezas se resume en un carácter creativo, 
                con gran capacidad de enfoque y predilección por resolver situaciones que requieren de solución.
            </p>
            <p className="about--text">
                Actualmente me encuentro en búsqueda de una empresa donde desarrollar mis capacidades y poner a prueba 
                mis conocimientos en el campo de la programación, ya sea en el front-end, back-end, diseño, o realización de pruebas.
                Tengo predisposición a todos los campos y no me cierro a especializarme en el que más despierte mi interes.
            </p>
            <p className="about--text">
                Gracias por tu tiempo.
            </p>
            <Link to="/contact" className="about--text about--link">¡Si quieres conocer un poco mas de mi no dudes en echar un vistazo al contenido de este enlace!</Link>
        </div>
    );
};

export default About