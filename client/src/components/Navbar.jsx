import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    const fetchCount = async () => {
      try {
        const { data } = await API.get('/notifications/unread-count');
        setUnread(data.count);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: '64px',
    }}>
      <div className="container" style={{
        height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontWeight: 700, fontSize: '20px', color: 'var(--primary)' }}>
          Festiq
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user?.role !== 'admin' && (
            <Link to="/events" style={navLinkStyle}>Events</Link>
          )}

          {/* Regular user links only */}
          {user && user.role !== 'admin' && (
            <>
              <Link to="/my-bookings" style={navLinkStyle}>My Bookings</Link>
              {/* Bell icon */}
              <Link to="/notifications" style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unread > 0 && (
                  <span style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'var(--danger)', color: '#fff',
                    fontSize: '10px', fontWeight: 700,
                    width: '16px', height: '16px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <Link to="/admin" style={navLinkStyle}>Admin Dashboard</Link>
          )}

          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            background: 'var(--border)', border: 'none',
            borderRadius: '20px', padding: '6px 12px',
            fontSize: '14px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '14px',
  color: 'var(--text-secondary)',
  fontWeight: '500',
  transition: 'color 0.2s',
};