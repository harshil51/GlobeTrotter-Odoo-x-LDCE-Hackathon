import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Map, Calendar, DollarSign, Loader } from 'lucide-react';
import { travelApi } from '../api/travel.api';
import { useToast } from '../context/ToastContext';
import Shell from '../components/layout/Shell';
import { addDays } from '../utils/format';

const STEPS = [
  { num: 1, label: 'Trip Basics' },
  { num: 2, label: 'Dates & Budget' },
  { num: 3, label: 'Preferences' },
  { num: 4, label: 'Review' },
];

const COVER_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
];

export default function NewTrip() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: today,
    endDate: addDays(today, 7),
    totalBudget: 50000,
    travelers: 1,
    travelStyle: 'Balanced',
    interests: [],
    destinations: [],
    coverPhoto: COVER_SUGGESTIONS[0],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim()) { toast.error('Please give your trip a name'); return; }
    }
    if (step === 2) {
      if (form.endDate < form.startDate) { toast.error('End date must be on or after start date'); return; }
    }
    if (step < 3) setStep(s => s + 1);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const response = await travelApi.generateTripPlan({
        name: form.name.trim(),
        origin: 'Ahmedabad', // Hardcoded for now
        destinations: form.destinations.length ? form.destinations : [form.name.trim()], 
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.totalBudget) || 0,
        travelers: form.travelers,
        interests: form.interests,
        travelStyle: form.travelStyle
      });
      toast.success('Trip created and Itinerary generated!');
      navigate(`/trips/${response.trip.id}/itinerary`);
    } catch (e) {
      toast.error(e.message || 'Failed to create trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <div className="page" style={{ maxWidth: '700px' }}>
        <div className="page-head">
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')} style={{ marginBottom: '12px' }}>
              <ArrowLeft size={15} /> Back to Trips
            </button>
            <span className="eyebrow">New Adventure</span>
            <h1>Plan a New Trip</h1>
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="wizard-steps" style={{ marginBottom: '32px' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`wz-step ${step === s.num ? 'active' : step > s.num ? 'done' : ''}`}>
                <div className="wz-num">{step > s.num ? '✓' : s.num}</div>
                <div className="wz-label">{s.label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`wz-line ${step > s.num ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {/* Step 1: Basics */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-10" style={{ marginBottom: '24px' }}>
                <Map size={22} style={{ color: 'var(--teal-600)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '17px' }}>Tell us about your trip</div>
                  <div className="text-sm text-mute">Give it an inspiring name and description</div>
                </div>
              </div>

              <div className="field">
                <label>Trip Name *</label>
                <input
                  className="input"
                  placeholder="e.g. Japan Discovery — 10 Days"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field">
                <label>Description (optional)</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="A short summary of what this trip is about…"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="field">
                <label>Cover Photo</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  {COVER_SUGGESTIONS.map(url => (
                    <div
                      key={url}
                      onClick={() => set('coverPhoto', url)}
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: form.coverPhoto === url ? '3px solid var(--teal-500)' : '3px solid transparent',
                        height: '80px',
                      }}
                    >
                      <img src={url} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '11px' }}>Or paste a custom image URL:</label>
                  <input
                    className="input"
                    placeholder="https://…"
                    value={form.coverPhoto}
                    onChange={e => set('coverPhoto', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Dates & Budget */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-10" style={{ marginBottom: '24px' }}>
                <Calendar size={22} style={{ color: 'var(--teal-600)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '17px' }}>Dates & Budget</div>
                  <div className="text-sm text-mute">When are you going and what's your budget?</div>
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '14px' }}>
                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={form.startDate}
                    onChange={e => {
                      set('startDate', e.target.value);
                      if (form.endDate < e.target.value) set('endDate', addDays(e.target.value, 7));
                    }}
                  />
                </div>
                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={e => set('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Total Budget (₹)</label>
                <input
                  type="number"
                  className="input"
                  value={form.totalBudget}
                  min={0}
                  step={500}
                  onChange={e => set('totalBudget', e.target.value)}
                />
                <div className="hint">This is the overall budget you plan to track against. You can change it later.</div>
              </div>

              <div className="card" style={{ padding: '14px 16px', background: 'var(--mist-100)', border: 'none' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Trip Duration</div>
                    <div className="text-sm text-mute">Based on your dates above</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 800, color: 'var(--teal-600)' }}>
                    {Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000))}
                    <span style={{ fontSize: '14px', color: 'var(--ink-soft)', fontFamily: 'inherit' }}> nights</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-10" style={{ marginBottom: '24px' }}>
                <Map size={22} style={{ color: 'var(--teal-600)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '17px' }}>Travel Preferences</div>
                  <div className="text-sm text-mute">Help our AI engine generate the perfect itinerary for you</div>
                </div>
              </div>

              <div className="field">
                <label>Main Destinations (comma separated)</label>
                <input
                  className="input"
                  placeholder="e.g. Paris, Amsterdam"
                  value={form.destinations.join(', ')}
                  onChange={e => set('destinations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              <div className="grid grid-2" style={{ gap: '14px' }}>
                <div className="field">
                  <label>Travelers</label>
                  <input
                    type="number"
                    className="input"
                    value={form.travelers}
                    min={1}
                    onChange={e => set('travelers', parseInt(e.target.value))}
                  />
                </div>
                <div className="field">
                  <label>Travel Style</label>
                  <select className="input" value={form.travelStyle} onChange={e => set('travelStyle', e.target.value)}>
                    <option value="Budget">Budget</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Interests</label>
                <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
                  {['History', 'Food', 'Nature', 'Shopping', 'Nightlife', 'Photography', 'Art'].map(interest => (
                    <span
                      key={interest}
                      className={`chip ${form.interests.includes(interest) ? 'active' : ''}`}
                      onClick={() => {
                        const active = form.interests.includes(interest);
                        if (active) set('interests', form.interests.filter(i => i !== interest));
                        else set('interests', [...form.interests, interest]);
                      }}
                      style={{ fontSize: '13px', padding: '6px 12px', cursor: 'pointer' }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Confirm & Create */}
          {step === 4 && (
            <>
              <div className="flex items-center gap-10" style={{ marginBottom: '24px' }}>
                <DollarSign size={22} style={{ color: 'var(--teal-600)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '17px' }}>Review & Create</div>
                  <div className="text-sm text-mute">Confirm your trip details before building the itinerary</div>
                </div>
              </div>

              <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
                <img src={form.coverPhoto} alt="Trip cover" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(7,27,38,.7))',
                  padding: '20px 16px 14px',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '19px'
                }}>
                  {form.name}
                </div>
              </div>

              {[
                ['Description', form.description || '(none)'],
                ['Dates', `${form.startDate} → ${form.endDate}`],
                ['Duration', `${Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000))} nights`],
                ['Budget', `₹${Number(form.totalBudget).toLocaleString('en-IN')}`],
                ['Style & Interests', `${form.travelStyle} • ${form.interests.join(', ') || 'General'}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between" style={{ padding: '9px 0', borderBottom: '1px solid var(--line-soft)', fontSize: '14px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{val}</span>
                </div>
              ))}

              <div className="card" style={{
                marginTop: '18px',
                padding: '14px 16px',
                background: 'var(--teal-100)',
                border: '1px solid var(--teal-300)',
                fontSize: '13px',
                color: 'var(--ocean-700)',
                fontWeight: 600
              }}>
                🎉 After creating, our AI engine will generate a smart, geographically optimized itinerary for you!
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between" style={{ marginTop: '28px' }}>
            <button
              className="btn btn-ghost"
              onClick={() => step === 1 ? navigate('/trips') : setStep(s => s - 1)}
            >
              <ArrowLeft size={15} /> {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 4 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn btn-accent btn-lg" onClick={handleCreate} disabled={saving}>
                {saving ? <><Loader size={16} className="spin" /> Creating…</> : '🚀 Create Trip & Build Itinerary'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
