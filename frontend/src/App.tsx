import './App.css'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import { Signup } from './pages/signup';
import { Login } from './pages/login';
import { Home } from './pages/Home';
function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="h-screen bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Home/> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/setting" element={<div>Setting</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
