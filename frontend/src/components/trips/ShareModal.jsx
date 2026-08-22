import React, { useState } from 'react';
import { Copy, Eye, Globe } from 'lucide-react';
import Modal from '../common/Modal';
import { publicApi } from '../../api/public.api';
import { useToast } from '../../context/ToastContext';

export default function ShareModal({ trip, isOpen, onClose, onUpdated }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [shareToken, setShareToken] = useState(trip?.shareToken || '');
  const [isPublic, setIsPublic] = useState(trip?.isPublic || false);

  const shareUrl = shareToken
    ? `${window.location.origin}/public/trips/${shareToken}`
    : '';

  const handleMakePublic = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      const res = await publicApi.shareTrip(trip.id);
      setShareToken(res.shareToken);
      setIsPublic(true);
      toast.success('Trip published! Anyone with the link can view it.');
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to share trip');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePrivate = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      await publicApi.unshareTrip(trip.id);
      setIsPublic(false);
      setShareToken('');
      toast.info('Trip is now private.');
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to unshare trip');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Trip Itinerary" maxWidth={480}>
      <div className="flex-col gap-12">
        <p className="text-sm text-mute" style={{ marginTop: 0 }}>
          Anyone with this link can view a read-only copy of <b>{trip?.name}</b>, explore the day-by-day activities, and copy it to their account.
        </p>

        {isPublic && shareToken ? (
          <div>
            <div className="flex gap-8" style={{ margin: '14px 0 8px' }}>
              <input
                className="input mono text-sm"
                readOnly
                value={shareUrl}
                style={{ fontSize: '13px' }}
              />
              <button className="btn btn-primary" onClick={handleCopyLink}>
                <Copy size={15} /> Copy
              </button>
            </div>

            <div className="flex gap-8" style={{ marginTop: '12px' }}>
              <a
                className="btn btn-ghost"
                style={{ flex: 1 }}
                href={`/public/trips/${shareToken}`}
                target="_blank"
                rel="noreferrer"
              >
                <Eye size={15} /> Preview Public Page
              </a>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleMakePrivate}
                disabled={loading}
              >
                Make Private
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '14px' }}>
            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--mist-100)',
                border: '1px dashed var(--teal-400)',
                marginBottom: '16px',
              }}
            >
              <div className="flex items-center gap-10">
                <Globe size={24} style={{ color: 'var(--teal-600)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>This trip is currently private</div>
                  <div className="text-sm text-mute">Enable public sharing to generate a shareable URL.</div>
                </div>
              </div>
            </div>

            <button
              className="btn btn-accent btn-block btn-lg"
              onClick={handleMakePublic}
              disabled={loading}
            >
              <Globe size={16} /> {loading ? 'Publishing…' : 'Generate Public Link & Share'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
