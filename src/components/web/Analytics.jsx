import { useSME } from '../../context/SMEContext';
import './Analytics.css';

function ScoreBar({ value, max = 100, color = '#2E7D32' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-bar-label">{value}</span>
    </div>
  );
}

function DonutChart({ segments, size = 140 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const r = 50, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth="20" />
      {segments.map((seg, i) => {
        const frac = seg.value / total;
        const offset = circumference * (1 - cumulative - frac);
        const dash = circumference * frac;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth="20"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        );
        cumulative += frac;
        return el;
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize="22" fontWeight="700" fill="#333">{total}</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="10" fill="#666">total</text>
    </svg>
  );
}

export default function Analytics() {
  const { smes, getStatistics } = useSME();
  const stats = getStatistics();

  // GEDSI breakdown
  const gedsiData = [
    { label: 'Women-Led', value: stats.womenLed, color: '#E91E63' },
    { label: 'Youth-Led', value: stats.youthLed, color: '#9C27B0' },
    { label: 'PWD-Owned', value: stats.pwdOwned, color: '#FF9800' },
    { label: 'Female Decision-Maker', value: stats.femaleDecisionMaker, color: '#3F51B5' },
  ];

  // Finance breakdown
  const banked = smes.filter(s => s.banking_status && !s.banking_status.includes('Unbanked')).length;
  const unbanked = smes.length - banked;
  const mobileMoneyUsers = smes.filter(s => s.mobile_money_usage && s.mobile_money_usage !== 'None').length;
  const savingsGroupMembers = smes.filter(s => s.savings_group_member).length;
  const financeAccess = smes.filter(s => s.access_to_finance).length;

  // Credit readiness distribution
  const creditBands = {
    'High (80–100)': smes.filter(s => (s.credit_readiness_score || 0) >= 80).length,
    'Medium (50–79)': smes.filter(s => (s.credit_readiness_score || 0) >= 50 && (s.credit_readiness_score || 0) < 80).length,
    'Low (0–49)': smes.filter(s => (s.credit_readiness_score || 0) < 50).length,
  };
  const creditColors = { 'High (80–100)': '#2E7D32', 'Medium (50–79)': '#FF9800', 'Low (0–49)': '#F44336' };

  // Climate breakdown
  const climateSensitive = smes.filter(s => s.climate?.climate_sensitive_sector).length;
  const hasGreenPractices = smes.filter(s => s.climate?.green_practices?.length > 0 && !s.climate.green_practices.includes('None')).length;
  const topClimateRisks = {};
  smes.forEach(s => {
    (s.climate?.climate_risks_faced || []).forEach(r => {
      topClimateRisks[r] = (topClimateRisks[r] || 0) + 1;
    });
  });
  const sortedRisks = Object.entries(topClimateRisks).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // IPA/TIN verification
  const ipaVerified = smes.filter(s => s.ipa_verified).length;
  const tinVerified = smes.filter(s => s.tin_verified).length;
  const dualVerified = smes.filter(s => s.ipa_verified && s.tin_verified).length;

  // Avg data quality
  const avgQuality = smes.length
    ? Math.round(smes.reduce((sum, s) => sum + (s.data_quality_score || 0), 0) / smes.length)
    : 0;

  // Sector donut data
  const sectorColors = {
    Agriculture: '#66BB6A', Tourism: '#29B6F6', Manufacturing: '#FFA726',
    Services: '#AB47BC', Retail: '#EF5350', Transport: '#78909C',
    Fisheries: '#26C6DA', 'ICT & Digital': '#5C6BC0', Construction: '#8D6E63'
  };
  const sectorSegments = Object.entries(stats.sectorStats).map(([k, v]) => ({
    value: v, color: sectorColors[k] || '#999', label: k
  }));

  // Formal vs Informal
  const formalCount = smes.filter(s => s.registration_type?.startsWith('Formal')).length;
  const informalCount = smes.length - formalCount;

  const maxBar = (obj) => Math.max(...Object.values(obj), 1);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics &amp; Intelligence</h1>
          <p className="text-secondary">Deep-dive across GEDSI, climate, finance, and data quality dimensions</p>
        </div>
        <div className="header-badges">
          <span className="badge-pill green">{smes.length} SMEs</span>
          <span className="badge-pill blue">Avg Quality {avgQuality}%</span>
        </div>
      </div>

      {/* ── ROW 1: GEDSI + Sector Donut ── */}
      <div className="analytics-grid-2">
        {/* GEDSI Panel */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>GEDSI Analysis</h3>
            <span className="tag purple">Inclusion</span>
          </div>
          <div className="gedsi-bars">
            {gedsiData.map(g => (
              <div key={g.label} className="gedsi-row">
                <div className="gedsi-label-wrap">
                  <span className="gedsi-label">{g.label}</span>
                  <span className="gedsi-count">{g.value} of {smes.length}</span>
                </div>
                <div className="gedsi-bar-outer">
                  <div className="gedsi-bar-inner"
                    style={{ width: `${Math.round((g.value / smes.length) * 100)}%`, background: g.color }} />
                </div>
                <span className="gedsi-pct">{Math.round((g.value / smes.length) * 100)}%</span>
              </div>
            ))}
          </div>
          <div className="gedsi-footnote">
            Formal vs Informal: <strong>{formalCount} formal</strong> / <strong>{informalCount} informal</strong>
          </div>
        </div>

        {/* Sector Donut */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>Sector Distribution</h3>
            <span className="tag green">Sectors</span>
          </div>
          <div className="donut-wrap">
            <DonutChart segments={sectorSegments} />
            <div className="donut-legend">
              {sectorSegments.map(s => (
                <div key={s.label} className="legend-row">
                  <span className="legend-dot" style={{ background: s.color }} />
                  <span className="legend-label">{s.label}</span>
                  <span className="legend-val">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Financial Inclusion + Credit Readiness ── */}
      <div className="analytics-grid-2">
        {/* Financial Inclusion */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>Financial Inclusion</h3>
            <span className="tag blue">Finance</span>
          </div>
          <div className="fin-kpis">
            {[
              { label: 'Banked', value: banked, color: '#1976D2' },
              { label: 'Unbanked', value: unbanked, color: '#F44336' },
              { label: 'Mobile Money', value: mobileMoneyUsers, color: '#FF9800' },
              { label: 'Savings Group', value: savingsGroupMembers, color: '#9C27B0' },
              { label: 'Finance Access', value: financeAccess, color: '#2E7D32' },
            ].map(f => (
              <div key={f.label} className="fin-kpi-row">
                <span className="fin-label">{f.label}</span>
                <div className="fin-bar-outer">
                  <div className="fin-bar-inner"
                    style={{ width: `${Math.round((f.value / smes.length) * 100)}%`, background: f.color }} />
                </div>
                <span className="fin-count">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Readiness */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>Credit Readiness Scores</h3>
            <span className="tag orange">Eywa AI</span>
          </div>
          <div className="credit-bands">
            {Object.entries(creditBands).map(([band, count]) => (
              <div key={band} className="credit-band-row">
                <span className="credit-band-label">{band}</span>
                <div className="credit-bar-outer">
                  <div className="credit-bar-inner"
                    style={{
                      width: `${Math.round((count / Math.max(...Object.values(creditBands), 1)) * 100)}%`,
                      background: creditColors[band]
                    }} />
                </div>
                <span className="credit-count">{count} SMEs</span>
              </div>
            ))}
          </div>
          <div className="credit-individual">
            <h4>Individual Scores</h4>
            {[...smes].sort((a, b) => (b.credit_readiness_score || 0) - (a.credit_readiness_score || 0)).map(sme => (
              <div key={sme.id} className="credit-sme-row">
                <span className="credit-sme-name">{sme.business_name}</span>
                <ScoreBar
                  value={sme.credit_readiness_score || 0}
                  color={
                    (sme.credit_readiness_score || 0) >= 80 ? '#2E7D32' :
                    (sme.credit_readiness_score || 0) >= 50 ? '#FF9800' : '#F44336'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Climate Module + IPA/TIN Integration ── */}
      <div className="analytics-grid-2">
        {/* Climate Module */}
        <div className="an-card climate-card">
          <div className="an-card-header">
            <h3>Climate &amp; Resilience Module</h3>
            <span className="tag green-dark">NDC Aligned</span>
          </div>
          <div className="climate-summary-row">
            <div className="climate-kpi">
              <span className="climate-kpi-val">{climateSensitive}</span>
              <span className="climate-kpi-label">Climate-Sensitive Sectors</span>
            </div>
            <div className="climate-kpi">
              <span className="climate-kpi-val">{hasGreenPractices}</span>
              <span className="climate-kpi-label">Green Practices Adopted</span>
            </div>
            <div className="climate-kpi">
              <span className="climate-kpi-val">{sortedRisks.length > 0 ? sortedRisks[0][0] : 'N/A'}</span>
              <span className="climate-kpi-label">Top Risk</span>
            </div>
          </div>
          <h4 style={{marginBottom:'8px',marginTop:'16px'}}>Top Climate Risks Reported</h4>
          {sortedRisks.map(([risk, count]) => (
            <div key={risk} className="risk-row">
              <span className="risk-label">{risk}</span>
              <div className="risk-bar-outer">
                <div className="risk-bar-inner"
                  style={{ width: `${Math.round((count / (sortedRisks[0]?.[1] || 1)) * 100)}%` }} />
              </div>
              <span className="risk-count">{count}</span>
            </div>
          ))}
          <div className="climate-note">
            Data enables GGGI to identify NDC-aligned SMEs and target climate finance
          </div>
          {/* Climate-sensitive sectors */}
          <h4 style={{marginTop:'16px',marginBottom:'8px'}}>Climate-Sensitive SMEs</h4>
          <div className="climate-sme-list">
            {smes.filter(s => s.climate?.climate_sensitive_sector).map(s => (
              <div key={s.id} className="climate-sme-chip">
                <span>{s.business_name}</span>
                <small>{s.climate.sector_tag}</small>
              </div>
            ))}
          </div>
        </div>

        {/* IPA / IRC / NSO Integration */}
        <div className="an-card">
          <div className="an-card-header">
            <h3>System Integration Status</h3>
            <span className="tag grey">IPA · IRC · NSO</span>
          </div>
          <div className="integration-kpis">
            {[
              { label: 'IPA Verified', value: ipaVerified, total: smes.length, color: '#1976D2' },
              { label: 'TIN (IRC) Verified', value: tinVerified, total: smes.length, color: '#388E3C' },
              { label: 'Dual Verified (IPA+TIN)', value: dualVerified, total: smes.length, color: '#7B1FA2' },
            ].map(item => (
              <div key={item.label} className="integ-row">
                <div className="integ-label-wrap">
                  <span className="integ-label">{item.label}</span>
                  <div className="integ-bar-outer">
                    <div className="integ-bar-inner"
                      style={{ width: `${Math.round((item.value / item.total) * 100)}%`, background: item.color }} />
                  </div>
                </div>
                <span className="integ-pct">{item.value}/{item.total}</span>
              </div>
            ))}
          </div>
          <h4 style={{margin:'16px 0 8px'}}>Data Quality by SME</h4>
          <div className="quality-list">
            {[...smes].sort((a, b) => (b.data_quality_score || 0) - (a.data_quality_score || 0)).map(s => (
              <div key={s.id} className="quality-row">
                <span className="quality-name">{s.business_name}</span>
                <div className="quality-bar-outer">
                  <div className="quality-bar-inner"
                    style={{
                      width: `${s.data_quality_score || 0}%`,
                      background: (s.data_quality_score || 0) >= 90 ? '#2E7D32' :
                        (s.data_quality_score || 0) >= 70 ? '#FF9800' : '#F44336'
                    }} />
                </div>
                <span className="quality-score">{s.data_quality_score || 0}%</span>
              </div>
            ))}
          </div>
          <div className="integ-note">
            Cross-check API queries IPA Business Register &amp; IRC TIN database in real time
          </div>
        </div>
      </div>

      {/* ── ROW 4: Province Map Table ── */}
      <div className="an-card">
        <div className="an-card-header">
          <h3>Provincial Coverage Summary</h3>
          <span className="tag blue">8 Provinces · 4 Regions</span>
        </div>
        <div className="province-table-wrap">
          <table className="province-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>SMEs</th>
                <th>Women-Led</th>
                <th>Climate-Sensitive</th>
                <th>IPA Verified</th>
                <th>Avg Credit Score</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.provinceStats)
                .sort((a, b) => b[1] - a[1])
                .map(([province, count]) => {
                  const provinceSMEs = smes.filter(s => s.province === province);
                  const wl = provinceSMEs.filter(s => s.women_led).length;
                  const cl = provinceSMEs.filter(s => s.climate?.climate_sensitive_sector).length;
                  const iv = provinceSMEs.filter(s => s.ipa_verified).length;
                  const avgCr = provinceSMEs.length
                    ? Math.round(provinceSMEs.reduce((s, x) => s + (x.credit_readiness_score || 0), 0) / provinceSMEs.length)
                    : 0;
                  const covPct = Math.round((count / smes.length) * 100);
                  return (
                    <tr key={province}>
                      <td><strong>{province}</strong></td>
                      <td>{count}</td>
                      <td>{wl > 0 ? <span className="dot-pink">{wl}</span> : '–'}</td>
                      <td>{cl > 0 ? <span className="dot-green">{cl}</span> : '–'}</td>
                      <td>{iv}/{count}</td>
                      <td>
                        <span className={`score-chip ${avgCr >= 70 ? 'high' : avgCr >= 40 ? 'mid' : 'low'}`}>
                          {avgCr}
                        </span>
                      </td>
                      <td>
                        <div className="cov-bar-outer">
                          <div className="cov-bar-inner" style={{ width: `${covPct * 5}%` }} />
                        </div>
                        <span className="cov-pct">{covPct}%</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
