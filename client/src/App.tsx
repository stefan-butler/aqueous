import './App.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import Home from './pages/home';
import Report from './pages/report';
import Chat from './pages/chat';
import Incidents from './pages/incidents';

function App() {

  const [isReporter, setIsReporter] = useState(false);

  return (
    <>
    <Router>
      <Navbar isReporter={isReporter} setIsReporter={setIsReporter} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report/>} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/incidents" element={<Incidents isReporter={isReporter} />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
