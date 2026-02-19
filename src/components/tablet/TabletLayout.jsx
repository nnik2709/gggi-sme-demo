import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './tablet.css';

export default function TabletLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const rawEnum   = sessionStorage.getItem('tablet_enumerator');
  const enumerator = rawEnum ? JSON.parse(rawEnum) : { id: 'DEMO', name: 'Demo User', province: 'National Capital District' };

  const handleLogout = () => {
    sessionStorage.removeItem('tablet_enumerator');
    navigate('/tablet/login');
  };

  const isSurvey = location.pathname.includes('/tablet/survey');

  return (
    <div className="tablet-app">
      {/* Portrait rotation hint */}
      <div className="tablet-rotate-hint">
        <div className="tablet-rotate-hint-icon"></div>
        <div className="tablet-rotate-hint-text">Please rotate your tablet to landscape mode</div>
      </div>

      {/* Sidebar */}
      <aside className="tablet-sidebar">
        <div className="tablet-sidebar-header">
          <div className="tablet-logo">GGGI PNG · SMEC</div>
          <div className="tablet-app-name">SME Survey</div>
          <div className="tablet-app-sub">Field Data Collection v1.0</div>
        </div>

        <div className="tablet-enumerator">
          <div className="enum-avatar" />
          <div>
            <div className="enum-name">{enumerator.name}</div>
            <div className="enum-role">{enumerator.province}</div>
          </div>
        </div>

        <nav className="tablet-nav">
          <button
            className={`tablet-nav-item ${location.pathname === '/tablet/dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/tablet/dashboard')}
          >
            <span className="nav-label">Dashboard</span>
          </button>

          {isSurvey && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '6px 0' }} />
              <div style={{ fontSize: 10, opacity: .7, padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Survey Steps
              </div>
            </>
          )}

          <button
            className={`tablet-nav-item ${location.pathname.includes('survey/review') ? 'active' : ''}`}
            onClick={() => isSurvey && navigate('/tablet/survey/review')}
            style={!isSurvey ? { opacity: .4 } : {}}
          >
            <span className="nav-label">Review &amp; Submit</span>
          </button>
        </nav>

        <div className="tablet-sidebar-footer">
          <div className="sync-status">
            <div className="sync-dot" />
            <span>Online · Last sync 2 min ago</span>
          </div>
          <div className="queue-badge">Queue: 0 pending</div>
          <button
            className="t-btn t-btn-secondary"
            style={{ fontSize: 12, padding: '8px 14px', minHeight: 36 }}
            onClick={() => navigate('/web/dashboard')}
          >
            Web Dashboard
          </button>
          <button
            className="t-btn t-btn-ghost"
            style={{ fontSize: 12, padding: '6px 14px', minHeight: 34 }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="tablet-main">
        <Outlet />
      </main>
    </div>
  );
}
