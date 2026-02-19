import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import './MobileLogin.css';

export default function MobileLogin() {
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const [language, setLanguage] = useState('EN');
  const [username, setUsername] = useState('rose.kila');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      navigate('/mobile/dashboard');
    }, 1000);
  };

  return (
    <div className="mobile-login">
      <div className="login-header">
        <div className="language-toggle">
          <button
            className={language === 'EN' ? 'active' : ''}
            onClick={() => setLanguage('EN')}
          >
            EN
          </button>
          <button
            className={language === 'TP' ? 'active' : ''}
            onClick={() => setLanguage('TP')}
          >
            TP
          </button>
        </div>

        <div className="logo-container">
          <div className="logo-text">GGGI</div>
          <div className="logo-divider"></div>
          <div className="logo-text">SMEC</div>
        </div>
      </div>

      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>LOGGING IN...</span>
              </>
            ) : (
              'LOGIN'
            )}
          </button>

          <div className="forgot-password">
            <a href="#forgot">Forgot Password? →</a>
          </div>
        </form>

        {isOffline && (
          <div className="offline-notice">
            <span className="offline-dot" />
            <span>Working Offline</span>
          </div>
        )}
      </div>
    </div>
  );
}
