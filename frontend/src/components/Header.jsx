import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, isLoggedIn, clearSession } from '../utils/auth';

function shouldHideHeaderForAdmin(location, user) {
  if (!user || user.role !== 'Admin') return false;
  const { pathname } = location;
  if (pathname === '/dashboard' || pathname === '/users' || pathname === '/create' || pathname === '/profile' || pathname === '/settings') {
    return true;
  }
  return pathname.startsWith('/update/');
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logged = isLoggedIn();
  const user = getUser();

  if (shouldHideHeaderForAdmin(location, user)) {
    return null;
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <nav className="main-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          ClariGo
        </Link>

        <div className="header-actions">
          {logged && user ? (
            <>
              <span className="user-name">{user.name}</span>
              <span className="role-badge">{user.role}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-btn nav-btn-light" to="/login">
                Login
              </Link>
              <Link className="nav-btn nav-btn-dark" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
