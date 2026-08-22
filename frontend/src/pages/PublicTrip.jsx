import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Globe, MapPin, Calendar, DollarSign } from 'lucide-react';
import { publicApi } from '../api/public.api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { fmtDateFull, fmtDate, fmtMoney, daysBetween, cityCode } from '../utils/format';

const CATEGORY_EMOJI = { SIGHTSEEING: '🗺️', FOOD: '🍜', CULTURE: '🏛️', ADVENTURE: '⛰️', NATURE: '🌿', SHOPPING: '🛍️', ENTERTAINMENT: '🎭', HISTORY: '📜', TRANSPORT: '🚌', ACCOMMODATION: '🏨' };

export default function PublicTrip() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    publicApi.getPublicTrip(shareToken)
      .then(setTrip)
      .catch(e => {
        toast.error('Trip not found or is no longer public');
        navigate('/community');
      })
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleCopy = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to copy this trip');
      navigate('/login');
      return;
    }
    setCopying(true);
    try {
      await publicApi.copyTrip(shareToken);
      toast.success('Trip copied to your library!');
      navigate('/trips');
    } catch (e) {
      toast.error(e.message || 'Failed to copy trip');
    } finally {
      setCopying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mist-50)' }}>
      <div style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: '15px' }}>✈️ Loading trip…</div>
    </div>
  );

  if (!trip) return null;

  const nights = daysBetween(trip.startDate, trip.endDate);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mist-50)', fontFamily: 'var(--font-display)' }}>
      {/* Top Bar */}
      <header style={{ background: 'var(--navy-950)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="sidebar-logo" style={{ padding: 0 }}>
          <div className="mark" style={{ width: '32px', height: '32px', fontSize: '14px' }}>GT</div>
          <div className="word" style={{ color: '#fff', fontSize: '17px' }}>GlobeTrotter</div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.2)' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <button className="btn btn-accent" onClick={handleCopy} disabled={copying}>
            <Copy size={14} /> {copying ? 'Copying…' : 'Copy This Trip'}
          </button>
        </div>
      </header>

      {/* Cover */}
      {trip.coverPhoto && (
        <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
          <img src={trip.coverPhoto} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,27,38,.2) 0%, rgba(7,27,38,.75) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '28px', left: '36px', color: '#fff' }}>
            <div className="flex items-center gap-8" style={{ marginBottom: '8px' }}>
              <span className="badge badge-navy" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>
                <Globe size={10} /> Public Itinerary
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-.02em' }}>{trip.name}</h1>
            {trip.description && (
              <p style={{ margin: '6px 0 0', fontSize: '14px', opacity: 0.85, maxWidth: '600px' }}>{trip.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Meta Strip */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '28px', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          <div className="flex items-center gap-8">
            <div className="avatar" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--teal-400), var(--coral-500))' }}>
              {trip.user?.profilePhoto
                ? <img src={trip.user.profilePhoto} alt={trip.user.firstName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                : trip.user?.firstName?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>{trip.user?.firstName} {trip.user?.lastName}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>{trip.user?.city}, {trip.user?.country}</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-mute">
            <Calendar size={14} /> {fmtDateFull(trip.startDate)} → {fmtDateFull(trip.endDate)} · <strong>{nights} nights</strong>
          </div>
          <div className="flex items-center gap-6 text-sm text-mute">
            <MapPin size={14} /> {trip.stops?.length} {trip.stops?.length === 1 ? 'city' : 'cities'}
          </div>
          <div className="flex items-center gap-6 text-sm text-mute">
            <DollarSign size={14} /> Budget: <strong>{fmtMoney(trip.totalBudget)}</strong>
          </div>
        </div>

        {/* Route Overview */}
        {trip.stops && trip.stops.length > 0 && (
          <div className="card" style={{ padding: '18px 20px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 800, marginBottom: '14px', fontSize: '15px' }}>✈️ Route Overview</div>
            <div className="flex items-center" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {trip.stops.map((stop, i) => (
                <React.Fragment key={stop.id}>
                  <div style={{
                    background: 'var(--navy-950)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 800,
                  }}>
                    {cityCode(stop.city?.name)} <span style={{ opacity: 0.6, fontSize: '11px' }}>{stop.city?.name}</span>
                  </div>
                  {i < trip.stops.length - 1 && (
                    <span style={{ color: 'var(--ink-faint)', fontSize: '16px' }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Stops with Activities */}
        {trip.stops?.map((stop, idx) => (
          <div key={stop.id} className="city-block" style={{ marginBottom: '16px' }}>
            <div className="city-block-head">
              {stop.city?.imageUrl && (
                <img src={stop.city.imageUrl} alt={stop.city?.name} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>
                  {stop.city?.name}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--teal-600)', marginLeft: '8px' }}>{cityCode(stop.city?.name)}</span>
                </div>
                <div className="text-sm text-mute flex gap-12">
                  <span>📅 {fmtDate(stop.startDate)} → {fmtDate(stop.endDate)}</span>
                  <span>🌙 {daysBetween(stop.startDate, stop.endDate)} nights</span>
                  <span>🎯 {stop.tripActivities?.length || 0} activities</span>
                </div>
                {stop.notes && <div style={{ marginTop: '6px', fontSize: '12px', fontStyle: 'italic', color: 'var(--ink-soft)' }}>📝 {stop.notes}</div>}
              </div>
            </div>

            {stop.tripActivities?.map(ta => (
              <div key={ta.id} className="activity-row">
                <div className="time">{ta.startTime ? ta.startTime.slice(11, 16) : '—'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{CATEGORY_EMOJI[ta.activity?.category]} {ta.activity?.name}</div>
                  <div className="text-sm text-mute flex gap-8" style={{ marginTop: '2px' }}>
                    {ta.activity?.duration && <span>⏱ {ta.activity.duration} min</span>}
                    <span>📅 {fmtDate(ta.date)}</span>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', color: 'var(--navy-900)', flexShrink: 0 }}>
                  {fmtMoney(ta.customCost ?? ta.activity?.estimatedCost)}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* CTA Banner */}
        <div className="card" style={{ padding: '28px', textAlign: 'center', background: 'linear-gradient(135deg, var(--navy-900), var(--ocean-700))', color: '#fff', border: 'none', marginTop: '32px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>✈️</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>Love this itinerary?</h3>
          <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '20px' }}>Copy it to your account and customize dates, activities, and budget.</p>
          <button className="btn btn-accent btn-lg" onClick={handleCopy} disabled={copying}>
            <Copy size={16} /> {copying ? 'Copying…' : 'Copy This Trip to My Library'}
          </button>
        </div>
      </div>
    </div>
  );
}
