import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import './SurveySuccess.css';

export default function SurveySuccess() {
  const navigate = useNavigate();
  const { isOffline } = useOffline();

  return (
    <div className="survey-success">
      <div className="success-content">
        <div className="success-icon">✓</div>

        <h2>Survey Submitted!</h2>

        <p className="success-message">
          {isOffline
            ? 'Your survey has been saved locally and will be synced when you\'re back online.'
            : 'Your survey has been successfully submitted and saved to the database.'}
        </p>

        {isOffline && (
          <div className="offline-notice">
            <span className="notice-icon">!</span>
            <div className="notice-content">
              <p className="notice-title">Working Offline</p>
              <p className="notice-text">
                This survey is queued for sync. It will be uploaded automatically when connection is restored.
              </p>
            </div>
          </div>
        )}

        <div className="success-stats">
          <div className="stat-item">
            <div className="stat-content">
              <p className="stat-value">Survey Complete</p>
              <p className="stat-label">All fields captured</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-content">
              <p className="stat-value">Saved Locally</p>
              <p className="stat-label">Data is secure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="success-actions">
        <button
          className="btn btn-secondary btn-full"
          onClick={() => navigate('/mobile/survey')}
        >
          Start New Survey
        </button>

        <button
          className="btn btn-primary btn-full"
          onClick={() => navigate('/mobile/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
