import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WebLogin.css';

export default function WebLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin@gggi.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/web/dashboard');
    }, 1000);
  };

  return (
    <div className="web-login">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
            <div className="brand-logo">
              <div className="logo-text">GGGI</div>
              <div className="logo-divider"></div>
              <div className="logo-text">SME</div>
            </div>
            <h1 className="brand-title">SME Database System</h1>
            <p className="brand-subtitle">
              Comprehensive database for Papua New Guinea's small and medium enterprises
            </p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon-bar" />
              <div>
                <h3>Real-time Analytics</h3>
                <p>Track SME performance and growth metrics</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-bar" />
              <div>
                <h3>Geographic Mapping</h3>
                <p>Visualize SME distribution across PNG</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-bar" />
              <div>
                <h3>Custom Reports</h3>
                <p>Generate detailed reports and insights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>Administrator Login</h2>
            <p className="login-description">Sign in to access the web dashboard</p>

            <form onSubmit={handleLogin} className="login-form-web">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="text-secondary">
                Mobile field officer? <a href="/mobile/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
