import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './tablet.css';

/* ─── Cascading Geography ─────────────────────────────────────────────────── */
const GEO = {
  'National Capital District': {
    districts: ['Moresby North-East','Moresby North-West','Moresby South'],
    llgs: {
      'Moresby North-East': ['Boroko','Waigani','Hohola','Kaugere'],
      'Moresby North-West': ['Tokarara','Gerehu','Morata','Eight Mile'],
      'Moresby South':      ['Moresby South Urban','Kairuku-Hiri','Hanuabada'],
    },
  },
  'Central': {
    districts: ['Kairuku-Hiri','Goilala','Rigo','Abau'],
    llgs: {
      'Kairuku-Hiri': ['Kairuku Rural','Hiri Rural','Bereina'],
      'Goilala':      ['Goilala Rural','Tapini'],
      'Rigo':         ['Rigo Rural','Kwikila'],
      'Abau':         ['Abau Rural','Kupiano'],
    },
  },
  'Eastern Highlands': {
    districts: ['Goroka','Kainantu','Obura-Wonenara','Lufa','Henganofi','Unggai-Bena'],
    llgs: {
      'Goroka':          ['Goroka Urban','Goroka Rural','Bena Rural'],
      'Kainantu':        ['Kainantu Urban','Kainantu Rural','Agarabi'],
      'Obura-Wonenara':  ['Obura Rural','Wonenara Rural'],
      'Lufa':            ['Lufa Rural'],
      'Henganofi':       ['Henganofi Rural'],
      'Unggai-Bena':     ['Unggai Rural','Bena Rural'],
    },
  },
  'Western Highlands': {
    districts: ['Mt Hagen','Dei','Mul-Baiyer','Tambul-Nebilyer'],
    llgs: {
      'Mt Hagen':        ['Mt Hagen Urban','Mt Hagen Rural'],
      'Dei':             ['Dei Rural'],
      'Mul-Baiyer':      ['Mul Rural','Baiyer Rural'],
      'Tambul-Nebilyer': ['Tambul Rural','Nebilyer Rural'],
    },
  },
  'Enga': {
    districts: ['Wabag','Kompiam-Ambum','Lagaip-Porgera','Wapenamanda','Kandep'],
    llgs: {
      'Wabag':             ['Wabag Urban','Wabag Rural'],
      'Kompiam-Ambum':     ['Kompiam Rural','Ambum Rural'],
      'Lagaip-Porgera':    ['Lagaip Rural','Porgera Rural'],
      'Wapenamanda':       ['Wapenamanda Rural'],
      'Kandep':            ['Kandep Rural'],
    },
  },
  'Southern Highlands': {
    districts: ['Mendi-Munihu','Ialibu-Pangia','Nipa-Kutubu','Kagua-Erave','Tari-Pori','Koroba-Lake Kopiago'],
    llgs: {
      'Mendi-Munihu':        ['Mendi Urban','Munihu Rural'],
      'Ialibu-Pangia':       ['Ialibu Rural','Pangia Rural'],
      'Nipa-Kutubu':         ['Nipa Rural','Kutubu Rural'],
      'Kagua-Erave':         ['Kagua Rural','Erave Rural'],
      'Tari-Pori':           ['Tari Urban','Pori Rural'],
      'Koroba-Lake Kopiago': ['Koroba Rural','Lake Kopiago Rural'],
    },
  },
  'Morobe': {
    districts: ['Lae','Markham','Huon Gulf','Nawaeb','Kabwum','Tewai-Siassi','Menyamya','Bulolo','Finschhafen'],
    llgs: {
      'Lae':         ['Lae Urban','Lae Rural','Lae City'],
      'Markham':     ['Markham Rural'],
      'Huon Gulf':   ['Huon Gulf Rural','Kabwum Rural'],
      'Nawaeb':      ['Nawaeb Rural'],
      'Bulolo':      ['Bulolo Urban','Wau Rural'],
      'Finschhafen': ['Finschhafen Rural'],
      'Menyamya':    ['Menyamya Rural'],
      'Tewai-Siassi':['Tewai Rural','Siassi Rural'],
      'Kabwum':      ['Kabwum Rural'],
    },
  },
  'East Sepik': {
    districts: ['Wewak','Wosera-Gawi','Ambunti-Drekikier','Yangoru-Saussia','Maprik','Angoram','Dreikikir'],
    llgs: {
      'Wewak':              ['Wewak Urban','Wewak Rural'],
      'Wosera-Gawi':        ['Wosera Rural','Gawi Rural'],
      'Ambunti-Drekikier':  ['Ambunti Rural'],
      'Yangoru-Saussia':    ['Yangoru Rural'],
      'Maprik':             ['Maprik Rural'],
      'Angoram':            ['Angoram Rural'],
      'Dreikikir':          ['Dreikikir Rural'],
    },
  },
  'East New Britain': {
    districts: ['Kokopo','Rabaul','Gazelle','Pomio','Kandrian-Gloucester'],
    llgs: {
      'Kokopo':               ['Kokopo Urban','Kokopo Rural'],
      'Rabaul':               ['Rabaul Urban','Rabaul Rural'],
      'Gazelle':              ['Gazelle Rural'],
      'Pomio':                ['Pomio Rural'],
      'Kandrian-Gloucester':  ['Kandrian Rural','Gloucester Rural'],
    },
  },
  'New Ireland': {
    districts: ['Kavieng','Namatanai'],
    llgs: {
      'Kavieng':    ['Kavieng Urban','Kavieng Rural'],
      'Namatanai':  ['Namatanai Rural','Tanga Rural'],
    },
  },
};
const PROVINCES = Object.keys(GEO);

/* ─── Sector → sub-sector + climate tagging ──────────────────────────────── */
const SECTOR_DATA = {
  'Agriculture':            { subs: ['Coffee','Cocoa','Vanilla','Kaukau / Root crops','Vegetable farming','Poultry','Piggery','Cattle / Livestock','Mixed crops','Organic farming'], climate: true,  tag: 'Agriculture / Agroforestry' },
  'Fisheries':              { subs: ['Marine fishing','Freshwater fishing','Aquaculture','Fish processing','Crab / prawn','Seaweed farming'], climate: true,  tag: 'Fisheries / Marine' },
  'Forestry / Timber':      { subs: ['Logging','Timber milling','Furniture making','Handicrafts (wood)','Non-timber forest products'], climate: true,  tag: 'Forestry / Land Use' },
  'Tourism':                { subs: ['Guesthouse / lodge','Eco-tourism','Cultural tourism','Dive / water sports','Transport tours'], climate: true,  tag: 'Coastal / Tourism' },
  'Manufacturing':          { subs: ['Food processing','Garments / sewing','Metalwork / welding','Handicrafts','Soap / cosmetics','Packaging','Furniture'], climate: false, tag: '' },
  'Retail':                 { subs: ['General store / trade store','Grocery / supermarket','Hardware','Pharmacy','Clothing / textiles','Electronics','Fuel / oil'], climate: false, tag: '' },
  'Construction':           { subs: ['Civil construction','Building & carpentry','Plumbing','Electrical','Road maintenance'], climate: false, tag: '' },
  'Transport':              { subs: ['PMV / bus','Freight / logistics','Boat / canoe transport','Air charter','Motorcycle taxi'], climate: false, tag: '' },
  'Professional Services':  { subs: ['Accounting / bookkeeping','Legal','Consulting','Engineering','Training / education'], climate: false, tag: '' },
  'ICT & Digital':          { subs: ['Mobile app / software','IT support','Social media management','Printing / copying','Telecommunications'], climate: false, tag: '' },
  'Financial Services':     { subs: ['Money lending','Savings group (ROSCA)','Insurance agent','Superannuation agent'], climate: false, tag: '' },
  'Renewable Energy':       { subs: ['Solar installation','Biogas','Micro-hydro','Energy storage'], climate: true,  tag: 'Renewable Energy' },
  'Water & Sanitation':     { subs: ['Water supply','Waste management','Sanitation services'], climate: true,  tag: 'Water & Sanitation' },
  'Mining & Resources':     { subs: ['Small-scale mining','Quarrying','Petroleum supply'], climate: false, tag: '' },
  'Health & Wellness':      { subs: ['Pharmacy','Clinic / health worker','Traditional medicine','Nutrition'], climate: false, tag: '' },
  'Other':                  { subs: ['Other'], climate: false, tag: '' },
};
const SECTORS = Object.keys(SECTOR_DATA);

const CLIMATE_RISKS = [
  'Flooding','Drought','Landslides','Extreme heat',
  'Crop disease','Coastal erosion','Storm damage','Water scarcity',
  'Pest outbreak','Sea-level rise',
];
const GREEN_PRACTICES = [
  'Composting / organic waste','Rainwater harvesting','Solar energy use',
  'Agroforestry','Reduced chemical inputs','Renewable materials',
  'Water-efficient irrigation','Recycling / upcycling',
  'Mangrove / watershed protection','Carbon-sequestration farming',
];
const SMEC_SUPPORT_OPTS = [
  'Business Skills Training','Financial Literacy','Finance Linkage',
  'Market Linkage','Legal / Registration Support','Technology Training',
  'None',
];
const CHALLENGES_OPTS = [
  'Limited market access','Poor road / transport','Lack of finance / credit',
  'High input costs','Competition from imports','Unreliable power supply',
  'Limited digital / internet access','Climate / weather shocks',
  'Regulatory / licensing burden','Labour / skills shortage',
  'Limited storage / cold chain','Language / literacy barriers',
];
const SUPPORT_OPTS = [
  'Business training','Finance / credit linkage','Market linkage',
  'Technology adoption','Infrastructure','Legal / regulatory','None',
];

const STEPS = [
  { num: 1, label: 'Business & Location' },
  { num: 2, label: 'Owner & Operations'  },
  { num: 3, label: 'Finance & Digital'   },
  { num: 4, label: 'Climate'             },
  { num: 5, label: 'Consent'             },
];

/* ─── GPS simulation (replace with navigator.geolocation in production) ───── */
const GPS_COORDS = { lat: -9.4438, lng: 147.1803, accuracy: 4 }; // Port Moresby centre

/* ─── Initial state ──────────────────────────────────────────────────────── */
const rawEnum = sessionStorage.getItem('tablet_enumerator');
const SESSION_ENUM = rawEnum ? JSON.parse(rawEnum) : { name: 'Demo', province: '', id: 'E001' };

const makeInit = () => ({
  /* auto-filled */
  enumeratorId:       SESSION_ENUM.id,
  enumeratorName:     SESSION_ENUM.name,
  surveyDate:         new Date().toISOString().split('T')[0],
  gpsLat:             GPS_COORDS.lat,
  gpsLng:             GPS_COORDS.lng,
  gpsAccuracy:        GPS_COORDS.accuracy,

  /* step 1 — business */
  businessName:       '',
  legalName:          '',
  registrationType:   '',
  registrationStatus: '',
  ipaRegistration:    '',
  tinIrc:             '',
  gstNumber:          '',
  llgLicence:         '',
  smecSupport:        [],   // multi-select chips

  /* step 1 — location (province pre-filled from enumerator) */
  province:           SESSION_ENUM.province?.split('/')[0].trim() || '',
  district:           '',
  llg:                '',
  wardNumber:         '',
  village:            '',
  operatingLocationType: '',
  urbanRural:         '',

  /* step 2 — owner */
  ownerName:          '',
  ownerGender:        '',
  ownerAge:           '',
  womenLed:           null,
  youthLed:           null,
  pwdOwned:           null,
  femaleDecisionMaker: null,
  sharedOwnership:    null,

  /* step 2 — operations */
  sector:             '',
  subSector:          '',
  yearEstablished:    '',
  size:               '',
  employees:          '',
  employeesMale:      '',
  employeesFemale:    '',
  revenueRange:       '',
  weeklyTurnoverBand: '',
  incomeSeasonality:  '',
  supplyChainRole:    '',
  transportConstraint:'',
  markets:            '',

  /* step 3 — financial */
  bankingStatus:      '',
  accessToFinance:    '',
  financeSource:      '',
  mobileMoney:        '',
  loanHistory:        '',
  savingsGroup:       null,

  /* step 3 — digital */
  basicPhone:         null,
  smartphone:         null,
  internetAccess:     null,
  socialMediaSelling: null,
  ecommercePlatform:  null,
  challenges:         [],   // multi-select chips
  supportNeeds:       '',

  /* step 4 — climate (auto-derived where possible) */
  climateSensitiveSector: null,
  sectorTag:          '',
  climateRisksFaced:  [],
  greenPractices:     [],
  resilienceInvestments: '',

  /* step 5 — consent */
  dataSharingConsent: null,
  photoUrl:           null,
});

export default function TabletSurvey() {
  const navigate = useNavigate();
  const { saveSurvey } = useSME();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(makeInit());
  const [completedSteps, setCompletedSteps] = useState(new Set());

  /* ── Auto-derive climate fields when sector changes ── */
  useEffect(() => {
    if (!data.sector) return;
    const sd = SECTOR_DATA[data.sector];
    if (!sd) return;
    setData(prev => ({
      ...prev,
      climateSensitiveSector: sd.climate ? true : false,
      sectorTag: sd.tag || '',
    }));
  }, [data.sector]);

  /* ── Auto-derive womenLed from ownerGender ── */
  useEffect(() => {
    if (data.ownerGender === 'Female' && data.womenLed === null) {
      setData(prev => ({ ...prev, womenLed: true, femaleDecisionMaker: true }));
    }
  }, [data.ownerGender]);

  /* ── Auto-derive youthLed from ownerAge ── */
  useEffect(() => {
    if (data.ownerAge === '18–35' && data.youthLed === null) {
      setData(prev => ({ ...prev, youthLed: true }));
    }
  }, [data.ownerAge]);

  /* ── Auto-clear digital fields if no smartphone ── */
  useEffect(() => {
    if (data.smartphone === false) {
      setData(prev => ({
        ...prev,
        ecommercePlatform: false,
        socialMediaSelling: prev.socialMediaSelling === true ? null : prev.socialMediaSelling,
      }));
    }
  }, [data.smartphone]);

  /* ── Reset district/LLG when province changes ── */
  useEffect(() => {
    setData(prev => ({ ...prev, district: '', llg: '' }));
  }, [data.province]);

  /* ── Reset LLG when district changes ── */
  useEffect(() => {
    setData(prev => ({ ...prev, llg: '' }));
  }, [data.district]);

  /* ── Reset sub-sector when sector changes ── */
  useEffect(() => {
    setData(prev => ({ ...prev, subSector: '' }));
  }, [data.sector]);

  const set = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const toggleArr = (field, val) => {
    const cur = data[field] || [];
    setData(prev => ({
      ...prev,
      [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val],
    }));
  };

  /* ── Skip climate step if sector is not climate-sensitive ── */
  const isClimateSector = data.sector ? (SECTOR_DATA[data.sector]?.climate ?? true) : true;

  const nextStep = (cur) => {
    if (cur === 3 && !isClimateSector) return 5; // skip step 4
    return cur + 1;
  };
  const prevStep = (cur) => {
    if (cur === 5 && !isClimateSector) return 3; // skip step 4
    return cur - 1;
  };

  const goTo = (n) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    setStep(n);
  };
  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const next = nextStep(step);
    if (next > 5) navigate('/tablet/survey/review', { state: { surveyData: data } });
    else setStep(next);
  };
  const handleBack = () => {
    if (step === 1) navigate('/tablet/dashboard');
    else setStep(prevStep(step));
  };

  /* ─── Reusable components ─────────────────────────────────── */
  const Field = ({ label, children, full, hint }) => (
    <div className={`t-field${full ? ' t-full' : ''}`}>
      <label className="t-label">{label}{hint && <span style={{ fontWeight: 400, color: '#888', marginLeft: 6 }}>{hint}</span>}</label>
      {children}
    </div>
  );

  const Input = ({ field, placeholder, type = 'text', disabled }) => (
    <input className="t-input" type={type}
      value={data[field] || ''} placeholder={placeholder}
      disabled={disabled}
      style={disabled ? { background: '#f5f5f5', color: '#999' } : {}}
      onChange={e => set(field, e.target.value)} />
  );

  const Select = ({ field, opts, placeholder = 'Select…', disabled }) => (
    <select className="t-select" value={data[field] || ''}
      disabled={disabled}
      style={disabled ? { background: '#f5f5f5', color: '#999' } : {}}
      onChange={e => set(field, e.target.value)}>
      <option value="">{placeholder}</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );

  const RadioPills = ({ field, opts }) => (
    <div className="t-radio-group">
      {opts.map(o => (
        <label key={o} className={`t-radio-btn ${data[field] === o ? 'selected' : ''}`}>
          <input type="radio" name={field} value={o}
            checked={data[field] === o} onChange={() => set(field, o)} />
          {o}
        </label>
      ))}
    </div>
  );

  const YesNo = ({ field, label, autoValue }) => (
    <Field label={label} hint={autoValue != null ? '(auto)' : undefined}>
      <div className="t-toggle-group">
        <button
          className={`t-toggle yes ${data[field] === true ? 'active' : ''}`}
          onClick={() => set(field, data[field] === true ? null : true)}
        >✓ Yes</button>
        <button
          className={`t-toggle no ${data[field] === false ? 'active' : ''}`}
          onClick={() => set(field, data[field] === false ? null : false)}
        >✗ No</button>
      </div>
    </Field>
  );

  const ChipSelect = ({ field, opts, label, full }) => (
    <Field label={label} full={full}>
      <div className="t-check-list">
        {opts.map(o => (
          <label key={o}
            className={`t-check-item ${(data[field] || []).includes(o) ? 'checked' : ''}`}>
            <input type="checkbox"
              checked={(data[field] || []).includes(o)}
              onChange={() => toggleArr(field, o)} />
            {o}
          </label>
        ))}
      </div>
    </Field>
  );

  const AutoBadge = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
      background: '#E8F5E9', borderRadius: 8, fontSize: 13, color: '#2E7D32', marginBottom: 4 }}>
      <span>📍</span><strong>Auto:</strong> {label}
    </div>
  );

  /* ─── Cascading geography helpers ─────────────────────────── */
  const districts = data.province ? (GEO[data.province]?.districts || []) : [];
  const llgs      = (data.province && data.district)
    ? (GEO[data.province]?.llgs?.[data.district] || [])
    : [];
  const subSectors = data.sector ? (SECTOR_DATA[data.sector]?.subs || []) : [];
  const wardOpts  = Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`);

  /* ─── Step renders ─────────────────────────────────────────── */
  const renderStep = () => {
    switch (step) {

      /* ══ Step 1: Business & Location ══════════════════════════ */
      case 1: return (
        <div>
          <div className="t-step-header">
            <div className="t-step-title">🏢 Business Identity &amp; Location</div>
            <div className="t-step-desc">Registration details — GPS and province pre-filled automatically</div>
          </div>

          {/* Auto-filled banner */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <AutoBadge label={`GPS: ${GPS_COORDS.lat}° S, ${GPS_COORDS.lng}° E ±${GPS_COORDS.accuracy}m`} />
            <AutoBadge label={`Enumerator: ${data.enumeratorName} · ${data.surveyDate}`} />
          </div>

          <div className="t-section-divider">Business Registration</div>
          <div className="t-form-grid">
            <Field label="Trading / Business Name *">
              <Input field="businessName" placeholder="e.g., Goroka Coffee Beans" />
            </Field>
            <Field label="Legal / Registered Name">
              <Input field="legalName" placeholder="e.g., Goroka Coffee Beans Pty Ltd" />
            </Field>
            <Field label="Registration Type *">
              <Select field="registrationType" opts={['Formal - Registered Company','Formal - Cooperative','Informal','Informal - Cooperative']} />
            </Field>
            <Field label="Registration Status">
              <Select field="registrationStatus" opts={['Active','Inactive','Under Review']} />
            </Field>

            {/* IPA/TIN/GST hidden for informal */}
            {data.registrationType && !data.registrationType.startsWith('Informal') ? (<>
              <Field label="IPA Registration Number">
                <Input field="ipaRegistration" placeholder="IPA-YYYY-XXXXX" />
              </Field>
              <Field label="TIN (IRC Tax ID)">
                <Input field="tinIrc" placeholder="TIN-XXXXXX" />
              </Field>
              <Field label="GST Number">
                <Input field="gstNumber" placeholder="GST-XXXXXX" />
              </Field>
              <Field label="LLG Trading Licence">
                <Input field="llgLicence" placeholder="LLG-XXXXXX" />
              </Field>
            </>) : data.registrationType.startsWith('Informal') ? (
              <div className="t-full" style={{ padding: '8px 12px', background: '#FFF8E1',
                borderRadius: 8, fontSize: 13, color: '#E65100' }}>
                ℹ️ Informal business — IPA/TIN/GST fields not applicable
              </div>
            ) : null}

            <ChipSelect field="smecSupport" opts={SMEC_SUPPORT_OPTS}
              label="SMEC Support Received (select all)" full />
          </div>

          <div className="t-section-divider" style={{ marginTop: 16 }}>Location</div>
          <div className="t-form-grid">
            <Field label="Province *" hint={data.province ? '(pre-filled from session)' : ''}>
              <Select field="province" opts={PROVINCES} placeholder="Select Province" />
            </Field>
            <Field label="District *">
              <Select field="district" opts={districts} placeholder={data.province ? 'Select District' : 'Select province first'}
                disabled={!data.province} />
            </Field>
            <Field label="LLG">
              <Select field="llg" opts={llgs} placeholder={data.district ? 'Select LLG' : 'Select district first'}
                disabled={!data.district} />
            </Field>
            <Field label="Ward Number">
              <Select field="wardNumber" opts={wardOpts} placeholder="Select Ward"
                disabled={!data.district} />
            </Field>
            <Field label="Village / Town / Suburb">
              <Input field="village" placeholder="e.g., Kainantu Town, Waigani" />
            </Field>
            <Field label="Operating Location Type">
              <Select field="operatingLocationType" opts={['Fixed Premises','Market Stall','Mobile / Roadside','Home-based','Online Only']} />
            </Field>
            <Field label="Urban / Rural" full>
              <RadioPills field="urbanRural" opts={['Urban','Peri-Urban','Rural']} />
            </Field>
          </div>
        </div>
      );

      /* ══ Step 2: Owner & Operations ═══════════════════════════ */
      case 2: return (
        <div>
          <div className="t-step-header">
            <div className="t-step-title">👥 Owner &amp; Business Operations</div>
            <div className="t-step-desc">GEDSI characteristics and business details — some fields auto-set from gender/age</div>
          </div>

          <div className="t-section-divider">Owner / Manager</div>
          <div className="t-form-grid">
            <Field label="Owner / Manager Name">
              <Input field="ownerName" placeholder="Full name" />
            </Field>
            <Field label="Owner Gender *">
              <Select field="ownerGender" opts={['Female','Male','Non-binary / Other','Prefer not to say']} />
            </Field>
            <Field label="Owner Age Range *">
              <Select field="ownerAge" opts={['Under 18','18–35','36–50','51–64','65+']} />
            </Field>
            <div /> {/* spacer */}
            <YesNo field="womenLed"            label="Women-Led (≥51% owned/managed by women)"
              autoValue={data.ownerGender === 'Female' ? true : null} />
            <YesNo field="youthLed"            label="Youth-Led (18–35)"
              autoValue={data.ownerAge === '18–35' ? true : null} />
            <YesNo field="pwdOwned"            label="Person with Disability (PWD) Owned" />
            <YesNo field="femaleDecisionMaker" label="Female Primary Decision Maker"
              autoValue={data.ownerGender === 'Female' ? true : null} />
            <YesNo field="sharedOwnership"     label="Shared / Co-ownership Arrangement" />
          </div>

          <div className="t-section-divider" style={{ marginTop: 16 }}>Business Operations</div>
          <div className="t-form-grid">
            <Field label="Sector *">
              <Select field="sector" opts={SECTORS} placeholder="Select Sector" />
            </Field>
            <Field label="Sub-sector" hint={data.sector ? '' : '(select sector first)'}>
              <Select field="subSector" opts={subSectors}
                placeholder={data.sector ? 'Select Sub-sector' : 'Select sector first'}
                disabled={!data.sector} />
            </Field>
            <Field label="Year Established">
              <Select field="yearEstablished" opts={
                Array.from({ length: 35 }, (_, i) => String(2024 - i))
              } placeholder="Select year" />
            </Field>
            <Field label="Business Size">
              <Select field="size" opts={['Micro (1–4 employees)','Small (5–19 employees)','Medium (20–99 employees)']} />
            </Field>
            <Field label="Total Employees *">
              <Select field="employees" opts={['1','2','3','4','5–9','10–19','20–49','50–99','100+']} />
            </Field>
            <Field label="Male Employees">
              <Select field="employeesMale" opts={['0','1','2','3','4','5–9','10–19','20+']} />
            </Field>
            <Field label="Female Employees">
              <Select field="employeesFemale" opts={['0','1','2','3','4','5–9','10–19','20+']} />
            </Field>
            <Field label="Monthly Revenue Range (PGK)">
              <Select field="revenueRange" opts={['Under K1,000','K1,000–K5,000','K5,001–K20,000','K20,001–K100,000','Over K100,000']} />
            </Field>
            <Field label="Weekly Turnover Band (PGK)">
              <Select field="weeklyTurnoverBand" opts={['Under K200','K200–K500','K501–K2,000','Over K2,000']} />
            </Field>
            <Field label="Income Seasonality">
              <Select field="incomeSeasonality" opts={['Year-round','Seasonal (1–2 peaks)','Highly seasonal']} />
            </Field>
            <Field label="Supply Chain Role">
              <Select field="supplyChainRole" opts={['Producer / Grower','Processor','Wholesaler','Retailer','Service Provider','Exporter']} />
            </Field>
            <Field label="Transport Constraint">
              <Select field="transportConstraint" opts={['None','Minor','Moderate','Severe']} />
            </Field>
            <Field label="Markets Served" full>
              <Select field="markets" opts={['Local community only','District market','Provincial capital','National market','Export']} />
            </Field>
          </div>
        </div>
      );

      /* ══ Step 3: Finance & Digital ════════════════════════════ */
      case 3: return (
        <div>
          <div className="t-step-header">
            <div className="t-step-title">💰 Financial Inclusion &amp; Digital</div>
            <div className="t-step-desc">Banking access, credit history and technology adoption</div>
          </div>

          <div className="t-section-divider">Financial Access</div>
          <div className="t-form-grid">
            <Field label="Banking Status *">
              <Select field="bankingStatus" opts={['Fully banked','Under-banked','Unbanked']} />
            </Field>
            <Field label="Access to Finance">
              <Select field="accessToFinance" opts={['Yes – formal loan','Yes – informal only','No – applied and rejected','No – never applied']} />
            </Field>
            <Field label="Main Finance Source">
              <Select field="financeSource" opts={['Bank loan','MFI / NCSL','Savings group (ROSCA)','Family / friends','NGO / grant','None']} />
            </Field>
            <Field label="Mobile Money Provider">
              <Select field="mobileMoney" opts={['BSP Kundu','Digicel Easipay','Westpac / MiBank','None','Multiple providers']} />
            </Field>
            <Field label="Loan History">
              <Select field="loanHistory" opts={['None','Repaid in full','Currently repaying','Defaulted']} />
            </Field>
            <YesNo field="savingsGroup" label="Member of Savings / ROSCA Group" />
          </div>

          <div className="t-section-divider" style={{ marginTop: 16 }}>Digital Adoption</div>
          <div className="t-form-grid">
            <YesNo field="basicPhone"     label="Has Basic Mobile Phone" />
            <YesNo field="smartphone"     label="Has Smartphone" />
            <YesNo field="internetAccess" label="Internet Access (regular)" />
            <YesNo field="socialMediaSelling" label="Sells via Social Media (Facebook etc.)"  />
            <Field label="E-commerce Platform" hint={data.smartphone === false ? '(auto: No — no smartphone)' : ''}>
              <div className="t-toggle-group">
                <button className={`t-toggle yes ${data.ecommercePlatform === true ? 'active' : ''}`}
                  disabled={data.smartphone === false}
                  style={data.smartphone === false ? { opacity: 0.4 } : {}}
                  onClick={() => set('ecommercePlatform', data.ecommercePlatform === true ? null : true)}>
                  ✓ Yes</button>
                <button className={`t-toggle no ${data.ecommercePlatform === false ? 'active' : ''}`}
                  onClick={() => set('ecommercePlatform', data.ecommercePlatform === false ? null : false)}>
                  ✗ No</button>
              </div>
            </Field>
            <div /> {/* spacer */}
            <ChipSelect field="challenges" opts={CHALLENGES_OPTS}
              label="Main Operational Challenges (select all)" full />
            <Field label="Priority Support Need" full>
              <Select field="supportNeeds" opts={SUPPORT_OPTS} />
            </Field>
          </div>
        </div>
      );

      /* ══ Step 4: Climate & Resilience (skipped for non-climate sectors) ══ */
      case 4: return (
        <div>
          <div className="t-step-header">
            <div className="t-step-title">🌿 Climate &amp; Resilience</div>
            <div className="t-step-desc">
              NDC alignment module — climate sensitivity auto-tagged from sector
            </div>
          </div>

          {/* Auto-tag banner */}
          {data.sector && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <AutoBadge label={`Sector: ${data.sector} → Climate-sensitive: ${data.climateSensitiveSector ? 'Yes' : 'No'}`} />
              {data.sectorTag && <AutoBadge label={`NDC Tag: ${data.sectorTag}`} />}
            </div>
          )}

          <div className="t-form-grid">
            <YesNo field="climateSensitiveSector" label="Climate-Sensitive Sector (NDC-tagged)"
              autoValue={data.sector ? (SECTOR_DATA[data.sector]?.climate ?? null) : null} />
            <Field label="Climate Sector Tag" hint="(auto-set from sector)">
              <Select field="sectorTag" opts={['Agriculture / Agroforestry','Fisheries / Marine','Water & Sanitation','Renewable Energy','Forestry / Land Use','Coastal / Tourism','Other']}
                disabled={!!data.sectorTag} />
            </Field>
            <Field label="Resilience Investments">
              <Select field="resilienceInvestments" opts={['None','Minimal','Moderate','Significant']} />
            </Field>
            <div />
            <ChipSelect field="climateRisksFaced" opts={CLIMATE_RISKS}
              label="Climate Risks Faced (select all that apply)" full />
            <ChipSelect field="greenPractices" opts={GREEN_PRACTICES}
              label="Green Practices Adopted (select all that apply)" full />
          </div>
        </div>
      );

      /* ══ Step 5: Consent ══════════════════════════════════════ */
      case 5: return (
        <div>
          <div className="t-step-header">
            <div className="t-step-title">🔒 Privacy &amp; Photo Consent</div>
            <div className="t-step-desc">Informed consent and photo documentation</div>
          </div>
          <div className="t-form-grid one">
            <div className="t-card" style={{ background: '#FFF8E1', border: '1px solid #FFD54F' }}>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#555' }}>
                <strong>Data Consent Statement (read aloud in Tok Pisin if needed):</strong><br /><br />
                "Ol informesen yu givim bai GGGI, SMEC na Gavman PNG usim long helpim bisnis sapot.
                Ol data bai stap seif na sharem olsem anonymised information tasol, sapos yu no agree narapela wei.
                Yu inap rausim consent long wanem taim."<br /><br />
                <em>"The information you provide will be used by GGGI, SMEC and the PNG Government to improve business
                support services. Your data will be stored securely and shared only in anonymised form.
                You may withdraw consent at any time."</em>
              </div>
            </div>
            <YesNo field="dataSharingConsent" label="Respondent agrees to data collection and sharing (informed consent given) *" />
            <Field label="Owner / Premises Photo">
              <input type="file" accept="image/*" capture="environment"
                style={{ fontSize: 14, padding: '10px 0' }}
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => set('photoUrl', r.result);
                    r.readAsDataURL(f);
                  }
                }} />
              {data.photoUrl && (
                <img src={data.photoUrl} alt="Preview"
                  style={{ marginTop: 8, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />
              )}
            </Field>
          </div>
        </div>
      );

      default: return null;
    }
  };

  /* ─── Validation ──────────────────────────────────────────── */
  const isValid = () => {
    if (step === 1) return data.businessName.trim() !== '' && data.registrationType !== '' && data.province !== '' && data.district.trim() !== '';
    if (step === 2) return data.ownerGender !== '' && data.ownerAge !== '' && data.sector !== '';
    if (step === 3) return data.bankingStatus !== '';
    if (step === 5) return data.dataSharingConsent === true;
    return true;
  };

  /* ─── Visible steps (skip 4 for non-climate sectors) ─────── */
  const visibleSteps = isClimateSector ? STEPS : STEPS.filter(s => s.num !== 4);
  const totalVisible = visibleSteps.length;
  const visibleIdx   = visibleSteps.findIndex(s => s.num === step);
  const pct          = Math.round(((visibleIdx + 1) / totalVisible) * 100);

  return (
    <>
      {/* Top bar */}
      <div className="tablet-topbar">
        <div>
          <div className="topbar-title">
            {STEPS.find(s => s.num === step)?.icon} {STEPS.find(s => s.num === step)?.label}
          </div>
          <div className="topbar-sub">
            Step {visibleIdx + 1} of {totalVisible} · {pct}% complete
            {!isClimateSector && step >= 3 && (
              <span style={{ marginLeft: 8, color: '#4CAF50', fontSize: 11 }}>
                ✓ Climate step skipped (non-climate sector)
              </span>
            )}
          </div>
        </div>
        <div className="topbar-actions">
          {visibleSteps.map(s => (
            <button
              key={s.num}
              className={`t-btn ${s.num === step ? 't-btn-primary' : completedSteps.has(s.num) ? 't-btn-secondary' : 't-btn-ghost'}`}
              style={{ minHeight: 36, padding: '6px 12px', fontSize: 12 }}
              onClick={() => goTo(s.num)}
            >
              {completedSteps.has(s.num) ? '✓' : visibleSteps.findIndex(vs => vs.num === s.num) + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="tablet-progress">
        <div className="tablet-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Content */}
      <div className="tablet-content">
        {renderStep()}
      </div>

      {/* Bottom bar */}
      <div className="tablet-bottom-bar">
        <button className="t-btn t-btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <div className="step-counter">Step {visibleIdx + 1} / {totalVisible}</div>
        <button
          className="t-btn t-btn-primary"
          onClick={handleNext}
          disabled={!isValid()}
        >
          {step === 5 ? '📋 Review & Submit' : 'Next →'}
        </button>
      </div>
    </>
  );
}
