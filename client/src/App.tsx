import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Navbar from './components/navbar'
import Home from './pages/home';
import Report from './pages/report';
import Chat from './pages/chat';
import Incidents from './pages/incidents';
import Login from './pages/login';
import Register from './pages/register';
import ResponderRoute from './responderRoute';
import UserRoute from './userRoute';

function App() {


  return (
    <>
    <Router>
      <Navbar />
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTES */}
        <Route element={<ResponderRoute />}>
          <Route path="/incidents" element={<Incidents />}/>
        </Route>

        {/* Non-Responder Protected Route */}
        <Route element={<UserRoute/>}>
          <Route path="/report" element={<Report/>} />
        </Route>

      </Routes>
    </Router>
    </>
  )
}

export default App
