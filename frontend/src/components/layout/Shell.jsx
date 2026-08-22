import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Luggage,
  Compass,
  Calendar as CalendarIcon,
  Users,
  User as UserIcon,
  Shield,
  Plus,
  Search,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { initials } from '../../utils/format';

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/trips', label: 'My Trips', icon: Luggage },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="mark">GT</div>
          <div className="word">GlobeTrotter</div>
        </div>

        <button
          className="btn btn-accent btn-block sidebar-cta"
          onClick={() => navigate('/trips/new')}
        >
          <Plus size={16} /> Plan New Trip
        </button>

        <nav className="nav-group">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-divider" />
        <nav className="nav-group">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Shield size={18} />
            <span>Admin Analytics</span>
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-divider" />
          <div
            className="sidebar-user"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            <div className="avatar">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.firstName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                initials(user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'GT')
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="u-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Traveler'}
              </div>
              <div className="u-role">
                {user?.email === 'admin@globetrotter.app' ? 'Administrator' : 'Explorer'}
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-block btn-sm"
            style={{ marginTop: '10px', color: '#cfe4e1', borderColor: 'rgba(255,255,255,.15)' }}
            onClick={handleLogout}
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="main-col">
        {/* Topbar */}
        <header className="topbar">
          <form className="search-wrap" onSubmit={handleSearchSubmit}>
            <Search size={16} />
            <input
              className="input"
              placeholder="Search destinations, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="topbar-right">
            <button
              className="icon-btn"
              title="Notifications"
              onClick={() => toast.info('You have 2 upcoming trip milestones this week!')}
            >
              <Bell size={17} />
              <span className="dot-badge" />
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/trips/new')}
            >
              <Plus size={15} /> Plan Trip
            </button>

            <div
              className="avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.firstName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                initials(user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'GT')
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
