import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Share2, Trash2, Copy, Luggage } from 'lucide-react';
import { tripsApi } from '../api/trips.api';
import { publicApi } from '../api/public.api';
import { useToast } from '../context/ToastContext';
import { fmtMoney, fmtDateFull, daysBetween } from '../utils/format';
import TicketCard from '../components/trips/TicketCard';
import ShareModal from '../components/trips/ShareModal';
import Modal from '../components/common/Modal';
import Shell from '../components/layout/Shell';

export default function Trips() {
  const navigate = useNavigate();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [shareTrip, setShareTrip] = useState(null);
  const [deleteTrip, setDeleteTrip] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    tripsApi.getTrips()
      .then(setTrips)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = trips.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQ.toLowerCase());
    if (filter === 'all') return matchesSearch;
    const now = new Date();
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    if (filter === 'upcoming') return matchesSearch && start > now;
    if (filter === 'ongoing') return matchesSearch && start <= now && end >= now;
    if (filter === 'completed') return matchesSearch && end < now;
    return matchesSearch;
  });

  const handleDelete = async () => {
    if (!deleteTrip) return;
    setDeleting(true);
    try {
      await tripsApi.deleteTrip(deleteTrip.id);
      toast.success('Trip deleted successfully');
      setDeleteTrip(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (trip) => {
    if (!trip.shareToken) {
      toast.info('Enable public sharing first to duplicate a trip.');
      return;
    }
    try {
      await publicApi.copyTrip(trip.shareToken);
      toast.success('Trip duplicated to your library!');
      load();
    } catch (e) {
      toast.error(e.message || 'Duplication failed');
    }
  };

  const FILTERS = [
    { label: 'All Trips', value: 'all' },
    { label: '🛫 Upcoming', value: 'upcoming' },
    { label: '✈️ Ongoing', value: 'ongoing' },
    { label: '🏁 Completed', value: 'completed' },
  ];

  return (
    <Shell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Travel Library</span>
            <h1>My Trips</h1>
            <p>{trips.length} trip{trips.length !== 1 ? 's' : ''} in your library</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')}>
            <Plus size={16} /> Plan New Trip
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex gap-12 items-center" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="input-wrap" style={{ flex: 1, minWidth: '220px', maxWidth: '380px' }}>
            <input
              className="input"
              placeholder="Search trips…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }}>
              <Search size={15} />
            </span>
          </div>
          <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <span
                key={f.value}
                className={`chip ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', color: 'var(--ink-faint)', textAlign: 'center' }}>
            Loading your trips…
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon-wrap"><Luggage size={28} /></div>
            <h3>{searchQ ? 'No trips match your search' : 'No trips yet'}</h3>
            <p>{searchQ ? 'Try a different keyword.' : 'Start planning your first adventure!'}</p>
            {!searchQ && (
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/trips/new')}>
                <Plus size={16} /> Plan Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map(trip => (
              <TicketCard
                key={trip.id}
                trip={trip}
                manageMode
                onDuplicate={handleDuplicate}
                onShare={() => setShareTrip(trip)}
                onDelete={() => setDeleteTrip(trip)}
              />
            ))}
          </div>
        )}

        {/* Share Modal */}
        {shareTrip && (
          <ShareModal
            trip={shareTrip}
            isOpen={!!shareTrip}
            onClose={() => setShareTrip(null)}
            onUpdated={load}
          />
        )}

        {/* Delete Confirm Modal */}
        <Modal
          isOpen={!!deleteTrip}
          onClose={() => setDeleteTrip(null)}
          title="Delete Trip"
          maxWidth={400}
        >
          <p style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--ink-soft)' }}>
            Are you sure you want to permanently delete{' '}
            <strong>{deleteTrip?.name}</strong>? This will also remove all stops, activities, and expenses. This cannot be undone.
          </p>
          <div
            className="card"
            style={{ padding: '12px 14px', background: 'var(--danger-bg)', border: '1px solid #f7c6c3', marginBottom: '20px', marginTop: '12px' }}
          >
            <span style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>
              ⚠️ {fmtDateFull(deleteTrip?.startDate)} → {fmtDateFull(deleteTrip?.endDate)} ·{' '}
              {fmtMoney(deleteTrip?.totalBudget)}
            </span>
          </div>
          <div className="flex gap-10">
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteTrip(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete} disabled={deleting}>
              <Trash2 size={15} /> {deleting ? 'Deleting…' : 'Delete Trip'}
            </button>
          </div>
        </Modal>
      </div>
    </Shell>
  );
}
