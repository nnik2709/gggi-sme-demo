import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './SurveyReview.css';

export default function SurveyReview() {
  const navigate = useNavigate();
  const { currentSurvey, submitSurvey } = useSME();

  if (!currentSurvey) {
    navigate('/mobile/survey');
    return null;
  }

  const handleSubmit = () => {
    submitSurvey();
    navigate('/mobile/survey/success');
  };

  const handleEdit = () => {
    navigate('/mobile/survey');
  };

  return (
    <div className="survey-review">
      <div className="review-header">
        <h2>Review Survey</h2>
        <p className="text-secondary">Please verify all information before submitting</p>
      </div>

      <div className="review-card">
        <h3>Business Information</h3>
        <div className="review-section">
          <div className="review-item">
            <span className="review-label">Business Name</span>
            <span className="review-value">{currentSurvey.businessName}</span>
          </div>
        </div>
      </div>

      <div className="review-card">
        <h3>Location</h3>
        <div className="review-section">
          <div className="review-item">
            <span className="review-label">Province</span>
            <span className="review-value">{currentSurvey.province}</span>
          </div>
          <div className="review-item">
            <span className="review-label">District</span>
            <span className="review-value">{currentSurvey.district}</span>
          </div>
        </div>
      </div>

      <div className="review-card">
        <h3>Owner Information</h3>
        <div className="review-section">
          <div className="review-item">
            <span className="review-label">Gender</span>
            <span className="review-value">{currentSurvey.ownerGender}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Age Range</span>
            <span className="review-value">{currentSurvey.ownerAge}</span>
          </div>
        </div>
      </div>

      <div className="review-card">
        <h3>Business Details</h3>
        <div className="review-section">
          <div className="review-item">
            <span className="review-label">Sector</span>
            <span className="review-value">{currentSurvey.sector}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Employees</span>
            <span className="review-value">{currentSurvey.employees}</span>
          </div>
        </div>
      </div>

      {currentSurvey.photoUrl && (
        <div className="review-card">
          <h3>Business Photo</h3>
          <div className="review-photo">
            <img src={currentSurvey.photoUrl} alt="Business" />
          </div>
        </div>
      )}

      <div className="review-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleEdit}
        >
          Edit Survey
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit Survey
        </button>
      </div>

      <div className="review-notice">
        <p className="text-secondary text-sm">
          This survey will be saved locally and synced when you're back online.
        </p>
      </div>
    </div>
  );
}
