import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './DashboardOverview.css';

export default function DashboardOverview() {
  const { smes, getStatistics } = useSME();
  const navigate = useNavigate();
  const stats = getStatistics();

  const kpiCards = [
    { title: 'Total SMEs', value: stats.total, change: '+12 this month', color: 'primary' },
    { title: 'Women-Led', value: `${stats.womenLedPercent}%`, subtitle: `${stats.womenLed} enterprises`, color: 'women' },
    { title: 'Youth-Led', value: `${stats.youthLedPercent}%`, subtitle: `${stats.youthLed} enterprises`, color: 'youth' },
    { title: 'Pending Review', value: stats.pending, change: 'Needs verification', color: 'warning' },
  ];

  const extKpis = [
    { title: 'Climate-Sensitive', value: stats.climateSensitive, subtitle: 'NDC-tagged SMEs', color: 'climate' },
    { title: 'IPA Verified', value: stats.ipaVerified, subtitle: `of ${stats.total} total`, color: 'primary' },
    { title: 'Avg Credit Score', value: stats.avgCredit, subtitle: `${stats.creditHigh} high-ready`, color: 'credit' },
    { title: 'Avg Data Quality', value: `${stats.avgQuality}%`, subtitle: 'All submissions', color: 'quality' },
  ];

  const topProvinces = Object.entries(stats.provinceStats || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSectors = Object.entries(stats.sectorStats || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const recentActivity = smes.slice(0, 5);

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-secondary">PNG National SME Database — SMEC Operations Centre</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/web/analytics')}>
            Analytics
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/web/reports')}>
            Reports
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, index) => (
          <div key={index} className={`kpi-card ${kpi.color}`}>
            <div className="kpi-content">
              <h3 className="kpi-title">{kpi.title}</h3>
              <div className="kpi-value">{kpi.value}</div>
              {kpi.subtitle && <p className="kpi-subtitle">{kpi.subtitle}</p>}
              {kpi.change && <p className="kpi-change">{kpi.change}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Extended KPI Cards */}
      <div className="kpi-grid ext-kpis">
        {extKpis.map((kpi, index) => (
          <div key={index} className={`kpi-card ${kpi.color}`}>
            <div className="kpi-content">
              <h3 className="kpi-title">{kpi.title}</h3>
              <div className="kpi-value">{kpi.value}</div>
              {kpi.subtitle && <p className="kpi-subtitle">{kpi.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Top Provinces</h3>
          <div className="bar-chart">
            {topProvinces.map(([province, count]) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div key={province} className="bar-item">
                  <div className="bar-label">{province}</div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: `${percentage}%` }} />
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Sectors</h3>
          <div className="bar-chart">
            {topSectors.map(([sector, count]) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div key={sector} className="bar-item">
                  <div className="bar-label">{sector}</div>
                  <div className="bar-wrapper">
                    <div className="bar-fill secondary" style={{ width: `${percentage}%` }} />
                    <span className="bar-value">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Climate Summary Strip */}
      <div className="card climate-strip">
        <div className="climate-strip-header">
          <h3>Climate &amp; Resilience Summary</h3>
          <button className="btn-text" onClick={() => navigate('/web/analytics')}>
            Full Analytics →
          </button>
        </div>
        <div className="climate-strip-kpis">
          {[
            { label: 'Climate-Sensitive SMEs', value: stats.climateSensitive, pct: Math.round((stats.climateSensitive / stats.total) * 100) },
            { label: 'Green Practices Adopted', value: stats.hasGreenPractices, pct: Math.round((stats.hasGreenPractices / stats.total) * 100) },
            { label: 'IPA Verified', value: stats.ipaVerified, pct: Math.round((stats.ipaVerified / stats.total) * 100) },
            { label: 'TIN (IRC) Verified', value: stats.tinVerified, pct: Math.round((stats.tinVerified / stats.total) * 100) },
            { label: 'Finance Access', value: stats.financeAccess, pct: Math.round((stats.financeAccess / stats.total) * 100) },
            { label: 'Mobile Money Users', value: stats.mobileMoneyUsers, pct: Math.round((stats.mobileMoneyUsers / stats.total) * 100) },
          ].map(item => (
            <div key={item.label} className="climate-strip-item">
              <div className="cs-value">{item.value}</div>
              <div className="cs-label">{item.label}</div>
              <div className="cs-bar-outer">
                <div className="cs-bar-inner" style={{ width: `${item.pct}%` }} />
              </div>
              <div className="cs-pct">{item.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Activity</h3>
          <a href="/web/directory" className="view-all-link">View All →</a>
        </div>
        <div className="activity-table">
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Province</th>
                <th>Sector</th>
                <th>Credit</th>
                <th>IPA</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((sme) => (
                <tr key={sme.id} style={{cursor:'pointer'}} onClick={() => navigate(`/web/sme/${sme.id}`)}>
                  <td>
                    <div className="business-cell">
                      <strong>{sme.business_name}</strong>
                      <div className="business-badges">
                        {sme.women_led && <span className="badge badge-women">Women-Led</span>}
                        {sme.youth_led && <span className="badge badge-youth">Youth-Led</span>}
                        {sme.climate?.climate_sensitive_sector && <span className="badge badge-climate">Climate</span>}
                      </div>
                    </div>
                  </td>
                  <td>{sme.province}</td>
                  <td>{sme.sector}</td>
                  <td>
                    <span className={`score-pill ${
                      (sme.credit_readiness_score || 0) >= 80 ? 'high' :
                      (sme.credit_readiness_score || 0) >= 50 ? 'mid' : 'low'
                    }`}>
                      {sme.credit_readiness_score || 'N/A'}
                    </span>
                  </td>
                  <td>
                    {sme.ipa_verified ? <span className="verified-dot">✓</span> : <span className="unverified-dot">–</span>}
                  </td>
                  <td>
                    <span className={`status-badge ${sme.status.toLowerCase()}`}>
                      {sme.status}
                    </span>
                  </td>
                  <td>{sme.survey_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
