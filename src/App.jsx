import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import MainApp from './components/MainApp'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<MainApp />} />
    </Routes>
  )
}

export default App
