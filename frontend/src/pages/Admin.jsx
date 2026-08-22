import React, { useEffect, useState } from 'react';
import { Users, Luggage, MapPin, DollarSign, TrendingUp, Globe } from 'lucide-react';
import { adminApi } from '../api/admin.api';
import { useToast } from '../context/ToastContext';
import { fmtMoney, fmtDateFull } from '../utils/format';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Shell from '../components/layout/Shell';

const STATUS_COLORS = { upcoming: 'var(--teal-500)', ongoing: 'var(--coral-500)', completed: 'var(--ink-faint)' };

export default function Admin() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAdminStats()
      .then(setStats)
      .catch(e => toast.error(e.message || 'Failed to load admin stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Shell>
      <div className="page" style={{ paddingTop: '60px', textAlign: 'center', color: 'var(--ink-faint)' }}>
        Loading platform analytics…
      </div>
    </Shell>
  );

  if (!stats) return null;

  const tripStatusData = [
    { name: 'Upcoming', value: stats.tripStatus.upcoming },
    { name: 'Ongoing', value: stats.tripStatus.ongoing },
    { name: 'Completed', value: stats.tripStatus.completed },
  ].filter(d => d.value > 0);

  const platformStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'var(--teal-600)' },
    { label: 'Total Trips', value: stats.totalTrips, icon: Luggage, color: 'var(--ocean-700)' },
    { label: 'Trip Activities', value: stats.totalActivities, icon: MapPin, color: 'var(--coral-600)' },
    { label: 'Expense Entries', value: stats.totalExpenses, icon: TrendingUp, color: 'var(--warning)' },
    { label: 'Total Stops', value: stats.totalStops, icon: Globe, color: 'var(--success)' },
    { label: 'Avg Trip Budget', value: fmtMoney(stats.averageBudget), icon: DollarSign, color: 'var(--navy-900)' },
  ];

  return (
    <Shell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Platform Analytics</span>
            <h1>Admin Dashboard</h1>
            <p>Real-time metrics drawn live from the GlobeTrotter MySQL database</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-3" style={{ marginBottom: '28px' }}>
          {platformStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card stat-card">
                <div className="label">
                  <Icon size={14} style={{ color: s.color }} />
                  {s.label}
                </div>
                <div className="value" style={{ color: s.color, fontSize: '28px' }}>{s.value}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '28px' }}>
          {/* Trip Status Breakdown */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '16px' }}>📊 Trip Status Breakdown</div>
            {tripStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={tripStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                      {tripStatusData.map(entry => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()] || 'var(--ink-faint)'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-12 justify-center" style={{ marginTop: '10px' }}>
                  {tripStatusData.map(d => (
                    <div key={d.name} className="flex items-center gap-6" style={{ fontSize: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: STATUS_COLORS[d.name.toLowerCase()], flexShrink: 0 }} />
                      <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{d.name}: <strong>{d.value}</strong></span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-faint)', fontSize: '13px' }}>No trip data available</div>
            )}
          </div>

          {/* Popular Destinations */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '14px' }}>🌍 Top Destinations</div>
            {stats.popularCities?.map((city, i) => (
              <div
                key={city.id}
                className="flex items-center gap-12"
                style={{ padding: '8px 0', borderBottom: i < stats.popularCities.length - 1 ? '1px solid var(--line-soft)' : 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, color: 'var(--ink-faint)', width: '18px', flexShrink: 0 }}>#{i + 1}</span>
                {city.imageUrl && (
                  <img src={city.imageUrl} alt={city.name} style={{ width: '38px', height: '30px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{city.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>{city.country}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--teal-600)' }}>{city._count?.activities || 0} activities</div>
                  <div style={{ color: 'var(--ink-faint)' }}>⭐ {city.popularity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="section-head">
          <h2>👤 Recent Users</h2>
          <span style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>Latest {stats.recentUsers?.length} registrations</span>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: 'var(--mist-100)', borderBottom: '1px solid var(--line)' }}>
                {['User', 'Location', 'Joined', 'Trips', 'Email'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers?.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line-soft)', background: i % 2 === 0 ? '#fff' : 'var(--mist-50)' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div className="flex items-center gap-8">
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px', flexShrink: 0 }}>
                        {(u.firstName?.[0] || '?').toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 700 }}>{u.firstName} {u.lastName}</div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--ink-soft)' }}>{u.city || '—'}, {u.country || '—'}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>{fmtDateFull(u.createdAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span className="badge badge-teal">{u._count?.trips || 0} trips</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--ink-faint)' }}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
