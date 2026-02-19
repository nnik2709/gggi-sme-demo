import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import OfflineIndicator from './OfflineIndicator';
import './WebLayout.css';

export default function WebLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingSyncs } = useSME();

  const navItems = [
    { path: '/web/dashboard',     label: 'Dashboard' },
    { path: '/web/directory',     label: 'Directory' },
    { path: '/web/map',           label: 'Map' },
    { path: '/web/analytics',     label: 'Analytics' },
    { path: '/web/reports',       label: 'Reports' },
    { path: '/web/architecture',  label: 'Architecture' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => navigate('/web/login');

  return (
    <div className="web-layout">
      {/* Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">GGGI SME</h1>
          <p className="sidebar-subtitle">Database System</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <OfflineIndicator />
          {pendingSyncs > 0 && (
            <div className="sync-badge">
              {pendingSyncs} pending sync{pendingSyncs > 1 ? 's' : ''}
            </div>
          )}
          <div className="sidebar-divider" />
          <div className="sidebar-mode-links">
            <button className="btn-text small" onClick={() => navigate('/tablet/login')}>
              Tablet Survey App
            </button>
            <button className="btn-text small" onClick={() => navigate('/mobile/login')}>
              Mobile Field App
            </button>
          </div>
          <button className="btn-text" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="web-main">
        <Outlet />
      </div>
    </div>
  );
}
