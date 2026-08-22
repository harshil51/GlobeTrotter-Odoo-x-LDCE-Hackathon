import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Camera, User, Globe, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { initials, fmtDateFull } from '../utils/format';
import Shell from '../components/layout/Shell';
import api from '../api/client';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    language: user?.language || 'en',
    bio: user?.bio || '',
    profilePhoto: user?.profilePhoto || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await api.upload('/upload', formData);
      set('profilePhoto', res.url);
      toast.success('Photo uploaded! Click Save Changes to keep it.');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Shell>
      <div className="page" style={{ maxWidth: '760px' }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>Profile Settings</h1>
            <p>Member since {fmtDateFull(user?.createdAt)}</p>
          </div>
        </div>

        {/* Profile Photo Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div className="flex items-center gap-18" style={{ gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <div
                className="avatar"
                style={{ width: '80px', height: '80px', fontSize: '24px', borderRadius: '20px', cursor: 'pointer', opacity: uploading ? 0.5 : 1 }}
                onClick={() => fileInputRef.current?.click()}
                title="Click to change photo"
              >
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }}
                  />
                ) : (
                  initials(`${form.firstName} ${form.lastName}`)
                )}
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--teal-500)', borderRadius: '50%', padding: '6px', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                  <Camera size={14} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '18px' }}>{form.firstName} {form.lastName}</div>
              <div style={{ color: 'var(--ink-faint)', fontSize: '13px', marginBottom: '10px' }}>{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div className="flex items-center gap-8" style={{ marginBottom: '20px', fontWeight: 800, fontSize: '15px' }}>
            <User size={16} style={{ color: 'var(--teal-600)' }} /> Personal Information
          </div>

          <div className="grid grid-2" style={{ gap: '14px' }}>
            <div className="field">
              <label>First Name</label>
              <input className="input" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input className="input" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Email Address</label>
            <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            <div className="hint">Email cannot be changed in this version</div>
          </div>

          <div className="grid grid-2" style={{ gap: '14px' }}>
            <div className="field">
              <label><Phone size={12} style={{ verticalAlign: 'middle' }} /> Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 99999 99999" />
            </div>
            <div className="field">
              <label><Globe size={12} style={{ verticalAlign: 'middle' }} /> Language</label>
              <select className="input" value={form.language} onChange={e => set('language', e.target.value)}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="fr">French</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: '14px' }}>
            <div className="field">
              <label>City</label>
              <input className="input" value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div className="field">
              <label>Country</label>
              <input className="input" value={form.country} onChange={e => set('country', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Bio</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Tell the community a bit about yourself…"
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ padding: '20px', border: '1px solid #f7c6c3' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--danger)', marginBottom: '10px' }}>
            ⚠️ Account Actions
          </div>
          <div className="flex gap-10">
            <button
              className="btn btn-danger"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
