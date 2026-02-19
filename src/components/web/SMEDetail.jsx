import { useNavigate, useParams } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './SMEDetail.css';

export default function SMEDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSMEById } = useSME();

  const sme = getSMEById(id);

  if (!sme) {
    return (
      <div className="sme-detail-error">
        <h2>SME Not Found</h2>
        <p>The requested SME could not be found in the database.</p>
        <button className="btn btn-primary" onClick={() => navigate('/web/directory')}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="sme-detail">
      <div className="detail-header">
        <button className="btn-text" onClick={() => navigate('/web/directory')}>
          Back to Directory
        </button>
        <div className="header-actions">
          <button className="btn btn-secondary">Edit</button>
          <button className="btn btn-primary">Export PDF</button>
        </div>
      </div>

      <div className="detail-hero">
        <div className="hero-content">
          <div className="hero-badges">
            {sme.women_led && <span className="badge badge-women">Women-Led</span>}
            {sme.youth_led && <span className="badge badge-youth">Youth-Led</span>}
            <span className={`status-badge ${sme.status.toLowerCase()}`}>
              {sme.status}
            </span>
          </div>

          <h1>{sme.business_name}</h1>
          <p className="legal-name">{sme.legal_name}</p>

          <div className="hero-meta">
            <div className="meta-item">
              <span>{sme.province}, {sme.district}</span>
            </div>
            <div className="meta-item">
              <span>{sme.sector} — {sme.sub_sector}</span>
            </div>
            <div className="meta-item">
              <span>Established {sme.year_established}</span>
            </div>
          </div>
        </div>

        {sme.photo_url && (
          <div className="hero-photo">
            <img src={sme.photo_url} alt={sme.business_name} />
          </div>
        )}
      </div>

      <div className="detail-grid">
        {/* Business Information */}
        <div className="detail-card">
          <h2>Business Identification</h2>
          <div className="sme-id-banner">
            <span className="sme-id-label">Unique SME ID</span>
            <span className="sme-id-value">{sme.unique_sme_id || sme.id}</span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>IPA Registration</label>
              <span className="mono">{sme.ipa_registration || '— Not registered'}</span>
            </div>
            <div className="info-item">
              <label>TIN (IRC)</label>
              <span className="mono">{sme.tin_irc || '— Not provided'}</span>
            </div>
            <div className="info-item">
              <label>GST Number</label>
              <span className="mono">{sme.gst_number || '— Not registered'}</span>
            </div>
            <div className="info-item">
              <label>LLG Licence</label>
              <span className="mono">{sme.llg_licence || '— None'}</span>
            </div>
            <div className="info-item">
              <label>Registration Status</label>
              <span className={`reg-status ${(sme.registration_status || '').toLowerCase().includes('active') ? 'active' : 'informal'}`}>
                {sme.registration_status || 'Unknown'}
              </span>
            </div>
            <div className="info-item">
              <label>Registration Type</label>
              <span>{sme.registration_type}</span>
            </div>
            <div className="info-item">
              <label>SMEC Support Received</label>
              <span>{sme.smec_support_received || 'None'}</span>
            </div>
            <div className="info-item">
              <label>Business Size</label>
              <span>{sme.size}</span>
            </div>
            <div className="info-item">
              <label>Year Established</label>
              <span>{sme.year_established}</span>
            </div>
            <div className="info-item">
              <label>Revenue Range (Annual)</label>
              <span>{sme.revenue_range}</span>
            </div>
            <div className="info-item">
              <label>Weekly Turnover Band</label>
              <span>{sme.weekly_turnover_band || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Income Seasonality</label>
              <span>{sme.income_seasonality || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Products / Services</label>
              <span>{sme.products}</span>
            </div>
            <div className="info-item">
              <label>Markets Served</label>
              <span>{sme.markets}</span>
            </div>
            <div className="info-item">
              <label>Support Needs</label>
              <span>{sme.support_needs || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="detail-card">
          <h2>Location</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Province</label>
              <span>{sme.province}</span>
            </div>
            <div className="info-item">
              <label>District</label>
              <span>{sme.district}</span>
            </div>
            <div className="info-item">
              <label>LLG</label>
              <span>{sme.llg}</span>
            </div>
            <div className="info-item">
              <label>Ward Number</label>
              <span>{sme.ward_number || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Urban / Rural</label>
              <span>{sme.urban_rural}</span>
            </div>
            <div className="info-item">
              <label>Operating Location Type</label>
              <span>{sme.operating_location_type || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>GPS Coordinates</label>
              <span>{sme.gps?.lat?.toFixed(4)}, {sme.gps?.lng?.toFixed(4)}</span>
            </div>
          </div>

          <div className="map-placeholder">
            <p>Map View Available</p>
            <button className="btn btn-secondary btn-sm">View on Map</button>
          </div>
        </div>

        {/* GEDSI / Owner Information */}
        <div className="detail-card">
          <h2>GEDSI &amp; Owner Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Owner Gender</label>
              <span>{sme.owner_gender}</span>
            </div>
            <div className="info-item">
              <label>Owner Age Range</label>
              <span>{sme.owner_age_range}</span>
            </div>
            <div className="info-item">
              <label>Women-Led (&gt;50%)</label>
              <span className={sme.women_led ? 'badge-yes' : ''}>{sme.women_led ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Youth-Led (&gt;50%)</label>
              <span className={sme.youth_led ? 'badge-yes' : ''}>{sme.youth_led ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>PWD-Owned</label>
              <span>{sme.pwd_owned ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Female Decision-Maker</label>
              <span className={sme.female_decision_maker ? 'badge-yes' : ''}>{sme.female_decision_maker ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Shared Ownership</label>
              <span>{sme.shared_ownership ? '✓ Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Employment */}
        <div className="detail-card">
          <h2>Employment</h2>
          <div className="employment-stats">
            <div className="stat-circle">
              <div className="stat-value">{sme.employees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-circle">
              <div className="stat-value">{sme.employees_male}</div>
              <div className="stat-label">Male</div>
            </div>
            <div className="stat-circle">
              <div className="stat-value">{sme.employees_female}</div>
              <div className="stat-label">Female</div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="detail-card">
          <h2>Financial Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Banking Status</label>
              <span>{sme.banking_status}</span>
            </div>
            <div className="info-item">
              <label>Access to Finance</label>
              <span>{sme.access_to_finance ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Finance Source</label>
              <span>{sme.finance_source || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Mobile Money Usage</label>
              <span>{sme.mobile_money_usage || 'None'}</span>
            </div>
            <div className="info-item">
              <label>Savings Group Member</label>
              <span>{sme.savings_group_member ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Loan History</label>
              <span>{sme.loan_history || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Digital Technology */}
        <div className="detail-card">
          <h2>Digital Technology Adoption</h2>
          <div className="tech-grid">
            {[
              { label: 'Basic Phone', key: 'basic_phone' },
              { label: 'Smartphone', key: 'smartphone' },
              { label: 'Internet Access', key: 'internet_access' },
              { label: 'Social Media Selling', key: 'social_media_selling' },
              { label: 'E-commerce Platform', key: 'ecommerce_platform' },
            ].map(({ label, key }) => {
              const val = sme.digital_tech?.[key] ?? false;
              return (
                <div key={key} className={`tech-item ${val ? 'enabled' : 'disabled'}`}>
                  <span>{label}</span>
                  <span className="tech-status">{val ? 'Yes' : 'No'}</span>
                </div>
              );
            })}
          </div>
          <div className="info-grid" style={{marginTop:'12px'}}>
            <div className="info-item">
              <label>Mobile Money</label>
              <span>{sme.mobile_money_usage || 'None'}</span>
            </div>
            <div className="info-item">
              <label>Supply Chain Role</label>
              <span>{sme.supply_chain_role || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Transport Constraint</label>
              <span>{sme.transport_constraint || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="detail-card full-width">
          <h2>Business Challenges</h2>
          <div className="challenges-list">
            {sme.challenges.map((challenge, index) => (
              <div key={index} className="challenge-item">
                <span>{challenge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Information */}
        <div className="detail-card full-width">
          <h2>Survey Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Survey Date</label>
              <span>{sme.survey_date}</span>
            </div>
            <div className="info-item">
              <label>Enumerator</label>
              <span>{sme.enumerator}</span>
            </div>
            <div className="info-item">
              <label>Verified By</label>
              <span>{sme.verified_by || 'Pending'}</span>
            </div>
            <div className="info-item">
              <label>Verification Date</label>
              <span>{sme.verified_date || 'Pending'}</span>
            </div>
          </div>
        </div>

        {/* Credit Readiness Score */}
        <div className="detail-card">
          <h2>Credit Readiness Score</h2>
          <div className="credit-score-panel">
            <div className="credit-score-circle"
              style={{
                background: `conic-gradient(${
                  (sme.credit_readiness_score || 0) >= 80 ? '#2E7D32' :
                  (sme.credit_readiness_score || 0) >= 50 ? '#FF9800' : '#F44336'
                } ${(sme.credit_readiness_score || 0) * 3.6}deg, #f0f0f0 0deg)`
              }}>
              <div className="credit-score-inner">
                <span className="credit-score-value">{sme.credit_readiness_score || 0}</span>
                <span className="credit-score-label">/ 100</span>
              </div>
            </div>
            <div className="credit-score-detail">
              <div className={`credit-score-band ${
                (sme.credit_readiness_score || 0) >= 80 ? 'high' :
                (sme.credit_readiness_score || 0) >= 50 ? 'mid' : 'low'
              }`}>
                {(sme.credit_readiness_score || 0) >= 80 ? 'Finance-Ready' :
                 (sme.credit_readiness_score || 0) >= 50 ? 'Developing' : 'High Risk'}
              </div>
              <p className="credit-score-desc">
                Score calculated by Eywa Systems AI engine based on banking status,
                finance access history, IPA/TIN compliance, and financial record-keeping.
              </p>
              <div className="credit-factors">
                <div className={`credit-factor ${sme.banking_status && !sme.banking_status.includes('Unbanked') ? 'pos' : 'neg'}`}>
                  {sme.banking_status && !sme.banking_status.includes('Unbanked') ? '✓' : '✗'} Banked: {sme.banking_status}
                </div>
                <div className={`credit-factor ${sme.access_to_finance ? 'pos' : 'neg'}`}>
                  {sme.access_to_finance ? '✓' : '✗'} Finance Access
                </div>
                <div className={`credit-factor ${sme.ipa_verified ? 'pos' : 'neg'}`}>
                  {sme.ipa_verified ? '✓' : '✗'} IPA Verified
                </div>
                <div className={`credit-factor ${sme.tin_verified ? 'pos' : 'neg'}`}>
                  {sme.tin_verified ? '✓' : '✗'} TIN Verified
                </div>
                <div className={`credit-factor ${sme.savings_group_member ? 'pos' : 'neg'}`}>
                  {sme.savings_group_member ? '✓' : '✗'} Savings Group
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IPA / IRC Integration Panel */}
        <div className="detail-card">
          <h2>IPA / IRC Integration</h2>
          <div className="integration-panel">
            <div className={`integ-item ${sme.ipa_verified ? 'verified' : 'unverified'}`}>
              <div className="integ-header">
                <span className="integ-title">IPA Business Register</span>
                <span className={`integ-badge ${sme.ipa_verified ? 'ok' : 'fail'}`}>
                  {sme.ipa_verified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
              <div className="integ-value">
                {sme.ipa_registration || 'Not registered / not provided'}
              </div>
            </div>
            <div className={`integ-item ${sme.tin_verified ? 'verified' : 'unverified'}`}>
              <div className="integ-header">
                <span className="integ-title">IRC Tax ID (TIN)</span>
                <span className={`integ-badge ${sme.tin_verified ? 'ok' : 'fail'}`}>
                  {sme.tin_verified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
              <div className="integ-value">
                {sme.tin_irc || 'Not provided'}
              </div>
            </div>
            <div className="integ-item neutral">
              <div className="integ-header">
                <span className="integ-title">GST Registration</span>
                <span className={`integ-badge ${sme.gst_number ? 'ok' : 'neutral'}`}>
                  {sme.gst_number ? '✓ Registered' : '— Not registered'}
                </span>
              </div>
              <div className="integ-value">{sme.gst_number || 'N/A'}</div>
            </div>
            <div className="integ-item neutral">
              <div className="integ-header">
                <span className="integ-title">Verification Source</span>
              </div>
              <div className="integ-value">{sme.verification_source || 'GPS + Photo'}</div>
            </div>
            <div className="integ-item neutral">
              <div className="integ-header">
                <span className="integ-title">Data Quality Score</span>
              </div>
              <div className="integ-value">
                <span className={`quality-pill ${(sme.data_quality_score || 0) >= 90 ? 'high' : (sme.data_quality_score || 0) >= 70 ? 'mid' : 'low'}`}>
                  {sme.data_quality_score || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Climate & Resilience Panel */}
        {sme.climate && (
          <div className="detail-card full-width climate-detail-card">
            <h2>Climate &amp; Resilience Profile</h2>
            <div className="climate-detail-grid">
              <div className="climate-detail-item">
                <label>Climate-Sensitive Sector</label>
                <span className={sme.climate.climate_sensitive_sector ? 'badge-yes' : 'badge-no'}>
                  {sme.climate.climate_sensitive_sector ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="climate-detail-item">
                <label>Sector Tag</label>
                <span>{sme.climate.sector_tag || 'N/A'}</span>
              </div>
              <div className="climate-detail-item full">
                <label>Climate Risks Faced</label>
                <div className="tag-list">
                  {(sme.climate.climate_risks_faced || []).length > 0
                    ? sme.climate.climate_risks_faced.map(r => (
                        <span key={r} className="risk-tag">{r}</span>
                      ))
                    : <span className="text-secondary">None reported</span>
                  }
                </div>
              </div>
              <div className="climate-detail-item full">
                <label>Green Practices Adopted</label>
                <div className="tag-list">
                  {(sme.climate.green_practices || []).length > 0
                    ? sme.climate.green_practices.map(p => (
                        <span key={p} className="green-tag">{p}</span>
                      ))
                    : <span className="text-secondary">None reported</span>
                  }
                </div>
              </div>
              <div className="climate-detail-item full">
                <label>Resilience Investments</label>
                <span>{sme.climate.resilience_investments || 'None'}</span>
              </div>
            </div>
            <div className="climate-policy-note">
              This SME's climate data contributes to PNG's NDC monitoring and GGGI green growth targeting.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
