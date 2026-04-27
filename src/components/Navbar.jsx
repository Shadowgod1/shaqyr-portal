import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-dot" />
        <span style={{fontFamily:"'Playfair Display', serif", fontWeight:800}}>Sha<span className="gradient-text">qyr</span></span>
      </Link>
      
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard" className={`btn btn-ghost ${loc.pathname === '/dashboard' ? 'active' : ''}`}>
              <LayoutDashboard size={16}/> Мои события
            </Link>
            <div className="user-profile-nav">
              <div className="user-avatar-sm">
                <User size={14} />
              </div>
              <span className="user-email-nav">{user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn-icon-logout" title="Выйти">
                <LogOut size={16}/>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              <LogIn size={16}/> Войти
            </Link>
            <Link to="/register" className="btn btn-primary">
              <UserPlus size={16}/> Начать
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
