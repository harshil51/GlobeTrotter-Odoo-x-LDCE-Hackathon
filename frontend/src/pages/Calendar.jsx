import React, { useEffect, useState } from 'react';
import { tripsApi } from '../api/trips.api';
import { useToast } from '../context/ToastContext';
import { fmtDate, daysBetween } from '../utils/format';
import Shell from '../components/layout/Shell';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CITY_COLORS = [
  '#2ba7a8', '#ff8a5c', '#c98a1f', '#289e66', '#1c8a8e', '#4fc0bd', '#f06f3f',
];

export default function CalendarPage() {
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getTrips()
      .then(setTrips)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a map of date => events
  const eventsMap = {};
  trips.forEach((trip, ti) => {
    const color = CITY_COLORS[ti % CITY_COLORS.length];
    trip.stops?.forEach(stop => {
      const start = new Date(stop.startDate);
      const end = new Date(stop.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getFullYear() === year && d.getMonth() === month) {
          const key = d.getDate();
          if (!eventsMap[key]) eventsMap[key] = [];
          eventsMap[key].push({
            label: stop.city?.name || trip.name,
            color,
            tripName: trip.name,
          });
        }
      }
      // Also mark activities
      stop.tripActivities?.forEach(ta => {
        const actD = new Date(ta.date);
        if (actD.getFullYear() === year && actD.getMonth() === month) {
          const key = actD.getDate();
          if (!eventsMap[key]) eventsMap[key] = [];
          eventsMap[key].push({
            label: ta.activity?.name || 'Activity',
            color: '#8adcd4',
            isActivity: true,
          });
        }
      });
    });
  });

  const today = new Date();

  const cells = [];
  // Empty leading cells
  for (let i = 0; i < firstDay; i++) cells.push(null);
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <Shell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Trip Calendar</span>
            <h1>Calendar View</h1>
            <p>Visual overview of all your trips and activities across time</p>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="card" style={{ padding: '20px', marginBottom: '0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <button className="btn btn-ghost btn-sm" onClick={prevMonth}>← Prev</button>
            <div style={{ fontWeight: 800, fontSize: '18px' }}>
              {MONTHS[month]} {year}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={nextMonth}>Next →</button>
          </div>

          <div className="cal-grid">
            {DAYS.map(d => (
              <div key={d} className="cal-daylabel">{d}</div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '0 20px 20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line-soft)', borderTop: 'none' }}>
          <div className="cal-grid">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const events = eventsMap[day] || [];
              const hasEvents = events.length > 0;
              return (
                <div key={day} className={`cal-cell ${hasEvents ? 'has-events' : ''}`}>
                  <div
                    className="d-num"
                    style={{
                      background: isToday ? 'var(--navy-950)' : 'transparent',
                      color: isToday ? '#fff' : undefined,
                      borderRadius: isToday ? '8px' : undefined,
                      padding: isToday ? '2px 5px' : undefined,
                      display: 'inline-block',
                    }}
                  >
                    {day}
                  </div>
                  {events.slice(0, 3).map((ev, j) => (
                    <div
                      key={j}
                      className="cal-chip"
                      style={{
                        background: ev.color,
                        fontSize: ev.isActivity ? '9px' : '10.5px',
                        opacity: ev.isActivity ? 0.75 : 1,
                      }}
                      title={ev.label}
                    >
                      {ev.label}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div style={{ fontSize: '9.5px', color: 'var(--ink-faint)', fontWeight: 700, marginTop: '2px' }}>
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        {trips.length > 0 && (
          <div className="card" style={{ padding: '16px 20px', marginTop: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px', color: 'var(--ink-soft)' }}>
              Trip Legend:
            </div>
            <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
              {trips.map((trip, ti) => (
                <div key={trip.id} className="flex items-center gap-6" style={{ fontSize: '12px', fontWeight: 600 }}>
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '4px',
                    background: CITY_COLORS[ti % CITY_COLORS.length],
                    flexShrink: 0,
                  }} />
                  {trip.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
