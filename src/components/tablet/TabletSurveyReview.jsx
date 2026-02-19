import { useLocation, useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './tablet.css';

function genSmeId() {
  const now = new Date();
  const y = now.getFullYear();
  const r = String(Math.floor(Math.random() * 90000) + 10000);
  return `SME-PNG-${y}-${r}`;
}

function ReviewSection({ title, icon, children }) {
  return (
    <div className="t-card">
      <div className="t-card-title">{icon} {title}</div>
      <div className="t-review-grid">{children}</div>
    </div>
  );
}

function RField({ label, value }) {
  const display = value === null || value === undefined || value === ''
    ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>—</span>
    : value === true ? <span style={{ color: '#2E7D32', fontWeight: 700 }}>✓ Yes</span>
    : value === false ? <span style={{ color: '#C62828', fontWeight: 700 }}>✗ No</span>
    : Array.isArray(value) && value.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>None selected</span>
    : Array.isArray(value) ? (
      <div className="t-tag-row">
        {value.map(v => <span key={v} className="t-tag">{v}</span>)}
      </div>
    )
    : String(value);

  return (
    <div className="t-review-field">
      <div className="t-review-label">{label}</div>
      <div className="t-review-val">{display}</div>
    </div>
  );
}

export default function TabletSurveyReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveSurvey } = useSME();

  // data passed via navigate state, or fallback to empty
  const d = location.state?.surveyData || {};
  const smeId = genSmeId();

  const handleSubmit = () => {
    saveSurvey({ ...d, unique_sme_id: smeId });
    navigate('/tablet/survey/success', { state: { smeId, businessName: d.businessName } });
  };

  return (
    <>
      <div className="tablet-topbar">
        <div>
          <div className="topbar-title">Review &amp; Submit</div>
          <div className="topbar-sub">Confirm all details before submitting</div>
        </div>
        <div className="topbar-actions">
          <div style={{
            background: '#E8F5E9', border: '1px solid #A5D6A7',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#2E7D32'
          }}>
            Auto-ID: <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{smeId}</span>
          </div>
        </div>
      </div>

      <div className="tablet-content">
        <ReviewSection title="Business Identification" icon="">
          <RField label="Business Name"        value={d.businessName} />
          <RField label="Legal Name"           value={d.legalName} />
          <RField label="Registration Type"    value={d.registrationType} />
          <RField label="Registration Status"  value={d.registrationStatus} />
          <RField label="IPA Number"           value={d.ipaRegistration} />
          <RField label="TIN (IRC)"            value={d.tinIrc} />
          <RField label="GST Number"           value={d.gstNumber} />
          <RField label="LLG Licence"          value={d.llgLicence} />
          <RField label="SMEC Support"         value={d.smecSupportReceived} />
        </ReviewSection>

        <ReviewSection title="Location" icon="">
          <RField label="Village / Town"           value={d.village} />
          <RField label="Province"                 value={d.province} />
          <RField label="District"                 value={d.district} />
          <RField label="LLG"                      value={d.llg} />
          <RField label="Ward"                     value={d.wardNumber} />
          <RField label="Urban / Rural"            value={d.urbanRural} />
          <RField label="Operating Location Type"  value={d.operatingLocationType} />
        </ReviewSection>

        <ReviewSection title="GEDSI & Owner" icon="">
          <RField label="Owner Name"           value={d.ownerName} />
          <RField label="Owner Gender"         value={d.ownerGender} />
          <RField label="Owner Age Range"      value={d.ownerAge} />
          <RField label="Women-Led"            value={d.womenLed} />
          <RField label="Youth-Led"            value={d.youthLed} />
          <RField label="PWD-Owned"            value={d.pwdOwned} />
          <RField label="Female Decision Maker" value={d.femaleDecisionMaker} />
          <RField label="Shared Ownership"     value={d.sharedOwnership} />
        </ReviewSection>

        <ReviewSection title="Business Characteristics" icon="">
          <RField label="Sector"              value={d.sector} />
          <RField label="Sub-sector"          value={d.subSector} />
          <RField label="Year Established"    value={d.yearEstablished} />
          <RField label="Size"                value={d.size} />
          <RField label="Employees (total)"   value={d.employees} />
          <RField label="Employees (male)"    value={d.employeesMale} />
          <RField label="Employees (female)"  value={d.employeesFemale} />
          <RField label="Revenue Range"       value={d.revenueRange} />
          <RField label="Weekly Turnover"     value={d.weeklyTurnoverBand} />
          <RField label="Seasonality"         value={d.incomeSeasonality} />
          <RField label="Supply Chain Role"   value={d.supplyChainRole} />
          <RField label="Transport Constraint" value={d.transportConstraint} />
          <RField label="Markets"             value={d.markets} />
        </ReviewSection>

        <ReviewSection title="Financial" icon="">
          <RField label="Banking Status"      value={d.bankingStatus} />
          <RField label="Finance Access"      value={d.accessToFinance} />
          <RField label="Finance Source"      value={d.financeSource} />
          <RField label="Mobile Money"        value={d.mobileMoney} />
          <RField label="Savings Group"       value={d.savingsGroup} />
          <RField label="Loan History"        value={d.loanHistory} />
        </ReviewSection>

        <ReviewSection title="Digital & Operations" icon="">
          <RField label="Basic Phone"           value={d.basicPhone} />
          <RField label="Smartphone"            value={d.smartphone} />
          <RField label="Internet Access"       value={d.internetAccess} />
          <RField label="Social Media Selling"  value={d.socialMediaSelling} />
          <RField label="E-commerce Platform"   value={d.ecommercePlatform} />
          <RField label="Support Needs"         value={d.supportNeeds} />
        </ReviewSection>

        <ReviewSection title="Climate & Resilience" icon="">
          <RField label="Climate-Sensitive Sector" value={d.climateSensitiveSector} />
          <RField label="Sector Tag"               value={d.sectorTag} />
          <RField label="Resilience Investments"   value={d.resilienceInvestments} />
          <RField label="Climate Risks (full width)" value={d.climateRisksFaced} />
          <RField label="Green Practices (full width)" value={d.greenPractices} />
        </ReviewSection>

        <ReviewSection title="Privacy & Consent" icon="">
          <RField label="Data Sharing Consent" value={d.dataSharingConsent} />
          <RField label="Photo Captured"       value={d.photoUrl ? 'Yes — photo attached' : null} />
        </ReviewSection>
      </div>

      <div className="tablet-bottom-bar">
        <button className="t-btn t-btn-secondary" onClick={() => navigate(-1)}>
          ← Back to Edit
        </button>
        <div style={{ fontSize: 13, color: '#888' }}>
          {d.dataSharingConsent !== true && (
            <span style={{ color: '#C62828' }}>Consent required before submitting</span>
          )}
        </div>
        <button
          className="t-btn t-btn-primary"
          onClick={handleSubmit}
          disabled={d.dataSharingConsent !== true}
        >
          Submit Survey
        </button>
      </div>
    </>
  );
}
