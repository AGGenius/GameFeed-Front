import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home';
import Nav from './modules/Nav';
import { GamesProvider } from './context/useGamesContext';
import { UserProvider } from './context/useUserContext';

function App() {

  return (
    <>
      <Router>
        <GamesProvider>
          <UserProvider>
            {<Nav />}
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </UserProvider>
        </GamesProvider>
      </Router>
    </>
  )
}

export default App
