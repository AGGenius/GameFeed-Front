import { Link } from "react-router-dom"

function Nav() {

    return (
      <>
        <nav>
            <h1>Game Rest</h1>    
            <Link to="/">Home</Link>
            <div>
                <form>
                    <label htmlFor="userName">Usuario</label>
                    <input id="userName" type="text"></input>
                    <label htmlFor="userPass">Contraseña</label>
                    <input id="userPass" type="password"></input>
                </form>
            </div>
        </nav>
      </>
    )
  }
  
  export default Nav