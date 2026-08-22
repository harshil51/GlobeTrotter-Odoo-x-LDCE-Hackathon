import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PREFERENCES = [
  'Adventure',
  'Food & Dining',
  'Culture & Arts',
  'Nature & Wildlife',
  'Beaches & Coastal',
  'History & Heritage',
  'Shopping',
  'Luxury & Wellness',
  'Budget Backpacking',
];

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: 'Bangalore',
    country: 'India',
  });
  const [selectedPrefs, setSelectedPrefs] = useState(['Culture & Arts', 'Food & Dining']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    const pcts = [10, 35, 65, 85, 100];
    const colors = ['#e2564a', '#e2564a', '#c98a1f', '#289e66', '#289e66'];
    const labels = ['Too short', 'Weak password', 'Okay password', 'Good password', 'Strong password'];
    return { pct: pcts[score], color: colors[score], label: labels[score] };
  };

  const strength = calculatePasswordStrength(formData.password);

  const togglePref = (pref) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com')) {
      toast.error('Please enter a valid Gmail address (@gmail.com).');
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error('Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }

    setLoading(true);
    try {
      await register({ ...formData, email: cleanEmail });
      toast.success('Account created! Welcome to GlobeNest.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            "Over 16 world destinations and hundreds of verified activities. Build, budget, and visualize your next dream trip effortlessly."
          </p>
          <p className="quote-meta mono">
            BOARDING PASS · NEW TRAVELER · SEAT 1A
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: '440px' }}>
          <div className="auth-tabs">
            <button onClick={() => navigate('/login')}>Log in</button>
            <button className="active">Create account</button>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-.02em' }}>
            Create your account
          </h1>
          <p className="text-mute text-sm" style={{ margin: '0 0 22px' }}>
            Takes under a minute. Connects straight to your trip database.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ gap: '12px' }}>
              <div className="field">
                <label>First name *</label>
                <input
                  className="input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Priya"
                  required
                />
              </div>
              <div className="field">
                <label>Last name *</label>
                <input
                  className="input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sharma"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Gmail address *</label>
              <input
                className="input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="yourname@gmail.com"
                required
              />
            </div>

            <div className="grid grid-2" style={{ gap: '12px' }}>
              <div className="field">
                <label>City</label>
                <input
                  className="input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Country</label>
                <input
                  className="input"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label>Password *</label>
              <div className="input-wrap">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <div style={{ height: '5px', borderRadius: '4px', background: 'var(--line-soft)', marginTop: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${strength.pct}%`,
                    background: strength.color,
                    transition: 'all .2s ease',
                  }}
                />
              </div>
              <div className="hint">{strength.label}</div>
            </div>

            <div className="field">
              <label>Travel preferences</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PREFERENCES.map((pref) => {
                  const isSelected = selectedPrefs.includes(pref);
                  return (
                    <span
                      key={pref}
                      className={`chip ${isSelected ? 'active' : ''}`}
                      onClick={() => togglePref(pref)}
                    >
                      {pref}
                    </span>
                  );
                })}
              </div>
            </div>

            <label className="checkbox-row" style={{ marginBottom: '20px' }}>
              <input type="checkbox" required /> I agree to the Terms of Service and Privacy Policy
            </label>

            <button
              className="btn btn-primary btn-block btn-lg"
              type="submit"
              disabled={loading}
            >
              <UserPlus size={16} /> {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-mute" style={{ textAlign: 'center', marginTop: '18px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--ocean-600)', fontWeight: 700 }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
