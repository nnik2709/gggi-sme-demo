import { useState } from 'react';
import { useSME } from '../../context/SMEContext';
import './Reports.css';

export default function Reports() {
  const { smes, getStatistics } = useSME();
  const stats = getStatistics();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFilters, setCustomFilters] = useState({
    province: '',
    sector: '',
    dateRange: 'all'
  });

  const reportTemplates = [
    {
      id: 'overview',
      title: 'SME Overview Report',
      description: 'Comprehensive overview of all SMEs with key statistics',
      sections: ['Summary Statistics', 'Geographic Distribution', 'Sector Analysis', 'GEDSI Breakdown']
    },
    {
      id: 'gedsi',
      title: 'GEDSI Analysis Report',
      description: 'Detailed analysis of gender, youth, and PWD representation',
      sections: ['Women-Led Enterprises', 'Youth-Led Businesses', 'PWD Ownership', 'Employment Statistics']
    },
    {
      id: 'financial',
      title: 'Financial Access Report',
      description: 'Banking status, finance access, and revenue analysis',
      sections: ['Banking Status', 'Access to Finance', 'Revenue Distribution', 'Finance Sources']
    },
    {
      id: 'digital',
      title: 'Digital Technology Report',
      description: 'Digital adoption and technology usage across SMEs',
      sections: ['Mobile Payment Adoption', 'Social Media Usage', 'Website Presence', 'Digital Readiness']
    },
    {
      id: 'provincial',
      title: 'Provincial Distribution Report',
      description: 'Province-specific breakdown and analysis',
      sections: ['SMEs by Province', 'Urban vs Rural', 'District Analysis', 'Geographic Insights']
    },
    {
      id: 'sector',
      title: 'Sector Analysis Report',
      description: 'Industry sector breakdown and trends',
      sections: ['Sector Distribution', 'Employment by Sector', 'Revenue by Sector', 'Growth Trends']
    }
  ];

  const handleGenerateReport = (template) => {
    setSelectedTemplate(template);
    // In production, this would generate a PDF or export data
    console.log(`Generating ${template.title}...`);
  };

  const handleCustomReport = () => {
    console.log('Generating custom report with filters:', customFilters);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-secondary">Generate comprehensive reports and export data</p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-content">
            <div className="summary-value">{stats.total}</div>
            <div className="summary-label">Total SMEs</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-content">
            <div className="summary-value">{Object.keys(stats.provinceStats).length}</div>
            <div className="summary-label">Provinces</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-content">
            <div className="summary-value">{Object.keys(stats.sectorStats).length}</div>
            <div className="summary-label">Sectors</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-content">
            <div className="summary-value">{stats.womenLedPercent}%</div>
            <div className="summary-label">Women-Led</div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="reports-section">
        <h2>Report Templates</h2>
        <p className="section-description">Select a pre-configured report template to generate</p>

        <div className="templates-grid">
          {reportTemplates.map(template => (
            <div key={template.id} className="template-card">
              <h3>{template.title}</h3>
              <p className="template-description">{template.description}</p>

              <div className="template-sections">
                <strong>Includes:</strong>
                <ul>
                  {template.sections.map((section, idx) => (
                    <li key={idx}>{section}</li>
                  ))}
                </ul>
              </div>

              <div className="template-actions">
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => handleGenerateReport(template)}
                >
                  Generate Report
                </button>
                <button className="btn btn-secondary btn-full">
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="reports-section">
        <h2>Custom Report Builder</h2>
        <p className="section-description">Build a custom report with specific filters and parameters</p>

        <div className="custom-builder">
          <div className="builder-filters">
            <div className="filter-group">
              <label className="form-label">Province Filter</label>
              <select
                className="form-select"
                value={customFilters.province}
                onChange={(e) => setCustomFilters(prev => ({ ...prev, province: e.target.value }))}
              >
                <option value="">All Provinces</option>
                {Object.keys(stats.provinceStats).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Sector Filter</label>
              <select
                className="form-select"
                value={customFilters.sector}
                onChange={(e) => setCustomFilters(prev => ({ ...prev, sector: e.target.value }))}
              >
                <option value="">All Sectors</option>
                {Object.keys(stats.sectorStats).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Date Range</label>
              <select
                className="form-select"
                value={customFilters.dateRange}
                onChange={(e) => setCustomFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          <div className="builder-options">
            <h4>Report Sections</h4>
            <div className="options-grid">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Summary Statistics</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Business Details</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>GEDSI Analysis</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Financial Information</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Digital Technology</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Challenges & Needs</span>
              </label>
            </div>
          </div>

          <div className="builder-actions">
            <button className="btn btn-primary" onClick={handleCustomReport}>
              Generate Custom Report
            </button>
            <button className="btn btn-secondary">
              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="reports-section">
        <h2>Data Export</h2>
        <p className="section-description">Export raw data in various formats</p>

        <div className="export-grid">
          <div className="export-card">
            <h4>Excel (XLSX)</h4>
            <p>Export to Microsoft Excel format</p>
            <button className="btn btn-secondary">Export XLSX</button>
          </div>

          <div className="export-card">
            <h4>CSV</h4>
            <p>Comma-separated values format</p>
            <button className="btn btn-secondary">Export CSV</button>
          </div>

          <div className="export-card">
            <h4>JSON</h4>
            <p>JavaScript Object Notation</p>
            <button className="btn btn-secondary">Export JSON</button>
          </div>

          <div className="export-card">
            <h4>PDF Report</h4>
            <p>Formatted PDF document</p>
            <button className="btn btn-secondary">Export PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}
