import { useNavigate, Link } from 'react-router-dom'
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
          <li><Link to="/stations" className="nav-link">Stations</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin" className="nav-link">Admin</Link></li>}
          <li className="user-info">
            <span>{user?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
