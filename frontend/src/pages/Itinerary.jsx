import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, MapPin, Clock, DollarSign,
  Calendar, ChevronDown, ChevronUp, Share2, BarChart2
} from 'lucide-react';
import { tripsApi } from '../api/trips.api';
import { stopsApi } from '../api/stops.api';
import { citiesApi } from '../api/cities.api';
import { activitiesApi } from '../api/activities.api';
import { useToast } from '../context/ToastContext';
import { fmtDate, fmtMoney, daysBetween, cityCode } from '../utils/format';
import Modal from '../components/common/Modal';
import ShareModal from '../components/trips/ShareModal';
import Shell from '../components/layout/Shell';
import GeneratedPlan from './GeneratedPlan';

const CATEGORY_LABELS = {
  SIGHTSEEING: '🗺️ Sightseeing',
  FOOD: '🍜 Food',
  CULTURE: '🏛️ Culture',
  ADVENTURE: '⛰️ Adventure',
  NATURE: '🌿 Nature',
  SHOPPING: '🛍️ Shopping',
  ENTERTAINMENT: '🎭 Entertainment',
  HISTORY: '📜 History',
  TRANSPORT: '🚌 Transport',
  ACCOMMODATION: '🏨 Accommodation',
};

export default function Itinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addStopModal, setAddStopModal] = useState(false);
  const [addActModal, setAddActModal] = useState(null); // stopId
  const [shareModal, setShareModal] = useState(false);
  const [expandedStops, setExpandedStops] = useState({});

  // Add stop form
  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopDates, setStopDates] = useState({ startDate: '', endDate: '' });
  const [stopNotes, setStopNotes] = useState('');
  const [addingStop, setAddingStop] = useState(false);

  // Add activity form
  const [activities, setActivities] = useState([]);
  const [actSearch, setActSearch] = useState('');
  const [selectedAct, setSelectedAct] = useState(null);
  const [actDate, setActDate] = useState('');
  const [addingAct, setAddingAct] = useState(false);

  const loadTrip = () => {
    tripsApi.getTripById(id)
      .then(t => {
        setTrip(t);
        const expanded = {};
        t.stops?.forEach(s => { expanded[s.id] = true; });
        setExpandedStops(expanded);
      })
      .catch(e => { toast.error(e.message); navigate('/trips'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTrip(); }, [id]);

  // Search cities for add-stop modal
  useEffect(() => {
    if (!addStopModal) return;
    const timer = setTimeout(() => {
      citiesApi.searchCities(citySearch, '', 20)
        .then(setCities)
        .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch, addStopModal]);

  // Load activities when add-activity modal opens
  useEffect(() => {
    if (!addActModal) return;
    const stop = trip?.stops?.find(s => s.id === addActModal);
    if (!stop) return;
    citiesApi.getCityActivities(stop.cityId, '')
      .then(setActivities)
      .catch(console.error);
  }, [addActModal, trip]);

  const filteredActivities = activities.filter(a =>
    a.name.toLowerCase().includes(actSearch.toLowerCase())
  );

  const handleAddStop = async () => {
    if (!selectedCity) { toast.error('Please select a city'); return; }
    if (!stopDates.startDate || !stopDates.endDate) { toast.error('Please set start and end dates'); return; }
    if (stopDates.endDate < stopDates.startDate) { toast.error('End date must be after start date'); return; }
    setAddingStop(true);
    try {
      await stopsApi.addStop({
        tripId: Number(id),
        cityId: selectedCity.id,
        startDate: stopDates.startDate,
        endDate: stopDates.endDate,
        position: (trip?.stops?.length || 0),
        notes: stopNotes,
      });
      toast.success(`${selectedCity.name} added to your itinerary!`);
      setAddStopModal(false);
      setSelectedCity(null);
      setCitySearch('');
      setStopDates({ startDate: '', endDate: '' });
      setStopNotes('');
      loadTrip();
    } catch (e) {
      toast.error(e.message || 'Failed to add city');
    } finally {
      setAddingStop(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await stopsApi.deleteStop(stopId);
      toast.success('City removed from itinerary');
      loadTrip();
    } catch (e) {
      toast.error(e.message || 'Failed to remove city');
    }
  };

  const handleAddActivity = async () => {
    if (!selectedAct) { toast.error('Please select an activity'); return; }
    if (!actDate) { toast.error('Please choose a date for this activity'); return; }
    setAddingAct(true);
    try {
      await activitiesApi.addTripActivity({
        stopId: addActModal,
        activityId: selectedAct.id,
        date: actDate,
        position: 0,
      });
      toast.success(`${selectedAct.name} added!`);
      setAddActModal(null);
      setSelectedAct(null);
      setActSearch('');
      setActDate('');
      loadTrip();
    } catch (e) {
      toast.error(e.message || 'Failed to add activity');
    } finally {
      setAddingAct(false);
    }
  };

  const handleDeleteActivity = async (taId) => {
    try {
      await activitiesApi.deleteTripActivity(taId);
      toast.success('Activity removed');
      loadTrip();
    } catch (e) {
      toast.error(e.message || 'Failed to remove activity');
    }
  };

  const toggleStop = (stopId) =>
    setExpandedStops(prev => ({ ...prev, [stopId]: !prev[stopId] }));

  if (loading) {
    return (
      <Shell>
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', color: 'var(--ink-faint)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✈️</div>
            Loading your itinerary…
          </div>
        </div>
      </Shell>
    );
  }

  if (!trip) return null;

  // If the trip has a generated AI plan that hasn't been merged into stops yet
  if (trip.generatedPlan && !trip.generatedPlan.isAccepted) {
    return (
      <Shell>
        <div className="page" style={{ padding: '20px 0' }}>
          <GeneratedPlan trip={trip} />
        </div>
      </Shell>
    );
  }

  const nights = daysBetween(trip.startDate, trip.endDate);

  return (
    <Shell>
      <div className="page">
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')} style={{ marginBottom: '14px' }}>
            <ArrowLeft size={14} /> Back to Trips
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <span className="eyebrow">Itinerary Builder</span>
              <h1 style={{ margin: '4px 0 6px', fontSize: '27px', fontWeight: 800 }}>{trip.name}</h1>
              <div className="flex gap-12 items-center flex-wrap" style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                <span><Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{fmtDate(trip.startDate)} → {fmtDate(trip.endDate)} ({nights} nights)</span>
                <span><DollarSign size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Budget: {fmtMoney(trip.totalBudget)}</span>
                <span><MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{trip.stops?.length || 0} {trip.stops?.length === 1 ? 'City' : 'Cities'}</span>
              </div>
            </div>
            <div className="flex gap-8">
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/trips/${trip.id}/budget`)}>
                <BarChart2 size={14} /> Budget
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShareModal(true)}>
                <Share2 size={14} /> Share
              </button>
              <button className="btn btn-accent" onClick={() => setAddStopModal(true)}>
                <Plus size={15} /> Add City
              </button>
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        {trip.coverPhoto && (
          <div style={{ borderRadius: '18px', overflow: 'hidden', height: '200px', marginBottom: '24px' }}>
            <img src={trip.coverPhoto} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Empty State */}
        {(!trip.stops || trip.stops.length === 0) && (
          <div className="empty-state">
            <div className="icon-wrap"><MapPin size={26} /></div>
            <h3>No cities added yet</h3>
            <p>Start building your route by adding your first destination city.</p>
            <button className="btn btn-accent btn-lg" onClick={() => setAddStopModal(true)}>
              <Plus size={16} /> Add First City
            </button>
          </div>
        )}

        {/* City Stops */}
        <div>
          {trip.stops?.map((stop, idx) => (
            <React.Fragment key={stop.id}>
              {idx > 0 && (
                <div className="timeline-connector">
                  <div className="line" />
                  <span>✈️ Travel from {trip.stops[idx - 1].city?.name} → {stop.city?.name}</span>
                </div>
              )}

              <div className="city-block">
                <div className="city-block-head" style={{ flexWrap: 'wrap', gap: '10px' }}>
                  {stop.city?.imageUrl && (
                    <img src={stop.city.imageUrl} alt={stop.city?.name} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-8" style={{ marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--teal-600)' }}>
                        {cityCode(stop.city?.name)}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>{stop.city?.name}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>{stop.city?.country}</span>
                    </div>
                    <div className="flex gap-12 text-sm text-mute" style={{ flexWrap: 'wrap' }}>
                      <span>📅 {fmtDate(stop.startDate)} → {fmtDate(stop.endDate)}</span>
                      <span>🌙 {daysBetween(stop.startDate, stop.endDate)} nights</span>
                      <span>🎯 {stop.tripActivities?.length || 0} activities</span>
                    </div>
                    {stop.notes && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                        📝 {stop.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-6 items-start">
                    <button className="btn btn-soft btn-sm" onClick={() => toggleStop(stop.id)}>
                      {expandedStops[stop.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedStops[stop.id] ? 'Collapse' : 'Expand'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStop(stop.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {expandedStops[stop.id] && (
                  <div>
                    {/* Activities */}
                    {stop.tripActivities?.map(ta => (
                      <div key={ta.id} className="activity-row">
                        <div className="time">{ta.startTime ? ta.startTime.slice(11, 16) : '—'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{ta.activity?.name}</div>
                          <div className="flex gap-8 text-sm text-mute" style={{ marginTop: '2px' }}>
                            <span>{CATEGORY_LABELS[ta.activity?.category] || ta.activity?.category}</span>
                            <span>⏱ {ta.activity?.duration ? `${ta.activity.duration} min` : '—'}</span>
                            <span>💰 {fmtMoney(ta.customCost ?? ta.activity?.estimatedCost)}</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '5px 8px' }}
                          onClick={() => handleDeleteActivity(ta.id)}
                          title="Remove activity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    {(!stop.tripActivities || stop.tripActivities.length === 0) && (
                      <div style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                        No activities added yet for this stop.
                      </div>
                    )}

                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line-soft)' }}>
                      <button
                        className="btn btn-soft btn-sm"
                        onClick={() => {
                          setAddActModal(stop.id);
                          const firstDate = stop.startDate?.slice(0, 10) || '';
                          setActDate(firstDate);
                        }}
                      >
                        <Plus size={13} /> Add Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Add City Modal */}
        <Modal isOpen={addStopModal} onClose={() => setAddStopModal(false)} title="Add a City to Your Itinerary" maxWidth={520}>
          <div className="field">
            <label>Search City</label>
            <input
              className="input"
              placeholder="e.g. Tokyo, Bali, Jaipur…"
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '14px' }}>
            {cities.map(city => (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  if (!stopDates.startDate) setStopDates(d => ({
                    ...d,
                    startDate: trip.startDate?.slice(0, 10) || '',
                    endDate: trip.endDate?.slice(0, 10) || '',
                  }));
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: selectedCity?.id === city.id ? 'var(--teal-100)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '4px',
                  border: selectedCity?.id === city.id ? '1.5px solid var(--teal-400)' : '1.5px solid transparent',
                }}
              >
                {city.imageUrl && (
                  <img src={city.imageUrl} alt={city.name} style={{ width: '44px', height: '36px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{city.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>{city.country} · {city._count?.activities || 0} activities</div>
                </div>
              </div>
            ))}
          </div>

          {selectedCity && (
            <div className="card" style={{ padding: '14px', background: 'var(--mist-100)', marginBottom: '14px', border: '1px solid var(--teal-300)' }}>
              <div style={{ fontWeight: 800, marginBottom: '10px' }}>
                📍 {selectedCity.name}, {selectedCity.country}
              </div>
              <div className="grid grid-2" style={{ gap: '10px' }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Arrival Date *</label>
                  <input type="date" className="input" value={stopDates.startDate} onChange={e => setStopDates(d => ({ ...d, startDate: e.target.value }))} />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Departure Date *</label>
                  <input type="date" className="input" value={stopDates.endDate} min={stopDates.startDate} onChange={e => setStopDates(d => ({ ...d, endDate: e.target.value }))} />
                </div>
              </div>
              <div className="field" style={{ marginTop: '10px', marginBottom: 0 }}>
                <label>Notes (optional)</label>
                <input className="input" placeholder="e.g. Stay near Shinjuku station" value={stopNotes} onChange={e => setStopNotes(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex gap-10">
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddStopModal(false)}>Cancel</button>
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleAddStop} disabled={addingStop || !selectedCity}>
              <Plus size={14} /> {addingStop ? 'Adding…' : 'Add City'}
            </button>
          </div>
        </Modal>

        {/* Add Activity Modal */}
        <Modal isOpen={!!addActModal} onClose={() => { setAddActModal(null); setSelectedAct(null); setActSearch(''); }} title="Add Activity to Stop" maxWidth={520}>
          <div className="field">
            <label>Date for this Activity *</label>
            <input type="date" className="input" value={actDate} onChange={e => setActDate(e.target.value)} />
          </div>

          <div className="field">
            <label>Search Activities</label>
            <input
              className="input"
              placeholder="Filter by name…"
              value={actSearch}
              onChange={e => setActSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '14px' }}>
            {filteredActivities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-faint)', fontSize: '13px' }}>
                No activities found for this city
              </div>
            ) : (
              filteredActivities.map(act => (
                <div
                  key={act.id}
                  onClick={() => setSelectedAct(act)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: selectedAct?.id === act.id ? 'var(--teal-100)' : 'transparent',
                    border: selectedAct?.id === act.id ? '1.5px solid var(--teal-400)' : '1.5px solid transparent',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '3px' }}>{act.name}</div>
                  <div className="flex gap-8 text-sm text-mute">
                    <span>{CATEGORY_LABELS[act.category] || act.category}</span>
                    {act.duration && <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {act.duration} min</span>}
                    <span>{fmtMoney(act.estimatedCost)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-10">
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddActModal(null)}>Cancel</button>
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleAddActivity} disabled={addingAct || !selectedAct}>
              <Plus size={14} /> {addingAct ? 'Adding…' : 'Add Activity'}
            </button>
          </div>
        </Modal>

        {/* Share Modal */}
        <ShareModal trip={trip} isOpen={shareModal} onClose={() => setShareModal(false)} onUpdated={loadTrip} />
      </div>
    </Shell>
  );
}
