import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import StationList from './pages/StationList'
import StationDetail from './pages/StationDetail'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <Router>
      <div className="app-container">
        {token && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={!token ? <Login setToken={setToken} setUser={setUser} /> : <Navigate to="/stations" />} />
          <Route path="/register" element={!token ? <Register setToken={setToken} setUser={setUser} /> : <Navigate to="/stations" />} />
          <Route path="/stations" element={token ? <StationList /> : <Navigate to="/login" />} />
          <Route path="/stations/:id" element={token ? <StationDetail /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/stations" />} />
          <Route path="/" element={<Navigate to={token ? "/stations" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}
