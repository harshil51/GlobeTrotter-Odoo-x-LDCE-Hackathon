import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Edit, Copy, Share2, Trash2 } from 'lucide-react';
import { fmtDate, fmtMoney, daysBetween, cityCode } from '../../utils/format';

export default function TicketCard({
  trip,
  onDuplicate,
  onShare,
  onDelete,
  manageMode = false,
}) {
  const navigate = useNavigate();

  const nights = daysBetween(trip.startDate, trip.endDate);
  const firstCity = trip.stops?.[0]?.city?.name || '—';
  const lastCity =
    trip.stops && trip.stops.length > 1
      ? trip.stops[trip.stops.length - 1]?.city?.name
      : firstCity;
  const stopsCount = trip.stops?.length ?? trip.stopCount ?? 0;

  const getStatusBadge = () => {
    const status = trip.status || (
      new Date(trip.endDate) < new Date() ? 'completed'
      : new Date(trip.startDate) > new Date() ? 'upcoming'
      : 'ongoing'
    );
    if (status === 'completed') return <span className="badge badge-navy">Completed</span>;
    if (status === 'ongoing') return <span className="badge badge-coral">Ongoing</span>;
    if (status === 'draft') return <span className="badge badge-warn">Draft</span>;
    return <span className="badge badge-teal">Upcoming</span>;
  };

  const coverUrl =
    trip.coverPhoto ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  const handleClick = () => {
    navigate(`/trips/${trip.id}/itinerary`);
  };

  return (
    <div className="ticket" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="ticket-cover">
        <img src={coverUrl} alt={trip.name} />
        <div className="ticket-status">{getStatusBadge()}</div>
        <div className="ticket-title">{trip.name}</div>
      </div>

      <div className="ticket-body">
        <div className="ticket-route">
          <div className="city-code">
            {cityCode(firstCity)}
            <small>FROM</small>
          </div>
          <div className="plane">
            <Plane size={18} />
          </div>
          <div className="city-code" style={{ textAlign: 'right' }}>
            {cityCode(lastCity)}
            <small style={{ textAlign: 'right' }}>
              {stopsCount} {stopsCount === 1 ? 'CITY' : 'CITIES'}
            </small>
          </div>
        </div>

        <div className="perf" />

        <div className="ticket-meta">
          <span>
            {fmtDate(trip.startDate)} → {fmtDate(trip.endDate)}{' '}
            <span className="mono">({nights}d)</span>
          </span>
          <span className="mono" style={{ fontWeight: 700 }}>
            {fmtMoney(trip.totalBudget)}
          </span>
        </div>

        {manageMode ? (
          <div
            className="flex gap-8"
            style={{ flexWrap: 'wrap', marginTop: '6px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-soft btn-sm"
              onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
            >
              <Edit size={13} /> Edit
            </button>
            {onDuplicate && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onDuplicate(trip)}
              >
                <Copy size={13} /> Duplicate
              </button>
            )}
            {onShare && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onShare(trip)}
              >
                <Share2 size={13} /> Share
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(trip)}
                title="Delete Trip"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ) : (
          <div className="ticket-foot">
            <div className="progress-mini">
              <div style={{ width: '85%' }} />
            </div>
            <button
              className="btn btn-soft btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/trips/${trip.id}/itinerary`);
              }}
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
