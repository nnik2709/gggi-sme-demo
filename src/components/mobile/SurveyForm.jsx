import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './SurveyForm.css';

const PROVINCES = [
  'Central','Eastern Highlands','East New Britain','East Sepik',
  'Enga','Gulf','Hela','Jiwaka','Madang','Manus','Milne Bay',
  'Morobe','National Capital District','New Ireland','Oro',
  'Sandaun','Simbu','Southern Highlands','West New Britain',
  'Western','Western Highlands'
];

const SECTORS = [
  'Agriculture','Construction','Financial Services','Fisheries',
  'ICT & Digital','Manufacturing','Mining & Resources',
  'Professional Services','Retail','Services','Tourism','Transport'
];

const STEP_LABELS = [
  'Business ID','Location','GEDSI','Business Details',
  'Financial','Digital & Operations','Climate','Privacy & Photo'
];

export default function SurveyForm() {
  const navigate = useNavigate();
  const { saveSurvey } = useSME();
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState({
    // Step 1 – Business Identification
    businessName: '',
    legalName: '',
    registrationType: '',
    ipaRegistration: '',
    tinIrc: '',
    gstNumber: '',
    llgLicence: '',
    smecSupportReceived: '',
    registrationStatus: '',
    // Step 2 – Location
    village: '',
    province: '',
    district: '',
    llg: '',
    wardNumber: '',
    urbanRural: '',
    operatingLocationType: '',
    // Step 3 – GEDSI
    ownerGender: '',
    ownerAge: '',
    womenLed: false,
    youthLed: false,
    pwdOwned: false,
    femaleDecisionMaker: false,
    sharedOwnership: false,
    // Step 4 – Business Characteristics
    sector: '',
    subSector: '',
    yearEstablished: '',
    employees: '',
    employeesMale: '',
    employeesFemale: '',
    revenueRange: '',
    weeklyTurnoverBand: '',
    incomeSeasonality: '',
    size: '',
    products: '',
    markets: '',
    supplyChainRole: '',
    transportConstraint: '',
    // Step 5 – Financial
    bankingStatus: '',
    accessToFinance: '',
    financeSource: '',
    mobileMoney: '',
    savingsGroup: false,
    loanHistory: '',
    // Step 6 – Digital & Operations
    basicPhone: false,
    smartphone: false,
    internetAccess: false,
    socialMediaSelling: false,
    ecommercePlatform: false,
    challenges: '',
    supportNeeds: '',
    // Step 7 – Climate & Resilience
    climateSensitiveSector: '',
    sectorTag: '',
    climateRisksFaced: [],
    greenPractices: [],
    resilienceInvestments: '',
    // Step 8 – Privacy & Photo
    dataSharingConsent: false,
    photoUrl: null
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      saveSurvey(formData);
      navigate('/mobile/survey/review');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/mobile/dashboard');
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('photoUrl', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.businessName.trim() !== '';
      case 2: return formData.province !== '' && formData.district.trim() !== '';
      case 3: return formData.ownerGender !== '' && formData.ownerAge !== '';
      case 4: return formData.sector !== '' && formData.employees !== '';
      case 5: return formData.bankingStatus !== '';
      case 6: return true;
      case 7: return formData.climateSensitiveSector !== '';
      case 8: return formData.dataSharingConsent;
      default: return false;
    }
  };

  const RadioGroup = ({ field, options }) => (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt} className="radio-label">
          <input
            type="radio"
            name={field}
            value={opt}
            checked={formData[field] === opt}
            onChange={e => handleChange(field, e.target.value)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );

  const CheckRow = ({ field, label }) => (
    <label className="check-row">
      <input
        type="checkbox"
        checked={formData[field]}
        onChange={e => handleChange(field, e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );

  const MultiCheck = ({ field, options }) => (
    <div className="multi-check">
      {options.map(opt => (
        <label key={opt} className="check-row">
          <input
            type="checkbox"
            checked={(formData[field] || []).includes(opt)}
            onChange={() => handleCheckbox(field, opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Business Identification</h2>
            <p className="step-description">Legal name, registration numbers, and SMEC linkage</p>

            <div className="form-group">
              <label className="form-label">Trading / Business Name *</label>
              <input className="form-input" value={formData.businessName}
                onChange={e => handleChange('businessName', e.target.value)}
                placeholder="e.g., Goroka Coffee Beans" />
            </div>

            <div className="form-group">
              <label className="form-label">Legal Name</label>
              <input className="form-input" value={formData.legalName}
                onChange={e => handleChange('legalName', e.target.value)}
                placeholder="e.g., Goroka Coffee Beans Pty Ltd" />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Type</label>
              <select className="form-select" value={formData.registrationType}
                onChange={e => handleChange('registrationType', e.target.value)}>
                <option value="">Select type</option>
                <option>Formal - Registered Company</option>
                <option>Formal - Cooperative</option>
                <option>Informal</option>
                <option>Informal - Cooperative</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">IPA Registration Number</label>
              <input className="form-input" value={formData.ipaRegistration}
                onChange={e => handleChange('ipaRegistration', e.target.value)}
                placeholder="IPA-YYYY-XXXXX" />
            </div>

            <div className="form-group">
              <label className="form-label">TIN (IRC Tax ID)</label>
              <input className="form-input" value={formData.tinIrc}
                onChange={e => handleChange('tinIrc', e.target.value)}
                placeholder="TIN-XXXXXX" />
            </div>

            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input className="form-input" value={formData.gstNumber}
                onChange={e => handleChange('gstNumber', e.target.value)}
                placeholder="GST-XXXXXX" />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Status</label>
              <select className="form-select" value={formData.registrationStatus}
                onChange={e => handleChange('registrationStatus', e.target.value)}>
                <option value="">Select status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Under Review</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SMEC Support Received</label>
              <input className="form-input" value={formData.smecSupportReceived}
                onChange={e => handleChange('smecSupportReceived', e.target.value)}
                placeholder="e.g., Business Skills Training, None" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Location</h2>
            <p className="step-description">Geographic details for planning and census linkage</p>

            <div className="form-group">
              <label className="form-label">Village / Town / Suburb</label>
              <input className="form-input" value={formData.village}
                onChange={e => handleChange('village', e.target.value)}
                placeholder="e.g., Kainantu Town, Waigani" />
            </div>

            <div className="form-group">
              <label className="form-label">Province *</label>
              <select className="form-select" value={formData.province}
                onChange={e => handleChange('province', e.target.value)}>
                <option value="">Select Province</option>
                {PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District *</label>
              <input className="form-input" value={formData.district}
                onChange={e => handleChange('district', e.target.value)}
                placeholder="e.g., Goroka Urban" />
            </div>

            <div className="form-group">
              <label className="form-label">LLG (Local Level Government)</label>
              <input className="form-input" value={formData.llg}
                onChange={e => handleChange('llg', e.target.value)}
                placeholder="e.g., Goroka Urban LLG" />
            </div>

            <div className="form-group">
              <label className="form-label">Ward Number</label>
              <input className="form-input" value={formData.wardNumber}
                onChange={e => handleChange('wardNumber', e.target.value)}
                placeholder="e.g., Ward 3" />
            </div>

            <div className="form-group">
              <label className="form-label">Urban / Rural</label>
              <RadioGroup field="urbanRural" options={['Urban', 'Rural']} />
            </div>

            <div className="form-group">
              <label className="form-label">Operating Location Type</label>
              <select className="form-select" value={formData.operatingLocationType}
                onChange={e => handleChange('operatingLocationType', e.target.value)}>
                <option value="">Select type</option>
                <option>Fixed Premises</option>
                <option>Home-based</option>
                <option>Market Stall</option>
                <option>Roadside</option>
                <option>Mobile / Itinerant</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>GEDSI & Ownership</h2>
            <p className="step-description">Gender, age, disability, and ownership indicators</p>

            <div className="form-group">
              <label className="form-label">Owner Gender *</label>
              <RadioGroup field="ownerGender" options={['Woman', 'Man', 'Non-binary', 'Prefer not to say']} />
            </div>

            <div className="form-group">
              <label className="form-label">Owner Age Range *</label>
              <select className="form-select" value={formData.ownerAge}
                onChange={e => handleChange('ownerAge', e.target.value)}>
                <option value="">Select</option>
                <option value="18-29">18–29 (Youth)</option>
                <option value="30-39">30–39</option>
                <option value="40-49">40–49</option>
                <option value="50+">50+</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ownership Characteristics</label>
              <CheckRow field="womenLed" label="Women-led (>50% women ownership)" />
              <CheckRow field="youthLed" label="Youth-led (>50% youth under 35)" />
              <CheckRow field="pwdOwned" label="PWD-owned (person with disability)" />
              <CheckRow field="femaleDecisionMaker" label="Female primary decision-maker" />
              <CheckRow field="sharedOwnership" label="Shared / joint ownership" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2>Business Characteristics</h2>
            <p className="step-description">Sector, employment, revenue and operations</p>

            <div className="form-group">
              <label className="form-label">Sector *</label>
              <select className="form-select" value={formData.sector}
                onChange={e => handleChange('sector', e.target.value)}>
                <option value="">Select Sector</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sub-sector / Specific Activity</label>
              <input className="form-input" value={formData.subSector}
                onChange={e => handleChange('subSector', e.target.value)}
                placeholder="e.g., Coffee Processing" />
            </div>

            <div className="form-group">
              <label className="form-label">Year Established</label>
              <input className="form-input" type="number" value={formData.yearEstablished}
                onChange={e => handleChange('yearEstablished', e.target.value)}
                placeholder="e.g., 2018" min="1980" max="2026" />
            </div>

            <div className="form-group">
              <label className="form-label">Total Employees *</label>
              <input className="form-input" type="number" value={formData.employees}
                onChange={e => handleChange('employees', e.target.value)}
                placeholder="Total" min="0" />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">Male Staff</label>
                <input className="form-input" type="number" value={formData.employeesMale}
                  onChange={e => handleChange('employeesMale', e.target.value)} placeholder="0" min="0" />
              </div>
              <div className="form-group half">
                <label className="form-label">Female Staff</label>
                <input className="form-input" type="number" value={formData.employeesFemale}
                  onChange={e => handleChange('employeesFemale', e.target.value)} placeholder="0" min="0" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Revenue Range</label>
              <select className="form-select" value={formData.revenueRange}
                onChange={e => handleChange('revenueRange', e.target.value)}>
                <option value="">Select</option>
                <option>Under K50,000</option>
                <option>K50,000 - K250,000</option>
                <option>K250,000 - K500,000</option>
                <option>K500,000 - K1,000,000</option>
                <option>Over K1,000,000</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Weekly Turnover Band (informal)</label>
              <select className="form-select" value={formData.weeklyTurnoverBand}
                onChange={e => handleChange('weeklyTurnoverBand', e.target.value)}>
                <option value="">Select if applicable</option>
                <option>Under K200</option>
                <option>K200-K500</option>
                <option>K500-K1,000</option>
                <option>K1,000-K5,000</option>
                <option>K5,000-K20,000</option>
                <option>Over K20,000</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Income Seasonality</label>
              <RadioGroup field="incomeSeasonality"
                options={['Stable year-round', 'Seasonal', 'Highly variable']} />
            </div>

            <div className="form-group">
              <label className="form-label">Supply Chain Role</label>
              <RadioGroup field="supplyChainRole" options={['Supplier', 'Buyer', 'Buyer and Supplier', 'None']} />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Transport Constraint</label>
              <select className="form-select" value={formData.transportConstraint}
                onChange={e => handleChange('transportConstraint', e.target.value)}>
                <option value="">Select</option>
                <option>Road</option>
                <option>Sea</option>
                <option>Air</option>
                <option>Road and Sea</option>
                <option>None</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Products / Services</label>
              <input className="form-input" value={formData.products}
                onChange={e => handleChange('products', e.target.value)}
                placeholder="Brief description" />
            </div>

            <div className="form-group">
              <label className="form-label">Markets Served</label>
              <RadioGroup field="markets" options={['Local only', 'Provincial', 'National', 'International']} />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <h2>Financial Information</h2>
            <p className="step-description">Banking, finance access, and credit indicators</p>

            <div className="form-group">
              <label className="form-label">Banking Status *</label>
              <select className="form-select" value={formData.bankingStatus}
                onChange={e => handleChange('bankingStatus', e.target.value)}>
                <option value="">Select</option>
                <option>Banked (BSP)</option>
                <option>Banked (ANZ)</option>
                <option>Banked (Westpac)</option>
                <option>Banked (Kina Bank)</option>
                <option>Banked (MiBank)</option>
                <option>Unbanked</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Access to Formal Finance?</label>
              <RadioGroup field="accessToFinance" options={['Yes', 'No', 'Applied but rejected']} />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Finance Source</label>
              <select className="form-select" value={formData.financeSource}
                onChange={e => handleChange('financeSource', e.target.value)}>
                <option value="">Select</option>
                <option>Bank loan</option>
                <option>Microfinance loan</option>
                <option>Government grant</option>
                <option>Cooperative / savings group</option>
                <option>Angel / informal investor</option>
                <option>Retained earnings</option>
                <option>None</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Money Usage</label>
              <select className="form-select" value={formData.mobileMoney}
                onChange={e => handleChange('mobileMoney', e.target.value)}>
                <option value="">Select</option>
                <option>BSP Kundu</option>
                <option>Digicel Easipay</option>
                <option>Both</option>
                <option>None</option>
              </select>
            </div>

            <div className="form-group">
              <CheckRow field="savingsGroup" label="Member of savings group / wantok finance" />
            </div>

            <div className="form-group">
              <label className="form-label">Loan History</label>
              <input className="form-input" value={formData.loanHistory}
                onChange={e => handleChange('loanHistory', e.target.value)}
                placeholder="e.g., 1 loan repaid, None, Application rejected" />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-step">
            <h2>Digital Technology &amp; Operations</h2>
            <p className="step-description">Technology adoption, challenges and support needs</p>

            <div className="form-group">
              <label className="form-label">Digital Technology Used</label>
              <CheckRow field="basicPhone" label="Basic phone (calls/SMS only)" />
              <CheckRow field="smartphone" label="Smartphone" />
              <CheckRow field="internetAccess" label="Internet access (data / WiFi)" />
              <CheckRow field="socialMediaSelling" label="Social media for selling (Facebook, etc.)" />
              <CheckRow field="ecommercePlatform" label="E-commerce platform (Shopify, etc.)" />
            </div>

            <div className="form-group">
              <label className="form-label">Key Business Challenges</label>
              <textarea className="form-input" rows={3} value={formData.challenges}
                onChange={e => handleChange('challenges', e.target.value)}
                placeholder="e.g., Access to finance, road conditions, competition..." />
            </div>

            <div className="form-group">
              <label className="form-label">Support Needs</label>
              <textarea className="form-input" rows={3} value={formData.supportNeeds}
                onChange={e => handleChange('supportNeeds', e.target.value)}
                placeholder="e.g., Export market access, equipment finance, training..." />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="form-step">
            <h2>Climate &amp; Resilience</h2>
            <p className="step-description">Climate risks, green practices, and resilience investments</p>
            <div className="climate-badge">🌿 Eywa Systems Value-Add Module</div>

            <div className="form-group">
              <label className="form-label">Is this a climate-sensitive sector? *</label>
              <RadioGroup field="climateSensitiveSector" options={['Yes', 'No', 'Unsure']} />
            </div>

            <div className="form-group">
              <label className="form-label">Sector / Climate Tag</label>
              <input className="form-input" value={formData.sectorTag}
                onChange={e => handleChange('sectorTag', e.target.value)}
                placeholder="e.g., Agriculture - Coffee, Tourism - Coastal" />
            </div>

            <div className="form-group">
              <label className="form-label">Climate Risks Faced</label>
              <MultiCheck field="climateRisksFaced" options={[
                'Drought','Flooding','Cyclones','Irregular rainfall',
                'Ocean warming / coral bleaching','Sea level rise',
                'Storm surge','Landslides','Extreme heat','Pest outbreaks'
              ]} />
            </div>

            <div className="form-group">
              <label className="form-label">Green Practices Adopted</label>
              <MultiCheck field="greenPractices" options={[
                'Solar energy','Rainwater harvesting','Organic practices',
                'Recycling / zero waste','No-plastic policy',
                'Shade-grown / agroforestry','Resilient crop varieties',
                'Sustainable fishing limits','LED lighting','None'
              ]} />
            </div>

            <div className="form-group">
              <label className="form-label">Resilience Investments Made</label>
              <input className="form-input" value={formData.resilienceInvestments}
                onChange={e => handleChange('resilienceInvestments', e.target.value)}
                placeholder="e.g., Solar dryer 2023, generator backup, None" />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="form-step">
            <h2>Privacy &amp; Verification</h2>
            <p className="step-description">Consent, data sharing, and photo capture</p>

            <div className="consent-box">
              <h4>📋 Data Consent Statement</h4>
              <p>This information will be held by SMEC (Small and Medium Enterprise Corporation)
                and used for national planning, policy development, and improving access to finance
                for SMEs in Papua New Guinea. Your data may be shared with government agencies
                (IPA, IRC) and financial institutions only with your consent.</p>
              <div className="form-group" style={{marginTop:'12px'}}>
                <CheckRow field="dataSharingConsent"
                  label="I give consent for my data to be shared with SMEC, IPA, IRC and financial institutions *" />
              </div>
            </div>

            <div className="photo-capture" style={{marginTop:'16px'}}>
              {formData.photoUrl ? (
                <div className="photo-preview">
                  <img src={formData.photoUrl} alt="Business" />
                  <button type="button" className="btn-text"
                    onClick={() => handleChange('photoUrl', null)}>
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-icon">📷</span>
                  <p>Take a photo of the business premises (GPS auto-captured)</p>
                  <label className="btn btn-secondary">
                    Capture Photo
                    <input type="file" accept="image/*" capture="environment"
                      onChange={handlePhotoCapture} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="survey-form">
      {/* Progress Indicator */}
      <div className="survey-progress">
        <div className="progress-steps">
          {STEP_LABELS.map((label, i) => (
            <div key={i}
              className={`progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
              title={label}
            >
              {i + 1 < step ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <div className="progress-text">
          Step {step} of {totalSteps}: <strong>{STEP_LABELS[step - 1]}</strong>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Form Content */}
      <div className="survey-content">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="survey-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          {step === 1 ? 'Cancel' : '← Back'}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}
          disabled={!isStepValid()}>
          {step === totalSteps ? 'Review →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
