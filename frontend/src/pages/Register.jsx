import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft, ChevronDown, Check } from 'lucide-react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    const pcts = [10, 35, 65, 85, 100];
    const colors = ['#e2564a', '#e2564a', '#c98a1f', '#289e66', '#289e66'];
    const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];
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
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
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
          <div className="sidebar-logo" style={{ padding: '60px 0 40px' }}>
            <div className="mark"><img src="/logo.png" alt="GlobeNest" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
            <div className="word" style={{ fontSize: '22px' }}>GlobeNest</div>
          </div>
        </div>

        <div className="content">
          <p className="quote">
            "Over 16 world destinations and hundreds of verified activities. Build, budget, and visualize your next dream trip effortlessly."
          </p>
          <p className="quote-meta mono">
            GLOBENEST · SYSTEM 1.0 · CONNECTED TO MYSQL DATABASE
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: '460px' }}>
          <div className="auth-tabs" style={{ marginBottom: '20px' }}>
            <button onClick={() => navigate('/login')}>Log in</button>
            <button className="active">Create account</button>
          </div>

          <h1 style={{ fontSize: '25px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-.02em' }}>
            Create your account
          </h1>
          <p className="text-mute text-sm" style={{ margin: '0 0 20px' }}>
            Takes under a minute. Connects straight to your trip database.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Row 1: Names */}
            <div className="grid grid-2" style={{ gap: '12px' }}>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block' }}>First name *</label>
                <input
                  className="input"
                  style={{ height: '40px', padding: '8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Priya"
                  required
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block' }}>Last name *</label>
                <input
                  className="input"
                  style={{ height: '40px', padding: '8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sharma"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email & Password */}
            <div className="grid grid-2" style={{ gap: '12px' }}>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block' }}>Email address *</label>
                <input
                  className="input"
                  style={{ height: '40px', padding: '8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="priya@example.com"
                  required
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>Password *</label>
                  {formData.password && (
                    <span style={{ fontSize: '11px', color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                  )}
                </div>
                <div className="input-wrap">
                  <input
                    className="input"
                    style={{ height: '40px', padding: '8px 36px 8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    style={{ height: '40px', width: '36px' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {formData.password && (
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--line-soft)', marginTop: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${strength.pct}%`,
                        background: strength.color,
                        transition: 'all .2s ease',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: City & Country */}
            <div className="grid grid-2" style={{ gap: '12px' }}>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block' }}>City</label>
                <input
                  className="input"
                  style={{ height: '40px', padding: '8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px', display: 'block' }}>Country</label>
                <input
                  className="input"
                  style={{ height: '40px', padding: '8px 12px', fontSize: '13.5px', borderRadius: '9px' }}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                />
              </div>
            </div>

            {/* Row 4: Travel Preferences Multi-Select Dropdown */}
            <div className="field" style={{ margin: 0, position: 'relative' }} ref={dropdownRef}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, margin: 0, display: 'block' }}>
                  Travel preferences
                </label>
                {selectedPrefs.length > 0 && (
                  <span style={{ color: 'var(--teal-600, #0d9488)', fontSize: '12px', fontWeight: 700 }}>
                    {selectedPrefs.length} selected
                  </span>
                )}
              </div>
              
              {/* Dropdown Trigger */}
              <div
                className="input"
                style={{
                  height: '40px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderRadius: '9px',
                  userSelect: 'none',
                  background: '#fff',
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1, paddingRight: '8px' }}>
                  {selectedPrefs.length === 0 ? (
                    <span style={{ color: 'var(--ink-faint, #94a3b8)', fontSize: '13.5px' }}>Select preferences...</span>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--ink-900)', fontWeight: 500 }}>
                      {selectedPrefs.join(', ')}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    color: 'var(--ink-soft, #64748b)',
                    transition: 'transform 0.2s ease',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    zIndex: 60,
                    background: '#fff',
                    border: '1.5px solid var(--line, #e2e8f0)',
                    borderRadius: '10px',
                    boxShadow: '0 12px 28px -4px rgba(0,0,0,0.12), 0 8px 12px -6px rgba(0,0,0,0.06)',
                    maxHeight: '190px',
                    overflowY: 'auto',
                    padding: '6px',
                  }}
                >
                  {PREFERENCES.map((pref) => {
                    const isSelected = selectedPrefs.includes(pref);
                    return (
                      <div
                        key={pref}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: isSelected ? 600 : 400,
                          background: isSelected ? 'rgba(79, 192, 189, 0.12)' : 'transparent',
                          color: isSelected ? 'var(--teal-700, #0f766e)' : 'var(--ink-800)',
                          transition: 'background 0.15s ease',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'var(--mist-100, #f1f5f9)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePref(pref);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ margin: 0, cursor: 'pointer', width: '14px', height: '14px' }}
                          />
                          <span>{pref}</span>
                        </div>
                        {isSelected && <Check size={14} style={{ color: 'var(--teal-600, #0d9488)' }} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Row 5: Agreement Checkbox */}
            <label className="checkbox-row" style={{ margin: '2px 0 0', fontSize: '12.5px', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" required style={{ marginTop: 0 }} /> I agree to the Terms of Service and Privacy Policy
            </label>

            {/* Row 6: Submit & Back to Home */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <button
                className="btn btn-primary btn-block btn-lg"
                style={{ height: '44px', fontSize: '14px', borderRadius: '10px', justifyContent: 'center' }}
                type="submit"
                disabled={loading}
              >
                <UserPlus size={16} /> {loading ? 'Creating Account…' : 'Create Account'}
              </button>
              <Link 
                to="/" 
                className="btn btn-ghost btn-block btn-lg" 
                style={{ height: '40px', fontSize: '13.5px', borderRadius: '10px', justifyContent: 'center' }}
              >
                <ArrowLeft size={15} /> Back to Home
              </Link>
            </div>
          </form>

          <p className="text-sm text-mute" style={{ textAlign: 'center', marginTop: '16px' }}>
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
