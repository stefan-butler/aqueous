import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import Home from './pages/home';
import Report from './pages/report';
import Chat from './pages/chat';
import Incidents from './pages/incidents';
import Login from './pages/login';
import Register from './pages/register';

function App() {


  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report/>} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/incidents" element={<Incidents />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
