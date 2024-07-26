import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home';
import Nav from './modules/Nav';
import Register from './modules/Create/Register';
import AddGame from './modules/Create/AddGame';
import Profile from './modules/Profile';
import Posts from './modules/Posts';
import AddPost from './modules/Create/AddPost';
import AdminPage from './modules/admins/AdminPage';
import EditGame from './modules/Edit/EditGame';
import EditPost from './modules/Edit/EditPost';
import EditUser from './modules/Edit/EditUser';
import { GamesProvider } from './context/useGamesContext';
import { UserProvider } from "./context/useUserContext";

function App() {
  return (
    <>
      <Router>
        <GamesProvider>
          <UserProvider>
            {<Nav />}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/register' element={<Register />} />
              <Route path='/addGame' element={<AddGame />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/posts/:id' element={<Posts />} />
              <Route path='/addPost/:id' element={<AddPost />} />
              <Route path='/adminPage' element={<AdminPage />} >
                <Route path='/adminPage/editGame' element={<EditGame />} />
                <Route path='/adminPage/editPost' element={<EditPost />} />
                <Route path='/adminPage/editUser' element={<EditUser />} />
              </Route>
            </Routes>
          </UserProvider>
        </GamesProvider>
      </Router>
    </>
  )
}

export default App
