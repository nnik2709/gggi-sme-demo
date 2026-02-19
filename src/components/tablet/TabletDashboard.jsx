import { useNavigate } from 'react-router-dom';
import './tablet.css';

// Daily lists keyed by enumerator ID — drawn from actual 9-province coverage plan
const DAILY_LISTS = {
  E001: [ // Mary Kapi — Eastern Highlands (target: 8/day)
    { id: 1, name: 'Goroka Coffee Beans',       location: 'Goroka Urban, Ward 3',     status: 'done',   sector: 'Agriculture' },
    { id: 2, name: 'Simbu Highland Honey',      location: 'Kainantu, Ward 2',         status: 'done',   sector: 'Agriculture' },
    { id: 3, name: 'EH Fresh Produce Co-op',    location: 'Goroka Market',            status: 'active', sector: 'Agriculture' },
    { id: 4, name: 'Kundu Handicraft Stall',    location: 'Goroka Arts Centre',       status: 'queue',  sector: 'Manufacturing' },
    { id: 5, name: 'Raun Raun Guesthouse',      location: 'Kainantu Road',            status: 'queue',  sector: 'Tourism' },
    { id: 6, name: 'Goroka Hardware & Steel',   location: 'Goroka CBD',               status: 'queue',  sector: 'Retail' },
    { id: 7, name: 'EH Poultry Supplies',       location: 'Goroka Peri-Urban',        status: 'queue',  sector: 'Agriculture' },
    { id: 8, name: 'Kainantu Auto Parts',       location: 'Kainantu Town',            status: 'queue',  sector: 'Services' },
  ],
  E002: [ // James Waupa — Morobe & East Sepik (target: 6/day — remoteness factor)
    { id: 1, name: 'Lae Transport Services',    location: 'Lae Urban, Ward 7',        status: 'done',   sector: 'Transport' },
    { id: 2, name: 'Wewak Fisheries Co-op',     location: 'Wewak Urban, Ward 8',      status: 'done',   sector: 'Fisheries' },
    { id: 3, name: 'Morobe Coastal Tuna',       location: 'Huon Gulf, Ward 12',       status: 'active', sector: 'Fisheries' },
    { id: 4, name: 'East Sepik Sago Products',  location: 'Ambunti Rural LLG',        status: 'queue',  sector: 'Agriculture' },
    { id: 5, name: 'Lae Bakery & Catering',     location: 'Lae CBD',                  status: 'queue',  sector: 'Retail' },
    { id: 6, name: 'Wewak Market Cooperative',  location: 'Wewak Town Market',        status: 'queue',  sector: 'Agriculture' },
  ],
  E003: [ // Susan Iri — National Capital District (target: 10/day — urban density)
    { id: 1, name: 'Port Moresby Bakery',       location: 'Moresby North-East, W11',  status: 'done',   sector: 'Retail' },
    { id: 2, name: 'NCD Tech Solutions',        location: 'Boroko, Ward 6',           status: 'done',   sector: 'ICT & Digital' },
    { id: 3, name: 'Moresby South Sewing',      location: 'Moresby South, Ward 3',    status: 'done',   sector: 'Manufacturing' },
    { id: 4, name: 'Hiri Moale Women Bilum',    location: 'Kairuku-Hiri, Ward 4',     status: 'done',   sector: 'Manufacturing' },
    { id: 5, name: 'NCD Waigani Food Stall',    location: 'Waigani, Ward 7',          status: 'active', sector: 'Retail' },
    { id: 6, name: 'Waigani Pharmacy Ltd',      location: 'Waigani Drive',            status: 'queue',  sector: 'Services' },
    { id: 7, name: 'Gerehu Tailoring Group',    location: 'Gerehu Stage 3',           status: 'queue',  sector: 'Manufacturing' },
    { id: 8, name: 'Tokarara Grocery Store',    location: 'Tokarara, Ward 2',         status: 'queue',  sector: 'Retail' },
    { id: 9, name: 'Boroko Print & Copy',       location: 'Boroko CBD',               status: 'queue',  sector: 'Services' },
    { id: 10, name: 'Waigani Catering Hub',     location: 'Moresby North-West',       status: 'queue',  sector: 'Retail' },
  ],
  E004: [ // Paul Moka — Western Highlands, Southern Highlands, Enga (target: 7/day)
    { id: 1, name: 'Mt Hagen Market Coop',      location: 'Mt Hagen Urban, Ward 5',   status: 'done',   sector: 'Agriculture' },
    { id: 2, name: 'Enga Highlands Kaukau',     location: 'Wabag, Ward 1',            status: 'done',   sector: 'Agriculture' },
    { id: 3, name: 'Southern Highlands Petrol', location: 'Mendi Urban, Ward 6',      status: 'done',   sector: 'Retail' },
    { id: 4, name: 'Wabag Auto Repairs',        location: 'Wabag Urban, Ward 3',      status: 'active', sector: 'Services' },
    { id: 5, name: 'Mt Hagen Welding Works',    location: 'Mt Hagen Industrial',      status: 'queue',  sector: 'Manufacturing' },
    { id: 6, name: 'Mendi Women Bilum Group',   location: 'Mendi Town',               status: 'queue',  sector: 'Manufacturing' },
    { id: 7, name: 'Highlands Fresh Produce',   location: 'Tambul-Nebilyer LLG',      status: 'queue',  sector: 'Agriculture' },
  ],
};

const rawEnum = sessionStorage.getItem('tablet_enumerator');
const activeEnum = rawEnum ? JSON.parse(rawEnum) : { id: 'E001' };
const TODAY_LIST = DAILY_LISTS[activeEnum.id] || DAILY_LISTS['E001'];

const STATUS_MAP = {
  done:   { label: 'Completed', cls: 'done' },
  active: { label: 'In Progress', cls: 'pending' },
  queue:  { label: 'Queued', cls: 'new' },
};

export default function TabletDashboard() {
  const navigate  = useNavigate();
  const rawEnum   = sessionStorage.getItem('tablet_enumerator');
  const enumerator = rawEnum ? JSON.parse(rawEnum) : { name: 'Demo User', province: 'Eastern Highlands', target: 8 };
  const done       = TODAY_LIST.filter(t => t.status === 'done').length;
  const target     = enumerator.target || TODAY_LIST.length;

  return (
    <>
      {/* Top bar */}
      <div className="tablet-topbar">
        <div>
          <div className="topbar-title">Good morning, {enumerator.name.split(' ')[0]}</div>
          <div className="topbar-sub">{new Date().toLocaleDateString('en-PG', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} · {enumerator.province}</div>
        </div>
        <div className="topbar-actions">
          <button className="t-btn t-btn-primary" onClick={() => navigate('/tablet/survey')}>
            New Survey
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="tablet-progress">
        <div className="tablet-progress-fill" style={{ width: `${Math.round((done / target) * 100)}%` }} />
      </div>

      {/* Content */}
      <div className="tablet-content">
        {/* KPIs */}
        <div className="t-dash-grid">
          <div className="t-kpi">
            <div>
              <div className="t-kpi-val" style={{ color: '#2E7D32' }}>{done}</div>
              <div className="t-kpi-lab">Completed Today</div>
            </div>
          </div>
          <div className="t-kpi">
            <div>
              <div className="t-kpi-val">{target}</div>
              <div className="t-kpi-lab">Daily Target</div>
            </div>
          </div>
          <div className="t-kpi">
            <div>
              <div className="t-kpi-val">{Math.round((done / target) * 100)}%</div>
              <div className="t-kpi-lab">Progress</div>
            </div>
          </div>
        </div>

        {/* GPS Status */}
        <div className="t-gps-row" style={{ marginBottom: 14 }}>
          GPS Active · {enumerator.province} · 6.0822° S, 145.3876° E &nbsp;|&nbsp; Accuracy: ±4m
        </div>

        {/* Today's Survey List */}
        <div className="t-card">
          <div className="t-card-title">Today's Assignment — {enumerator.province}</div>
          <div className="t-today-list">
            {TODAY_LIST.map(item => {
              const s = STATUS_MAP[item.status];
              return (
                <div
                  key={item.id}
                  className="t-today-item"
                  onClick={() => item.status !== 'done' && navigate('/tablet/survey')}
                >
                  <div className={`t-today-dot ${item.status}`} />
                  <div style={{ flex: 1 }}>
                    <div className="t-today-name">{item.name}</div>
                    <div className="t-today-loc">{item.location} · {item.sector}</div>
                  </div>
                  <span className={`t-today-badge ${s.cls}`}>{s.label}</span>
                  {item.status !== 'done' && (
                    <button
                      className="t-btn t-btn-primary"
                      style={{ fontSize: 12, padding: '8px 14px', minHeight: 36 }}
                      onClick={e => { e.stopPropagation(); navigate('/tablet/survey'); }}
                    >
                      {item.status === 'active' ? 'Continue' : 'Start'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick tips */}
        <div className="t-card" style={{ borderLeft: '4px solid #E65100' }}>
          <div className="t-card-title" style={{ color: '#E65100' }}>Field Tips</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#555', lineHeight: 1.8 }}>
            <li>Always capture GPS before starting each survey</li>
            <li>Ask for IPA certificate or business licence to verify registration number</li>
            <li>Take photo of owner/premises with consent (Step 8)</li>
            <li>Data auto-saves offline — sync when you reach Wi-Fi</li>
          </ul>
        </div>
      </div>
    </>
  );
}
