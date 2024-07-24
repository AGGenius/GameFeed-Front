import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home';
import Nav from './modules/Nav';
import Register from './modules/Register';
import AddGame from './modules/AddGame';
import Profile from './modules/Profile';
import axios from 'axios';
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
            </Routes>
          </UserProvider>
        </GamesProvider>
      </Router>
    </>
  )
}

export default App
