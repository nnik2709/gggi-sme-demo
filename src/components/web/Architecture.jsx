import './Architecture.css';

const BOX = ({ color = '#1976D2', icon, title, items = [], badge }) => (
  <div className="arch-box" style={{ borderColor: color }}>
    <div className="arch-box-header" style={{ background: color }}>
      {icon && <span className="arch-box-icon">{icon}</span>}
      <span className="arch-box-title">{title}</span>
      {badge && <span className="arch-badge">{badge}</span>}
    </div>
    {items.length > 0 && (
      <ul className="arch-box-items">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    )}
  </div>
);

const Arrow = ({ label, direction = 'down', double = false }) => (
  <div className={`arch-arrow ${direction}`}>
    {double && <span className="arrow-head left">&#9668;</span>}
    <span className="arrow-label">{label}</span>
    <span className="arrow-head right">&#9658;</span>
  </div>
);

const VArrow = ({ label }) => (
  <div className="arch-varrow">
    <span className="varrow-line" />
    <span className="varrow-label">{label}</span>
    <span className="varrow-head">&#9660;</span>
  </div>
);

export default function Architecture() {
  return (
    <div className="arch-page">
      <div className="arch-page-header">
        <div>
          <h1>System Architecture &amp; Design</h1>
          <p className="text-secondary">
            PNG National SME Database — Technical Diagrams, Data Flow &amp; Integration Map
          </p>
        </div>
        <div className="arch-header-tags">
          <span className="arch-tag blue">React Native · Django · PostgreSQL</span>
          <span className="arch-tag green">Offline-First · AES-256 · RBAC</span>
        </div>
      </div>

      {/* ── 1. SYSTEM CONTEXT DIAGRAM (C4 Level 1) ── */}
      <div className="arch-section">
        <h2>1. System Context Diagram</h2>
        <p className="arch-desc">Who interacts with the PNG National SME Database and how</p>
        <div className="context-diagram">
          {/* External actors */}
          <div className="context-actors top">
            <div className="actor-box">
              <div className="actor-label">Field Enumerator</div>
              <div className="actor-sub">Mobile App (offline)</div>
            </div>
            <div className="actor-box">
              <div className="actor-label">SMEC Admin</div>
              <div className="actor-sub">Web Dashboard</div>
            </div>
            <div className="actor-box">
              <div className="actor-label">Policymaker</div>
              <div className="actor-sub">Reports &amp; Analytics</div>
            </div>
            <div className="actor-box">
              <div className="actor-label">Financial Institution</div>
              <div className="actor-sub">Credit API Access</div>
            </div>
          </div>

          <div className="context-arrows-top">
            <Arrow label="Survey data (offline sync)" double />
            <Arrow label="RBAC web access" double />
            <Arrow label="Dashboard / export" double />
            <Arrow label="REST API (read-only)" double />
          </div>

          {/* Central system */}
          <div className="context-system">
            <div className="system-core">
              <div className="system-title">PNG National SME Database</div>
              <div className="system-subtitle">SMEC-Owned · Cloud-Hybrid · Secure</div>
              <div className="system-stack">
                Django API · PostgreSQL · React Native · React Web
              </div>
            </div>
          </div>

          <div className="context-arrows-bottom">
            <Arrow label="IPA cross-check API" double />
            <Arrow label="TIN/GST verification" double />
            <Arrow label="Statistical export" double />
            <Arrow label="NDC / climate data" double />
          </div>

          <div className="context-actors bottom">
            <div className="actor-box ext">
              <div className="actor-label">IPA</div>
              <div className="actor-sub">Business Registry</div>
            </div>
            <div className="actor-box ext">
              <div className="actor-label">IRC</div>
              <div className="actor-sub">Tax (TIN/GST)</div>
            </div>
            <div className="actor-box ext">
              <div className="actor-label">NSO</div>
              <div className="actor-sub">Statistics</div>
            </div>
            <div className="actor-box ext">
              <div className="actor-label">CCDA/GGGI</div>
              <div className="actor-sub">Climate Data</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CONTAINER ARCHITECTURE (C4 Level 2) ── */}
      <div className="arch-section">
        <h2>2. Container Architecture</h2>
        <p className="arch-desc">Major deployable components and their technology stacks</p>
        <div className="container-diagram">

          {/* Mobile App */}
          <div className="container-col">
            <BOX color="#2E7D32" title="Mobile Survey App"
              badge="React Native"
              items={[
                '5-step survey form (50+ fields)',
                'Offline-first with IndexedDB queue',
                'GPS + photo capture (mandatory)',
                'English / Tok Pisin',
                'Auto-sync when online',
                'KoboToolbox / ODK compatible',
              ]} />
            <VArrow label="HTTPS / JWT" />
          </div>

          {/* Web Dashboard */}
          <div className="container-col">
            <BOX color="#1976D2" title="Web Dashboard"
              badge="React + Vite"
              items={[
                'SMEC Admin: full CRUD',
                'Policymaker: read + export',
                'Financial institution: credit API',
                'Analytics: GEDSI, climate, finance',
                'Interactive Leaflet map',
                'Report builder + CSV/PDF export',
              ]} />
            <VArrow label="REST API / HTTPS" />
          </div>

          {/* API + Core */}
          <div className="container-col middle">
            <BOX color="#7B1FA2" title="Backend API"
              badge="Django + DRF"
              items={[
                'RESTful endpoints (JWT auth)',
                'RBAC: Admin / Supervisor / Viewer / API',
                'Offline sync queue processor',
                'Data validation + deduplication',
                'Credit Readiness Score engine',
                'IPA/IRC cross-check webhook',
                'AES-256 encryption at rest',
                'Full audit logging',
              ]} />
            <VArrow label="SQL / ORM" />
            <BOX color="#E65100" title="PostgreSQL Database"
              badge="v15+"
              items={[
                'SME master table (50+ fields)',
                'Survey submissions queue',
                'Audit log table',
                'User & RBAC tables',
                'Data quality scores table',
                'Spatial index (PostGIS)',
              ]} />
          </div>

          {/* External integrations */}
          <div className="container-col">
            <BOX color="#37474F" title="External Integrations"
              badge="REST APIs"
              items={[
                'IPA Business Register API',
                'IRC TIN Verification API',
                'NSO Data Export (CSV/SDMX)',
                'CCDA Climate Data Feed',
                'AWS S3 (photo backup)',
                'SMTP (notification emails)',
              ]} />
            <VArrow label="Webhooks / Polling" />
          </div>

          {/* Hosting */}
          <div className="container-col">
            <BOX color="#455A64" title="Infrastructure"
              badge="Hybrid Cloud"
              items={[
                'PNG-local primary server',
                'AWS ap-southeast-2 backup',
                'Nginx reverse proxy + SSL',
                'Docker + Compose deployment',
                'Daily PostgreSQL backups (S3)',
                'UPS + diesel generator backup',
              ]} />
          </div>
        </div>
      </div>

      {/* ── 3. DATABASE SCHEMA ── */}
      <div className="arch-section">
        <h2>3. Database Schema (Core Tables)</h2>
        <p className="arch-desc">PostgreSQL entity-relationship overview — 50+ field SME model</p>
        <div className="schema-diagram">

          <div className="schema-table primary-table">
            <div className="schema-table-header primary">sme_enterprises</div>
            <div className="schema-fields">
              <div className="field pk">PK unique_sme_id (VARCHAR)</div>
              <div className="field">business_name, legal_name</div>
              <div className="field fk">FK province_id → provinces</div>
              <div className="field">district, llg, ward_number</div>
              <div className="field">gps_lat, gps_lng (PostGIS)</div>
              <div className="field">urban_rural, operating_location_type</div>
              <div className="field fk">FK sector_id → sectors</div>
              <div className="field">sub_sector, year_established</div>
              <div className="field">employees, employees_male, employees_female</div>
              <div className="field">revenue_range, weekly_turnover_band</div>
              <div className="field">products, markets, supply_chain_role</div>
              <div className="field">banking_status, access_to_finance</div>
              <div className="field">mobile_money_usage, savings_group_member</div>
              <div className="field">credit_readiness_score (FLOAT)</div>
              <div className="field">ipa_registration, tin_irc, gst_number</div>
              <div className="field">ipa_verified (BOOL), tin_verified (BOOL)</div>
              <div className="field">data_quality_score (FLOAT)</div>
              <div className="field">data_sharing_consent (BOOL)</div>
              <div className="field">photo_url (S3 path)</div>
              <div className="field">registration_status, registration_type</div>
              <div className="field fk">FK enumerator_id → users</div>
              <div className="field">survey_date, status, verified_date</div>
              <div className="field fk">FK verified_by → users</div>
              <div className="field ts">created_at, updated_at</div>
            </div>
          </div>

          <div className="schema-relations">
            <div className="schema-table rel-table">
              <div className="schema-table-header rel">sme_gedsi</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field fk">FK sme_id → sme_enterprises</div>
                <div className="field">owner_gender, owner_age_range</div>
                <div className="field">women_led, youth_led, pwd_owned</div>
                <div className="field">female_decision_maker</div>
                <div className="field">shared_ownership</div>
              </div>
            </div>

            <div className="schema-table rel-table">
              <div className="schema-table-header rel">sme_climate</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field fk">FK sme_id → sme_enterprises</div>
                <div className="field">climate_sensitive_sector (BOOL)</div>
                <div className="field">sector_tag (VARCHAR)</div>
                <div className="field">climate_risks_faced (JSON[])</div>
                <div className="field">green_practices (JSON[])</div>
                <div className="field">resilience_investments</div>
              </div>
            </div>

            <div className="schema-table rel-table">
              <div className="schema-table-header rel">sme_digital_tech</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field fk">FK sme_id → sme_enterprises</div>
                <div className="field">basic_phone, smartphone</div>
                <div className="field">internet_access, social_media_selling</div>
                <div className="field">ecommerce_platform</div>
              </div>
            </div>

            <div className="schema-table rel-table">
              <div className="schema-table-header blue">users</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field">username, email, password_hash</div>
                <div className="field">role (admin/supervisor/enumerator/viewer/api)</div>
                <div className="field">province_assignment (FK)</div>
                <div className="field">is_active, last_login</div>
              </div>
            </div>

            <div className="schema-table rel-table">
              <div className="schema-table-header orange">survey_sync_queue</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field fk">FK enumerator_id → users</div>
                <div className="field">payload (JSONB)</div>
                <div className="field">status (pending/synced/error)</div>
                <div className="field">created_offline_at</div>
                <div className="field">synced_at</div>
              </div>
            </div>

            <div className="schema-table rel-table">
              <div className="schema-table-header grey">audit_log</div>
              <div className="schema-fields">
                <div className="field pk">PK id</div>
                <div className="field fk">FK user_id → users</div>
                <div className="field">action (CREATE/UPDATE/DELETE/VIEW)</div>
                <div className="field">table_name, record_id</div>
                <div className="field">changes (JSONB diff)</div>
                <div className="field ts">timestamp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. USER FLOW DIAGRAM ── */}
      <div className="arch-section">
        <h2>4. User Flow Diagrams</h2>
        <p className="arch-desc">Key journeys for each user role</p>
        <div className="flows-grid">

          {/* Field Enumerator Flow */}
          <div className="flow-col">
            <div className="flow-role-header" style={{background:'#2E7D32'}}>
              Field Enumerator
            </div>
            <div className="flow-steps">
              {[
                'Login (offline OK)',
                'View daily target SME list',
                'Locate SME — verify GPS',
                'Complete 5-step survey form',
                'Capture business photo',
                'Consent confirmation',
                'Save to offline queue',
                'Auto-sync when connected',
                'Repeat: 4–5 SMEs/day',
              ].map((text, i) => (
                <div key={i}>
                  <div className="flow-step">
                    <span className="flow-step-num">{i + 1}</span>
                    <span>{text}</span>
                  </div>
                  {i < 8 && <div className="flow-connector" />}
                </div>
              ))}
            </div>
          </div>

          {/* SMEC Admin Flow */}
          <div className="flow-col">
            <div className="flow-role-header" style={{background:'#1976D2'}}>
              SMEC Administrator
            </div>
            <div className="flow-steps">
              {[
                'Login (web dashboard)',
                'Review dashboard KPIs',
                'Review pending submissions',
                'Verify / reject entries',
                'Explore map view',
                'Browse SME directory',
                'Generate reports / export',
                'Manage user accounts',
                'Update data governance settings',
              ].map((text, i) => (
                <div key={i}>
                  <div className="flow-step">
                    <span className="flow-step-num">{i + 1}</span>
                    <span>{text}</span>
                  </div>
                  {i < 8 && <div className="flow-connector" />}
                </div>
              ))}
            </div>
          </div>

          {/* Policymaker Flow */}
          <div className="flow-col">
            <div className="flow-role-header" style={{background:'#7B1FA2'}}>
              Policymaker / GGGI
            </div>
            <div className="flow-steps">
              {[
                'Login (viewer role)',
                'National overview dashboard',
                'Climate analytics tab',
                'GEDSI disaggregation',
                'Provincial map view',
                'Filter by sector / province',
                'Run pre-configured reports',
                'Export CSV / PDF / Excel',
                'Share via secure link',
              ].map((text, i) => (
                <div key={i}>
                  <div className="flow-step">
                    <span className="flow-step-num">{i + 1}</span>
                    <span>{text}</span>
                  </div>
                  {i < 8 && <div className="flow-connector" />}
                </div>
              ))}
            </div>
          </div>

          {/* API Consumer Flow */}
          <div className="flow-col">
            <div className="flow-role-header" style={{background:'#37474F'}}>
              Financial Institution API
            </div>
            <div className="flow-steps">
              {[
                'API key authentication',
                'Query SMEs by province/sector',
                'Retrieve credit readiness scores',
                'IPA/TIN verification lookup',
                'Financial inclusion indicators',
                'Climate-tagged SME filter',
                'Rate-limited (100 req/day)',
                'Audit trail of all API calls',
              ].map((text, i) => (
                <div key={i}>
                  <div className="flow-step">
                    <span className="flow-step-num">{i + 1}</span>
                    <span>{text}</span>
                  </div>
                  {i < 7 && <div className="flow-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. SECURITY & GOVERNANCE ── */}
      <div className="arch-section">
        <h2>5. Security, Compliance &amp; Data Governance</h2>
        <div className="security-grid">
          {[
            {
              title: 'Authentication', color: '#1976D2',
              items: ['JWT tokens (15 min expiry)', 'Refresh token rotation', 'MFA for admin roles', 'Session audit logging', 'Failed login lockout (5 attempts)']
            },
            {
              title: 'Data Security', color: '#7B1FA2',
              items: ['AES-256 encryption at rest', 'TLS 1.3 in transit', 'Field-level encryption for PII', 'PostgreSQL row-level security', 'No PII in API responses (tokenized)']
            },
            {
              title: 'Access Control (RBAC)', color: '#2E7D32',
              items: ['Admin: full CRUD + user management', 'Supervisor: verify + edit assigned province', 'Enumerator: create surveys only', 'Viewer: read + export (no PII)', 'API: read-only, rate-limited, tokenized']
            },
            {
              title: 'Data Governance', color: '#E65100',
              items: ['SMEC owns all data (sovereignty)', 'Data sharing MoUs: IPA, IRC, banks', 'SME consent recorded per field', 'Electronic Transactions Act compliant', 'Cybercrime Code Act 2016 compliant', 'OLPLLG provincial data rights']
            },
            {
              title: 'Backup & Recovery', color: '#37474F',
              items: ['Daily PostgreSQL dumps → AWS S3', 'Point-in-time recovery (24h window)', 'PNG-local primary + AWS secondary', 'RTO: 4 hours | RPO: 24 hours', 'Monthly restore drills']
            },
            {
              title: 'Audit & Compliance', color: '#455A64',
              items: ['Full audit log (who, what, when)', 'Immutable log records', 'API call logging (financial institutions)', 'Quarterly SMEC audit access', 'Annual independent security review']
            },
          ].map(sec => (
            <div key={sec.title} className="security-card" style={{ borderTop: `3px solid ${sec.color}` }}>
              <div className="security-card-header">
                <span className="security-title">{sec.title}</span>
              </div>
              <ul className="security-items">
                {sec.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. OFFLINE SYNC FLOW ── */}
      <div className="arch-section">
        <h2>6. Offline-First Sync Architecture</h2>
        <p className="arch-desc">How data moves from enumerator device to national database</p>
        <div className="sync-flow">
          {[
            { step: '1', title: 'Survey Captured', desc: 'Enumerator completes form offline. Data saved to IndexedDB queue with timestamp and GPS.', color: '#2E7D32' },
            { step: '2', title: 'Local Validation', desc: 'Device validates mandatory fields, GPS coordinates, and photo. Flags incomplete records.', color: '#1976D2' },
            { step: '3', title: 'Connection Detected', desc: 'App detects WiFi or mobile data. Processes sync queue (FIFO order). Shows sync progress.', color: '#7B1FA2' },
            { step: '4', title: 'API Submission', desc: 'Survey payload sent via HTTPS POST with JWT auth. Server validates and deduplicates.', color: '#E65100' },
            { step: '5', title: 'IPA/IRC Cross-Check', desc: 'Backend auto-queries IPA and IRC APIs to verify registration and TIN. Updates verification flags.', color: '#37474F' },
            { step: '6', title: 'Credit Score Computed', desc: 'Python scoring engine calculates credit readiness (0–100) based on banking, finance, and compliance fields.', color: '#FF9800' },
            { step: '7', title: 'Database Commit', desc: 'Validated record written to PostgreSQL. Audit log entry created. SMEC dashboard updated in real-time.', color: '#455A64' },
          ].map((s, i) => (
            <div key={i} className="sync-step-wrap">
              <div className="sync-step" style={{ borderColor: s.color }}>
                <div className="sync-step-num" style={{ background: s.color }}>{s.step}</div>
                <div className="sync-step-title">{s.title}</div>
                <div className="sync-step-desc">{s.desc}</div>
              </div>
              {i < 6 && <div className="sync-arrow">&#9654;</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="arch-footer">
        <strong>Eywa Systems</strong> — PNG National SME Database Architecture v1.0 · February 2026 ·
        Reference: GGGI/SMEC PNG Ref. No. 100014811
      </div>
    </div>
  );
}
