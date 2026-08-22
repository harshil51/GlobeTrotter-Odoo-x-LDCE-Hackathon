import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { tripsApi } from '../api/trips.api';
import { useToast } from '../context/ToastContext';
import Shell from '../components/layout/Shell';

const CITY_COLORS = [
  '#2ba7a8', '#ff8a5c', '#c98a1f', '#289e66', '#1c8a8e', '#4fc0bd', '#f06f3f',
];

export default function CalendarPage() {
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getTrips()
      .then(setTrips)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [toast]);

  const events = [];

  trips.forEach((trip, ti) => {
    const color = CITY_COLORS[ti % CITY_COLORS.length];
    
    trip.stops?.forEach(stop => {
      // Add one day to end date for FullCalendar exclusive end dates
      const endDate = new Date(stop.endDate);
      endDate.setDate(endDate.getDate() + 1);

      events.push({
        title: stop.city?.name || trip.name,
        start: stop.startDate.split('T')[0],
        end: endDate.toISOString().split('T')[0],
        backgroundColor: color,
        borderColor: color,
        display: 'block'
      });

      // Activities
      stop.tripActivities?.forEach(ta => {
        events.push({
          title: ta.activity?.name || 'Activity',
          date: ta.date.split('T')[0],
          backgroundColor: '#8adcd4',
          borderColor: '#8adcd4',
          textColor: '#000',
          display: 'list-item'
        });
      });
    });
  });

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

        <div className="card" style={{ padding: '20px', minHeight: '600px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-faint)' }}>Loading...</div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
              height="auto"
            />
          )}
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
