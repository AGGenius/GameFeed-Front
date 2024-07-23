import { Link } from "react-router-dom"
import Login from "./Login"

function Nav() {

    return (
      <>
        <nav>
            <h1>Game Rest</h1>    
            <Link to="/">Home</Link>
            <div>
                <Login />
            </div>
        </nav>
      </>
    )
  }
  
  export default Nav