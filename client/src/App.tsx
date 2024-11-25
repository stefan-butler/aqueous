import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import Home from './pages/home';
import Report from './pages/report';
import Chat from './pages/chat';

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report/>} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
