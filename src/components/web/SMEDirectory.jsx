import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSME } from '../../context/SMEContext';
import './SMEDirectory.css';

export default function SMEDirectory() {
  const navigate = useNavigate();
  const { smes, searchSMEs } = useSME();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    province: [],
    sector: [],
    women_led: false,
    youth_led: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const provinces = [...new Set(smes.map(sme => sme.province))];
  const sectors = [...new Set(smes.map(sme => sme.sector))];

  const filteredSMEs = searchSMEs(searchQuery, filters);
  const totalPages = Math.ceil(filteredSMEs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSMEs = filteredSMEs.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'women_led' || filterType === 'youth_led') {
        return { ...prev, [filterType]: !prev[filterType] };
      } else {
        const currentValues = prev[filterType];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      province: [],
      sector: [],
      women_led: false,
      youth_led: false
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="sme-directory">
      <div className="directory-header">
        <div>
          <h1>SME Directory</h1>
          <p className="text-secondary">
            {filteredSMEs.length} of {smes.length} enterprises
          </p>
        </div>
        <button className="btn btn-primary">
          Export Data
        </button>
      </div>

      <div className="directory-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="btn-text" onClick={clearFilters}>Clear All</button>
          </div>

          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Province Filter */}
          <div className="filter-section">
            <label className="filter-label">Province</label>
            <div className="filter-options">
              {provinces.map(province => (
                <label key={province} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.province.includes(province)}
                    onChange={() => handleFilterChange('province', province)}
                  />
                  <span>{province}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div className="filter-section">
            <label className="filter-label">Sector</label>
            <div className="filter-options">
              {sectors.map(sector => (
                <label key={sector} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.sector.includes(sector)}
                    onChange={() => handleFilterChange('sector', sector)}
                  />
                  <span>{sector}</span>
                </label>
              ))}
            </div>
          </div>

          {/* GEDSI Filters */}
          <div className="filter-section">
            <label className="filter-label">Demographics</label>
            <div className="filter-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.women_led}
                  onChange={() => handleFilterChange('women_led')}
                />
                <span>Women-Led</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.youth_led}
                  onChange={() => handleFilterChange('youth_led')}
                />
                <span>Youth-Led</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="directory-results">
          {paginatedSMEs.length === 0 ? (
            <div className="empty-state">
              <h3>No SMEs found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <div className="sme-grid">
                {paginatedSMEs.map(sme => (
                  <div
                    key={sme.id}
                    className="sme-card"
                    onClick={() => navigate(`/web/sme/${sme.id}`)}
                  >
                    <div className="sme-card-header">
                      <h3>{sme.business_name}</h3>
                      <span className={`status-badge ${sme.status.toLowerCase()}`}>
                        {sme.status}
                      </span>
                    </div>

                    <div className="sme-card-badges">
                      {sme.women_led && <span className="badge badge-women">Women-Led</span>}
                      {sme.youth_led && <span className="badge badge-youth">Youth-Led</span>}
                    </div>

                    <div className="sme-card-details">
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span>{sme.province}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Sector:</span>
                        <span>{sme.sector}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Employees:</span>
                        <span>{sme.employees}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Revenue:</span>
                        <span>{sme.revenue_range}</span>
                      </div>
                    </div>

                    <div className="sme-card-footer">
                      <span className="text-secondary text-sm">
                        Updated {sme.survey_date}
                      </span>
                      <button className="btn-text">View Details</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>

                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
