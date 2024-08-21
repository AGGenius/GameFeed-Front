import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamesList from './modules/content/GamesList.jsx';
import Nav from './modules/nav/Nav.jsx';
import Register from './modules/create/Register.jsx';
import AddGame from './modules/create/AddGame.jsx';
import Profile from './modules/content/Profile.jsx';
import Posts from './modules/content/Posts.jsx';
import AddPost from './modules/create/AddPost.jsx';
import Footer from './modules/footer/Footer.jsx';
import About from './modules/content/About.jsx';
import Contact from './modules/content/Contact.jsx';
//Admin & Mod
import AdminPage from './modules/admins/AdminPage.jsx';
import EditGame from './modules/edit/EditGame.jsx';
import EditPost from './modules/edit/EditPost.jsx';
import EditUser from './modules/edit/EditUser.jsx';
//Mod
import ModPage from './modules/admins/ModPage.jsx';
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
