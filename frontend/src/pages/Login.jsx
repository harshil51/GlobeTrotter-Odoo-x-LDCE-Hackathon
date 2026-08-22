import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo.traveler@gmail.com');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  return (
    <div className="auth-shell">
      {/* Visual Side */}
      <div className="auth-visual">
        <div className="content">
          <div className="sidebar-logo" style={{ padding: '0 0 40px' }}>
            <div className="mark"><img src="/logo.png" alt="GlobeNest" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
            <div className="word" style={{ fontSize: '22px' }}>GlobeNest</div>
          </div>
        </div>

        <div className="content">
          <p className="quote">
            "The best itineraries aren't planned in spreadsheets — they're built city by city, day by day, until the journey feels completely yours."
          </p>
          <p className="quote-meta mono">
            GLOBENEST · SYSTEM 1.0 · CONNECTED TO MYSQL DATABASE
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className="active">Log in</button>
            <button onClick={() => navigate('/register')}>Create account</button>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-.02em' }}>
            Welcome back
          </h1>
          <p className="text-mute text-sm" style={{ margin: '0 0 24px' }}>
            Log in to manage your multi-city itineraries and budgets.
          </p>

          {/* Demo account selector pill */}
          <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--mist-100)', borderRadius: '12px' }}>
            <div className="flex items-center gap-6" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ocean-700)', marginBottom: '8px' }}>
              <Sparkles size={14} /> Quick Demo Logins (Click to autofill):
            </div>
            <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ background: '#fff', fontSize: '12px', padding: '5px 10px' }}
                onClick={() => handleDemoFill('demo.traveler@gmail.com', 'Demo@1234')}
              >
                Demo Traveler
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ background: '#fff', fontSize: '12px', padding: '5px 10px' }}
                onClick={() => handleDemoFill('masteragent.explorer@gmail.com', 'Demo@1234')}
              >
                MasterAgent
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ background: '#fff', fontSize: '12px', padding: '5px 10px' }}
                onClick={() => handleDemoFill('admin.platform@gmail.com', 'Admin@1234')}
              >
                Admin Platform
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ marginBottom: '22px' }}>
              <label className="checkbox-row">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a
                href="#"
                className="text-sm"
                style={{ color: 'var(--ocean-600)', fontWeight: 700 }}
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Password reset is simulated for demo purposes.');
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              type="submit"
              disabled={loading}
            >
              <LogIn size={16} /> {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-mute" style={{ textAlign: 'center', marginTop: '22px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--ocean-600)', fontWeight: 700 }}>
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
