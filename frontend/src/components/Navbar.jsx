import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🎬</span>
          Filmu Rekomendacijos +
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meniu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          {user ? (
            <>
              <Link to="/movies" className={isActive('/movies')} onClick={closeMenu}>Filmai</Link>
              {(user.role === 'viewer' || user.role === 'admin' || user.role === 'moderator') && (
                <>
                  <Link to="/viewings" className={isActive('/viewings')} onClick={closeMenu}>Bendros peržiūros</Link>
                  <Link to="/recommendation" className={isActive('/recommendation')} onClick={closeMenu}>Rekomendacijos</Link>
                  <Link to="/ai-generate" className={isActive('/ai-generate')} onClick={closeMenu}>DI Generavimas</Link>
                  <Link to="/watchlist" className={isActive('/watchlist')} onClick={closeMenu}>Žiūrėjimo sąrašas</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-admin ${isActive('/admin')}`} onClick={closeMenu}>Administratorius</Link>
              )}
              {user.role === 'moderator' && (
                <Link to="/moderator" className={`nav-mod ${isActive('/moderator')}`} onClick={closeMenu}>Moderatorius</Link>
              )}
              <Link to="/profile" className={`nav-profile ${isActive('/profile')}`} onClick={closeMenu}>
                <span className="profile-icon">👤</span>
                {user.username}
              </Link>
              <button onClick={handleLogout} className="btn-logout">Atsijungti</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login" onClick={closeMenu}>Prisijungti</Link>
              <Link to="/register" className="btn-nav-register" onClick={closeMenu}>Užsiregistruoti</Link>
            </>
          )}
        </div>

        {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
