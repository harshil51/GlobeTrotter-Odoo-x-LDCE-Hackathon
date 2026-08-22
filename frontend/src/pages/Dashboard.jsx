import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Luggage, TrendingUp, Globe, MapPin, ArrowRight, Plus, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripsApi } from '../api/trips.api';
import { citiesApi } from '../api/cities.api';
import { fmtMoney, fmtDate, daysBetween, cityCode } from '../utils/format';
import TicketCard from '../components/trips/TicketCard';
import Shell from '../components/layout/Shell';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    tripsApi.getTrips()
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoadingTrips(false));

    citiesApi.searchCities('', '', 8)
      .then(setCities)
      .catch(console.error)
      .finally(() => setLoadingCities(false));
  }, []);

  const upcomingTrips = trips.filter(t =>
    new Date(t.startDate) > new Date() || new Date(t.endDate) >= new Date()
  ).slice(0, 3);

  const totalBudget = trips.reduce((s, t) => s + Number(t.totalBudget || 0), 0);
  const totalNights = trips.reduce((s, t) => s + daysBetween(t.startDate, t.endDate), 0);

  const stats = [
    {
      label: 'Total Trips Planned',
      value: trips.length,
      icon: Luggage,
      delta: trips.length > 0 ? `+${trips.length} in your library` : 'Start planning!',
      up: true,
    },
    {
      label: 'Destinations Explored',
      value: [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.city?.name)).filter(Boolean))].length,
      icon: Globe,
      delta: 'unique cities',
      up: true,
    },
    {
      label: 'Total Nights',
      value: totalNights,
      icon: MapPin,
      delta: `across ${trips.length} trip${trips.length !== 1 ? 's' : ''}`,
      up: true,
    },
    {
      label: 'Total Budgeted',
      value: fmtMoney(totalBudget),
      icon: TrendingUp,
      delta: totalBudget > 0 ? 'allocated across trips' : 'Set budgets',
      up: true,
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Shell>
      <div className="page">
        {/* Header */}
        <div className="page-head">
          <div>
            <span className="eyebrow">Dashboard Overview</span>
            <h1>{greeting}, {user?.firstName || 'Traveler'} 👋</h1>
            <p>Here's your travel command center. You have <strong>{trips.length} trips</strong> in your library.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')}>
            <Plus size={16} /> Plan New Trip
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card stat-card">
                <div className="label">
                  <Icon size={14} style={{ color: 'var(--teal-600)' }} />
                  {s.label}
                </div>
                <div className="value">{s.value}</div>
                <div className={`delta ${s.up ? 'up' : 'down'}`}>{s.delta}</div>
              </div>
            );
          })}
        </div>

        {/* My Trips */}
        <div className="section-head">
          <h2>✈️ My Trips</h2>
          <span className="link" onClick={() => navigate('/trips')}>
            View all <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
          </span>
        </div>

        {loadingTrips ? (
          <div style={{ padding: '30px 0', color: 'var(--ink-faint)', fontSize: '14px' }}>
            Loading your trips…
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="icon-wrap"><Luggage size={28} /></div>
            <h3>No trips yet</h3>
            <p>Start planning your first multi-city adventure — it only takes a minute.</p>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/trips/new')}>
              <Plus size={16} /> Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {trips.slice(0, 6).map((trip) => (
              <TicketCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Discover Cities */}
        <div className="section-head" style={{ marginTop: '36px' }}>
          <h2>🌍 Explore Destinations</h2>
          <span className="link" onClick={() => navigate('/explore')}>
            Browse all <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
          </span>
        </div>

        <div className="hscroll">
          {loadingCities ? (
            <div style={{ padding: '40px', color: 'var(--ink-faint)' }}>Loading cities…</div>
          ) : (
            cities.map((city) => (
              <div
                key={city.id}
                className="dest-card card-hover"
                style={{ width: '210px', cursor: 'pointer' }}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(city.name)}`)}
              >
                <div className="img-wrap">
                  <img
                    src={city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                    alt={city.name}
                  />
                </div>
                <div className="body">
                  <h4>{city.name}</h4>
                  <div className="country">{city.country} · {city.region}</div>
                  <div className="row">
                    <span className="badge badge-teal">
                      <Compass size={10} /> {city._count?.activities || 0} activities
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {cityCode(city.name)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
