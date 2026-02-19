import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import { useOffline } from '../../context/OfflineContext';
import './MobileDashboard.css';

export default function MobileDashboard() {
  const navigate = useNavigate();
  const { surveysCompleted, pendingSyncs } = useSME();
  const { isOffline, toggleOffline, getLastSyncText } = useOffline();

  const dailyTarget = 8;
  const progress = Math.min((surveysCompleted / dailyTarget) * 100, 100);

  return (
    <div className="mobile-dashboard">
      <div className="dashboard-welcome">
        <h2>Hello, Rose!</h2>
        <p className="text-secondary">Today's Survey Progress</p>
      </div>

      {/* Progress Card */}
      <div className="card progress-card">
        <div className="progress-header">
          <div>
            <h3>{surveysCompleted} / {dailyTarget}</h3>
            <p className="text-secondary">Surveys Completed</p>
          </div>
          <div className="progress-percentage">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Offline Status Card */}
      <div className="card status-card">
        <div className="status-header">
          <div>
            <h4>Connection Status</h4>
            <p className="text-secondary">
              {isOffline ? 'Working in offline mode' : 'Connected to server'}
            </p>
          </div>
          <button
            className={`status-toggle ${isOffline ? 'offline' : 'online'}`}
            onClick={toggleOffline}
          >
            {isOffline ? 'Offline' : 'Online'}
          </button>
        </div>

        {isOffline && pendingSyncs > 0 && (
          <div className="sync-alert">
            <span className="sync-icon">!</span>
            <div>
              <p className="sync-count">{pendingSyncs} survey{pendingSyncs > 1 ? 's' : ''} pending sync</p>
              <p className="text-secondary text-sm">Will sync when back online</p>
            </div>
          </div>
        )}

        <div className="last-sync">
          Last synced: {getLastSyncText()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-grid">
          <button
            className="action-card"
            onClick={() => navigate('/mobile/survey')}
          >
            <span className="action-label">New Survey</span>
          </button>

          <button className="action-card">
            <span className="action-label">View Stats</span>
          </button>

          <button className="action-card">
            <span className="action-label">Map View</span>
          </button>

          <button className="action-card">
            <span className="action-label">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <p className="activity-title">Goroka Coffee Beans</p>
              <p className="text-secondary text-sm">Completed today at 2:30 PM</p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <p className="activity-title">Port Moresby Bakery</p>
              <p className="text-secondary text-sm">Completed today at 11:15 AM</p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon warning">…</div>
            <div className="activity-content">
              <p className="activity-title">Mt Hagen Hardware</p>
              <p className="text-secondary text-sm">Pending verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
