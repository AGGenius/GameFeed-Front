import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home';
import Nav from './modules/Nav';
import { GamesProvider } from './context/useGamesContext';

function App() {

  return (
    <>
    <Router>
      <GamesProvider>
      {<Nav />}
      <Routes>
          <Route path='/' element={<Home />} />
      </Routes>
      </GamesProvider>
    </Router>
    </>
  )
}

export default App
