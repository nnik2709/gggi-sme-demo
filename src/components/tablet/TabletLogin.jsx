import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tablet.css';

// Enumerators aligned to 9-province coverage plan
// Targets reflect daily quotas: urban (NCD ~10), Highlands ~7-8, remote coastal ~5-6
const ENUMERATORS = [
  { id: 'E001', name: 'Mary Kapi',   province: 'Eastern Highlands',    target: 8,  coverage: 'Eastern Highlands' },
  { id: 'E002', name: 'James Waupa', province: 'Morobe / East Sepik',  target: 6,  coverage: 'Morobe + East Sepik' },
  { id: 'E003', name: 'Susan Iri',   province: 'National Capital District', target: 10, coverage: 'NCD + Central' },
  { id: 'E004', name: 'Paul Moka',   province: 'Western Highlands',    target: 7,  coverage: 'W. Highlands + S. Highlands + Enga' },
];

export default function TabletLogin() {
  const navigate = useNavigate();
  const [enumId, setEnumId]   = useState('');
  const [pin, setPin]         = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!enumId) { setError('Please select your enumerator ID.'); return; }
    if (pin.length < 4) { setError('PIN must be at least 4 digits.'); return; }
    setLoading(true);
    setTimeout(() => {
      const found = ENUMERATORS.find(e => e.id === enumId);
      if (found) {
        sessionStorage.setItem('tablet_enumerator', JSON.stringify(found));
        navigate('/tablet/dashboard');
      } else {
        setError('Enumerator not found.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="tablet-login">
      {/* Portrait hint */}
      <div className="tablet-rotate-hint">
        <div className="tablet-rotate-hint-icon"></div>
        <div className="tablet-rotate-hint-text">Please rotate your tablet to landscape mode</div>
      </div>

      <div className="tablet-login-card">
        <div className="login-title">GGGI PNG SME Survey</div>
        <div className="login-sub">Field Data Collection — Enumerator Login<br />SMEC / Eywa Systems</div>

        <div className="login-field">
          <label className="login-label">Enumerator ID</label>
          <select className="login-input" value={enumId} onChange={e => setEnumId(e.target.value)}>
            <option value="">Select your ID…</option>
            {ENUMERATORS.map(e => (
              <option key={e.id} value={e.id}>{e.id} — {e.name} ({e.province})</option>
            ))}
          </select>
        </div>

        <div className="login-field">
          <label className="login-label">PIN (demo: any 4+ digits)</label>
          <input
            className="login-input"
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
          />
        </div>

        {error && (
          <div style={{ color: '#C62828', fontSize: 13, marginBottom: 8 }}>{error}</div>
        )}

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <div className="login-offline-note">
          Works offline — data synced when connected
        </div>
      </div>
    </div>
  );
}
