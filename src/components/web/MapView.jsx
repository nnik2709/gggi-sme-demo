import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSME } from '../../context/SMEContext';
import './MapView.css';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons with colors
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      border: 2px solid white;
      transform: rotate(-45deg);
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">
      <div style="
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const primaryIcon = createCustomIcon('#2E7D32');
const womenIcon = createCustomIcon('#E91E63');
const youthIcon = createCustomIcon('#9C27B0');

// Component to fit map bounds to markers
function MapBounds({ smes }) {
  const map = useMap();

  useEffect(() => {
    if (smes.length > 0) {
      const bounds = L.latLngBounds(smes.map(sme => [sme.gps.lat, sme.gps.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [smes, map]);

  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const { smes } = useSME();
  const [filters, setFilters] = useState({
    women_led: false,
    youth_led: false,
    sector: 'all'
  });

  const filteredSMEs = smes.filter(sme => {
    if (filters.women_led && !sme.women_led) return false;
    if (filters.youth_led && !sme.youth_led) return false;
    if (filters.sector !== 'all' && sme.sector !== filters.sector) return false;
    return true;
  });

  // Group by province for the sidebar
  const smesByProvince = filteredSMEs.reduce((acc, sme) => {
    if (!acc[sme.province]) {
      acc[sme.province] = [];
    }
    acc[sme.province].push(sme);
    return acc;
  }, {});

  // Get unique sectors for filter
  const sectors = ['all', ...new Set(smes.map(sme => sme.sector))];

  // PNG center coordinates
  const centerPNG = [-6.314993, 143.95555];

  const getMarkerIcon = (sme) => {
    if (sme.women_led) return womenIcon;
    if (sme.youth_led) return youthIcon;
    return primaryIcon;
  };

  return (
    <div className="map-view">
      <div className="map-header">
        <div>
          <h1>Geographic Distribution</h1>
          <p className="text-secondary">
            Showing {filteredSMEs.length} of {smes.length} SMEs across {Object.keys(smesByProvince).length} provinces
          </p>
        </div>

        <div className="map-filters">
          <select
            className="filter-select"
            value={filters.sector}
            onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>
                {sector === 'all' ? 'All Sectors' : sector}
              </option>
            ))}
          </select>

          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filters.women_led}
              onChange={(e) => setFilters(prev => ({ ...prev, women_led: e.target.checked }))}
            />
            <span>Women-Led</span>
          </label>

          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={filters.youth_led}
              onChange={(e) => setFilters(prev => ({ ...prev, youth_led: e.target.checked }))}
            />
            <span>Youth-Led</span>
          </label>
        </div>
      </div>

      <div className="map-container">
        {/* Real Leaflet Map */}
        <div className="map-display">
          <MapContainer
            center={centerPNG}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBounds smes={filteredSMEs} />

            {filteredSMEs.map((sme) => (
              <Marker
                key={sme.id}
                position={[sme.gps.lat, sme.gps.lng]}
                icon={getMarkerIcon(sme)}
              >
                <Popup>
                  <div className="map-popup-content">
                    <h4>{sme.business_name}</h4>
                    <div className="popup-badges">
                      {sme.women_led && <span className="badge badge-women">Women-Led</span>}
                      {sme.youth_led && <span className="badge badge-youth">Youth-Led</span>}
                      {sme.pwd_owned && <span className="badge badge-pwd">PWD-Owned</span>}
                    </div>
                    <p className="popup-sector">{sme.sector} • {sme.sub_sector}</p>
                    <p className="popup-location">{sme.province}, {sme.district}</p>
                    <p className="popup-details">
                      <strong>{sme.employees}</strong> employees • <strong>{sme.size}</strong>
                    </p>
                    <p className="popup-revenue text-sm text-secondary">{sme.revenue_range}</p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/web/sme/${sme.id}`)}
                    >
                      View Full Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="map-legend">
            <h4>Legend</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="marker-sample" style={{ backgroundColor: '#2E7D32' }}></span>
                <span>General SME</span>
              </div>
              <div className="legend-item">
                <span className="marker-sample" style={{ backgroundColor: '#E91E63' }}></span>
                <span>Women-Led</span>
              </div>
              <div className="legend-item">
                <span className="marker-sample" style={{ backgroundColor: '#9C27B0' }}></span>
                <span>Youth-Led</span>
              </div>
            </div>
          </div>
        </div>

        {/* SME List by Province */}
        <div className="map-sidebar">
          <h3>SMEs by Province</h3>
          <p className="text-sm text-secondary" style={{ marginBottom: '1rem' }}>
            Click on a province to view SMEs or click markers on the map
          </p>

          <div className="province-list">
            {Object.entries(smesByProvince)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([province, provinceSMEs]) => (
                <div key={province} className="province-group">
                  <div className="province-header">
                    <span className="province-name">{province}</span>
                    <span className="province-count">{provinceSMEs.length} SME{provinceSMEs.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="province-smes">
                    {provinceSMEs.slice(0, 3).map(sme => (
                      <div
                        key={sme.id}
                        className="sme-list-item"
                        onClick={() => navigate(`/web/sme/${sme.id}`)}
                      >
                        <div className="sme-marker">
                          <span
                            className="marker-sample"
                            style={{
                              backgroundColor: sme.women_led ? '#E91E63' : sme.youth_led ? '#9C27B0' : '#2E7D32'
                            }}
                          ></span>
                        </div>
                        <div className="sme-info">
                          <div className="sme-name">{sme.business_name}</div>
                          <div className="sme-sector text-sm text-secondary">{sme.sector}</div>
                        </div>
                      </div>
                    ))}
                    {provinceSMEs.length > 3 && (
                      <div className="more-smes text-sm text-secondary">
                        +{provinceSMEs.length - 3} more in {province}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {Object.keys(smesByProvince).length === 0 && (
            <div className="empty-state">
              <p>No SMEs match the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
