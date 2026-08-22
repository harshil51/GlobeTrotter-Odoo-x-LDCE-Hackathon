import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Compass, Filter, Plus } from 'lucide-react';
import { citiesApi } from '../api/cities.api';
import { fmtMoney, cityCode } from '../utils/format';
import Shell from '../components/layout/Shell';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const CATEGORIES = ['All', 'SIGHTSEEING', 'FOOD', 'CULTURE', 'ADVENTURE', 'NATURE', 'SHOPPING', 'ENTERTAINMENT', 'HISTORY'];
const CATEGORY_LABEL = { All: 'All', SIGHTSEEING: '🗺️ Sightseeing', FOOD: '🍜 Food', CULTURE: '🏛️ Culture', ADVENTURE: '⛰️ Adventure', NATURE: '🌿 Nature', SHOPPING: '🛍️ Shopping', ENTERTAINMENT: '🎭 Entertainment', HISTORY: '📜 History' };

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('cities');
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [cityQuery, setCityQuery] = useState(searchParams.get('q') || '');
  const [actQuery, setActQuery] = useState(searchParams.get('q') || '');
  const [actCategory, setActCategory] = useState('All');
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingActs, setLoadingActs] = useState(false);

  // Load cities
  useEffect(() => {
    setLoadingCities(true);
    citiesApi.searchCities(cityQuery, '', 50)
      .then(setCities)
      .catch(console.error)
      .finally(() => setLoadingCities(false));
  }, [cityQuery]);

  // Load activities
  useEffect(() => {
    if (tab !== 'activities') return;
    setLoadingActs(true);
    citiesApi.getAllActivities(actQuery, actCategory === 'All' ? '' : actCategory, 200)
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoadingActs(false));
  }, [actQuery, actCategory, tab]);

  return (
    <Shell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Destination Discovery</span>
            <h1>Explore Destinations</h1>
            <p>Browse {cities.length} cities and hundreds of curated activities from our database</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${tab === 'cities' ? 'active' : ''}`} onClick={() => setTab('cities')}>🌍 Cities ({cities.length})</div>
          <div className={`tab ${tab === 'activities' ? 'active' : ''}`} onClick={() => setTab('activities')}>🎯 Activities</div>
        </div>

        {/* Cities Tab */}
        {tab === 'cities' && (
          <>
            <div className="field" style={{ maxWidth: '400px', marginBottom: '22px' }}>
              <div className="input-wrap">
                <input
                  className="input"
                  placeholder="Search city, country, region…"
                  value={cityQuery}
                  onChange={e => setCityQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }}>
                  <Search size={15} />
                </span>
              </div>
            </div>

            {loadingCities ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-faint)' }}>Loading cities…</div>
            ) : cities.length === 0 ? (
              <div className="empty-state">
                <div className="icon-wrap"><Compass size={26} /></div>
                <h3>No cities found</h3>
                <p>Try a different search term</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <div className="grid grid-2">
                    {cities.map(city => (
                      <div
                        key={city.id}
                        className="dest-card card-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/explore?city=${city.id}`)}
                      >
                        <div className="img-wrap">
                          <img
                            src={city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                            alt={city.name}
                          />
                          <div
                            style={{
                              position: 'absolute', top: '10px', right: '10px',
                              background: 'rgba(255,255,255,.9)',
                              borderRadius: '7px',
                              padding: '3px 7px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 800,
                              color: 'var(--navy-900)',
                            }}
                          >
                            {cityCode(city.name)}
                          </div>
                        </div>
                        <div className="body">
                          <h4>{city.name}</h4>
                          <div className="country">{city.country} · {city.region}</div>
                          <div className="row">
                            <div className="flex gap-6">
                              <span className="badge badge-teal">{city._count?.activities || 0} activities</span>
                              {city.costIndex && (
                                <span className="badge badge-coral" title="Cost Index (higher = more expensive)">
                                  💲{Number(city.costIndex).toFixed(1)}
                                </span>
                              )}
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-faint)', fontWeight: 700 }}>
                              ⭐ {city.popularity}
                            </span>
                          </div>
                          {city.description && (
                            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '8px', marginBottom: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {city.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Map View */}
                <div style={{ flex: 1, minHeight: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line-soft)', position: 'sticky', top: '80px', height: 'calc(100vh - 120px)' }}>
                  <MapContainer center={[35, 10]} zoom={2} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    {cities.map(city => city.latitude && city.longitude ? (
                      <Marker key={city.id} position={[city.latitude, city.longitude]}>
                        <Popup>
                          <strong>{city.name}</strong><br/>
                          {city.country}
                        </Popup>
                      </Marker>
                    ) : null)}
                  </MapContainer>
                </div>
              </div>
            )}
          </>
        )}

        {/* Activities Tab */}
        {tab === 'activities' && (
          <>
            <div className="flex gap-12 items-center" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="input-wrap" style={{ flex: 1, minWidth: '220px', maxWidth: '360px' }}>
                <input
                  className="input"
                  placeholder="Search activities…"
                  value={actQuery}
                  onChange={e => setActQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }}>
                  <Search size={15} />
                </span>
              </div>
              <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <span
                    key={cat}
                    className={`chip ${actCategory === cat ? 'active' : ''}`}
                    onClick={() => setActCategory(cat)}
                    style={{ fontSize: '12px', padding: '6px 11px' }}
                  >
                    {CATEGORY_LABEL[cat]}
                  </span>
                ))}
              </div>
            </div>

            {loadingActs ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-faint)' }}>Loading activities…</div>
            ) : activities.length === 0 ? (
              <div className="empty-state">
                <div className="icon-wrap"><Filter size={26} /></div>
                <h3>No activities found</h3>
                <p>Try a different search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-4">
                {activities.map(act => (
                  <div key={act.id} className="act-card card-hover">
                    <div className="img-wrap">
                      <img
                        src={act.imageUrl || act.city?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                        alt={act.name}
                      />
                    </div>
                    <div className="body">
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>{act.name}</div>
                        <div className="flex gap-6 items-center" style={{ marginBottom: '6px' }}>
                          <span className="badge badge-teal" style={{ fontSize: '10.5px' }}>{CATEGORY_LABEL[act.category]}</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--ink-faint)' }}>📍 {act.city?.name}</span>
                        </div>
                        {act.description && (
                          <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: '0 0 8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {act.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', color: 'var(--navy-900)' }}>
                          {fmtMoney(act.estimatedCost)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                          {act.duration ? `⏱ ${act.duration} min` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}
