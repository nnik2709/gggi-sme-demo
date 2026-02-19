import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import OfflineIndicator from './OfflineIndicator';
import './MobileLayout.css';

export default function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOffline, getLastSyncText } = useOffline();

  const navItems = [
    { path: '/mobile/dashboard', label: 'Home' },
    { path: '/mobile/survey', label: 'Survey' },
    { path: '/mobile/settings', label: 'Settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-layout">
      {/* Top Bar */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <h1 className="mobile-title">GGGI SME Database</h1>
          <OfflineIndicator />
        </div>
        {isOffline && (
          <div className="sync-status">
            Last synced: {getLastSyncText()}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mobile-content">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
