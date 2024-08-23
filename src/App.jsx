import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamesList from './modules/content/GamesList';
import Nav from './modules/nav/Nav';
import Register from './modules/create/Register';
import AddGame from './modules/create/AddGame';
import Profile from './modules/content/Profile';
import Posts from './modules/content/Posts';
import AddPost from './modules/create/AddPost';
import Footer from './modules/footer/Footer';
import About from './modules/content/About';
import Contact from './modules/content/Contact';
//Admin & Mod
import AdminPage from './modules/admins/AdminPage';
import EditGame from './modules/edit/EditGame';
import EditPost from './modules/edit/EditPost';
import EditUser from './modules/edit/EditUser';
//Mod
import ModPage from './modules/admins/ModPage';
//Context
import { GamesProvider } from './context/useGamesContext';
import { UserProvider } from './context/useUserContext';
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
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
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
              {<Footer />}
          </UserProvider>
        </GamesProvider>
      </Router>
    </>
  );
};

export default App
