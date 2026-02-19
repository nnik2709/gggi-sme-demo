import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SMEProvider } from './context/SMEContext';
import { OfflineProvider } from './context/OfflineContext';

// Mobile screens
import MobileLogin from './components/mobile/MobileLogin';
import MobileDashboard from './components/mobile/MobileDashboard';
import SurveyForm from './components/mobile/SurveyForm';
import SurveyReview from './components/mobile/SurveyReview';
import SurveySuccess from './components/mobile/SurveySuccess';

// Web screens
import WebLogin from './components/web/WebLogin';
import DashboardOverview from './components/web/DashboardOverview';
import SMEDirectory from './components/web/SMEDirectory';
import SMEDetail from './components/web/SMEDetail';
import MapView from './components/web/MapView';
import Reports from './components/web/Reports';
import Analytics from './components/web/Analytics';
import Architecture from './components/web/Architecture';

// Tablet screens
import TabletLogin from './components/tablet/TabletLogin';
import TabletLayout from './components/tablet/TabletLayout';
import TabletDashboard from './components/tablet/TabletDashboard';
import TabletSurvey from './components/tablet/TabletSurvey';
import TabletSurveyReview from './components/tablet/TabletSurveyReview';
import TabletSurveySuccess from './components/tablet/TabletSurveySuccess';

// Layouts
import MobileLayout from './components/shared/MobileLayout';
import WebLayout from './components/shared/WebLayout';

import './styles/global.css';

function App() {
  return (
    <Router>
      <OfflineProvider>
        <SMEProvider>
          <Routes>
            {/* Mobile Routes */}
            <Route path="/mobile/login" element={<MobileLogin />} />
            <Route path="/mobile" element={<MobileLayout />}>
              <Route path="dashboard" element={<MobileDashboard />} />
              <Route path="survey" element={<SurveyForm />} />
              <Route path="survey/review" element={<SurveyReview />} />
              <Route path="survey/success" element={<SurveySuccess />} />
            </Route>

            {/* Web Routes */}
            <Route path="/web/login" element={<WebLogin />} />
            <Route path="/web" element={<WebLayout />}>
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="directory" element={<SMEDirectory />} />
              <Route path="sme/:id" element={<SMEDetail />} />
              <Route path="map" element={<MapView />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="architecture" element={<Architecture />} />
            </Route>

            {/* Tablet Routes */}
            <Route path="/tablet/login" element={<TabletLogin />} />
            <Route path="/tablet" element={<TabletLayout />}>
              <Route path="dashboard" element={<TabletDashboard />} />
              <Route path="survey" element={<TabletSurvey />} />
              <Route path="survey/review" element={<TabletSurveyReview />} />
              <Route path="survey/success" element={<TabletSurveySuccess />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/web/login" replace />} />
          </Routes>
        </SMEProvider>
      </OfflineProvider>
    </Router>
  );
}

export default App;
