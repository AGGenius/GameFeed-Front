import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamesList from "./modules/gamesList";
import Nav from './modules/Nav';
import Register from './modules/Create/Register';
import AddGame from './modules/Create/AddGame';
import Profile from './modules/Profile';
import Posts from './modules/Posts';
import AddPost from './modules/Create/AddPost';
//Admin & Mod
import AdminPage from './modules/admins/AdminPage';
import EditGame from './modules/Edit/EditGame';
import EditPost from './modules/Edit/EditPost';
import EditUser from './modules/Edit/EditUser';
//Mod
import ModPage from './modules/admins/ModPage';
//Context
import { GamesProvider } from './context/useGamesContext';
import { UserProvider } from "./context/useUserContext";
import './App.css';

//Base module with all the main routes logics.
function App() {
  return (
    <>
      <Router>
        <GamesProvider>
          <UserProvider>
            {<Nav />}
            <Routes>
              <Route path='/' element={<GamesList />} />
              <Route path='/register' element={<Register />} />
              <Route path='/addGame' element={<AddGame />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/posts/:id' element={<Posts />} />
              <Route path='/addPost/:id' element={<AddPost />} />
              <Route path='/adminPage' element={<AdminPage />} >
                <Route path='/adminPage/editGame' element={<EditGame />} />
                <Route path='/adminPage/editGame/:id' element={<EditGame />} />
                <Route path='/adminPage/editPost' element={<EditPost />} />
                <Route path='/adminPage/editPost/:id' element={<EditPost />} />
                <Route path='/adminPage/editUser' element={<EditUser />} />
                <Route path='/adminPage/editUser/:id' element={<EditUser />} />
              </Route>
              <Route path='/modPage' element={<ModPage />} >
                <Route path='/modPage/editGame' element={<EditGame />} />
                <Route path='/modPage/editGame/:id' element={<EditGame />} />
                <Route path='/modPage/editPost' element={<EditPost />} />
                <Route path='/modPage/editPost/:id' element={<EditPost />} />
              </Route>
            </Routes>
          </UserProvider>
        </GamesProvider>
      </Router>
    </>
  );
};

export default App
