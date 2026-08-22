import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, Copy, Eye } from 'lucide-react';
import { publicApi } from '../api/public.api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { fmtDateFull, daysBetween, fmtMoney, cityCode } from '../utils/format';
import Shell from '../components/layout/Shell';

export default function Community() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(null);

  useEffect(() => {
    publicApi.getCommunityTrips()
      .then(setTrips)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async (trip) => {
    if (!isAuthenticated) {
      toast.info('Please log in to copy this trip to your library');
      navigate('/login');
      return;
    }
    if (!trip.shareToken) {
      toast.error('This trip does not have a share token');
      return;
    }
    setCopying(trip.id);
    try {
      await publicApi.copyTrip(trip.shareToken);
      toast.success(`"${trip.name}" copied to your trip library!`);
      navigate('/trips');
    } catch (e) {
      toast.error(e.message || 'Failed to copy trip');
    } finally {
      setCopying(null);
    }
  };

  return (
    <Shell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Community</span>
            <h1>Public Trip Gallery</h1>
            <p>Browse inspiring itineraries shared by the GlobeNest community. Copy and customize for your own adventure.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-faint)' }}>
            Loading community trips…
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="icon-wrap"><Users size={26} /></div>
            <h3>No public trips yet</h3>
            <p>Be the first to share your itinerary with the community!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {trips.map(trip => {
              const nights = daysBetween(trip.startDate, trip.endDate);
              const routeCities = trip.stops?.map(s => s.city?.name).filter(Boolean) || [];
              return (
                <div key={trip.id} className="card card-hover" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  {/* Cover */}
                  <div style={{ position: 'relative', height: '170px' }}
                    onClick={() => trip.shareToken && navigate(`/public/trips/${trip.shareToken}`)}>
                    <img
                      src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(7,27,38,.7) 100%)',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '16px', right: '16px',
                      color: '#fff', fontWeight: 800, fontSize: '16px',
                    }}>
                      {trip.name}
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className="badge badge-navy"><Globe size={10} /> Public</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 16px' }}>
                    {/* Author */}
                    <div className="flex items-center gap-8" style={{ marginBottom: '10px' }}>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                        {trip.user?.firstName?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12.5px' }}>
                          {trip.user?.firstName} {trip.user?.lastName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>
                          {trip.user?.city}, {trip.user?.country}
                        </div>
                      </div>
                    </div>

                    {/* Route chips */}
                    {routeCities.length > 0 && (
                      <div className="flex gap-6" style={{ flexWrap: 'wrap', marginBottom: '10px' }}>
                        {routeCities.map((city, i) => (
                          <React.Fragment key={city}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: 'var(--teal-600)', background: 'var(--teal-100)', borderRadius: '6px', padding: '3px 7px' }}>
                              {cityCode(city)}
                            </span>
                            {i < routeCities.length - 1 && (
                              <span style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center" style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '12px' }}>
                      <span>📅 {fmtDateFull(trip.startDate)}</span>
                      <span>🌙 {nights} nights</span>
                      <span>💰 {fmtMoney(trip.totalBudget)}</span>
                    </div>

                    <div className="flex gap-8">
                      {trip.shareToken && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => navigate(`/public/trips/${trip.shareToken}`)}
                        >
                          <Eye size={13} /> View
                        </button>
                      )}
                      <button
                        className="btn btn-accent btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleCopy(trip)}
                        disabled={copying === trip.id}
                      >
                        <Copy size={13} /> {copying === trip.id ? 'Copying…' : 'Copy Trip'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
