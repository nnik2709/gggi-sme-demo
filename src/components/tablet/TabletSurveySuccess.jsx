import { useLocation, useNavigate } from 'react-router-dom';
import './tablet.css';

export default function TabletSurveySuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { smeId = 'SME-PNG-2025-XXXXX', businessName = 'Business' } = location.state || {};

  return (
    <>
      <div className="tablet-topbar">
        <div>
          <div className="topbar-title">Survey Submitted</div>
          <div className="topbar-sub">Record saved and queued for sync</div>
        </div>
      </div>
      <div className="tablet-progress">
        <div className="tablet-progress-fill" style={{ width: '100%', background: '#4CAF50' }} />
      </div>
      <div className="tablet-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="t-success">
          <div className="t-success-icon">&#10003;</div>
          <div className="t-success-title">Survey Complete!</div>
          <div style={{ fontSize: 15, color: '#555', fontWeight: 600 }}>{businessName}</div>
          <div className="t-success-id">{smeId}</div>
          <div className="t-success-sub">
            This record has been saved offline and will sync automatically when
            an internet connection is available. The unique SME ID above has been
            assigned for tracking and follow-up.
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8, width: '100%', maxWidth: 480
          }}>
            <button
              className="t-btn t-btn-primary"
              style={{ justifyContent: 'center' }}
              onClick={() => navigate('/tablet/survey')}
            >
              New Survey
            </button>
            <button
              className="t-btn t-btn-secondary"
              style={{ justifyContent: 'center' }}
              onClick={() => navigate('/tablet/dashboard')}
            >
              Dashboard
            </button>
          </div>

          <div style={{ marginTop: 16, padding: '10px 20px', background: '#E8F5E9', borderRadius: 8, fontSize: 12, color: '#2E7D32' }}>
            Sync queue: 1 record pending · Will auto-sync on next connection
          </div>
        </div>
      </div>
    </>
  );
}
