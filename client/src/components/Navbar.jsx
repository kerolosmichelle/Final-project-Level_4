import { useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="logo">🚇 MetroSync Live</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="/stations" className="nav-link">Stations</a></li>
          {user?.role === 'admin' && <li><a href="/admin" className="nav-link">Admin</a></li>}
          <li className="user-info">
            <span>{user?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
