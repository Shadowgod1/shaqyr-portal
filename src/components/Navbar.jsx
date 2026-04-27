import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const loc = useLocation();
  return (
    <nav className="navbar glass">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-dot" />
        <span style={{fontFamily:"'Playfair Display', serif", fontWeight:800}}>Sha<span className="gradient-text">qyr</span></span>
      </Link>
      <div className="navbar-links">
        {loc.pathname !== '/dashboard' && (
          <Link to="/dashboard" className="btn btn-ghost" style={{padding:'9px 18px'}}>
            <LayoutDashboard size={16}/> Мои события
          </Link>
        )}
        <Link to="/login" className="btn btn-ghost" style={{padding:'9px 18px'}}>
          <LogIn size={16}/> Войти
        </Link>
        <Link to="/register" className="btn btn-primary" style={{padding:'9px 18px'}}>
          <UserPlus size={16}/> Начать
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
