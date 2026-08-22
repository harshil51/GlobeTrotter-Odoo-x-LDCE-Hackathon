import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, Calendar as CalIcon, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Shell from '../components/layout/Shell';
import { fmtMoney, fmtDate } from '../utils/format';

export default function GeneratedPlan({ trip }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  let itinerary = null;
  try {
    if (trip.generatedPlan?.content) {
      itinerary = JSON.parse(trip.generatedPlan.content);
    }
  } catch (e) {
    console.error('Failed to parse generated plan', e);
  }

  if (!itinerary) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>No AI Itinerary Available</h3>
        <p>This trip was created without the AI engine.</p>
        <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back to Trips</button>
      </div>
    );
  }

  const handleAccept = () => {
    // In a full implementation, this would convert the AI JSON into DB Stops and TripActivities
    alert('In a full implementation, this would convert the AI JSON into your database Stops and Activities.');
    navigate('/dashboard');
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')} style={{ marginBottom: '14px', marginLeft: '-10px' }}>
            <ArrowLeft size={14} /> Back to Trips
          </button>
          <div className="flex items-center gap-10">
            <Sparkles size={24} style={{ color: 'var(--coral-500)' }} />
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>AI Generated Itinerary</h1>
          </div>
          <p className="text-mute" style={{ marginTop: '8px' }}>Optimized based on geography and your preferences</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--ink-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Cost</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)' }}>
            {fmtMoney(itinerary.estimatedTotalCost || trip.totalBudget)}
          </div>
        </div>
      </div>

      {/* Insights */}
      {itinerary.tripInsights && itinerary.tripInsights.length > 0 && (
        <div className="card" style={{ padding: '20px', background: 'var(--ocean-50)', border: '1px solid var(--ocean-200)', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--ocean-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Trip Insights
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--ocean-900)', fontSize: '14px', lineHeight: 1.6 }}>
            {itinerary.tripInsights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily Plan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {itinerary.dailyPlan?.map(day => (
          <div key={day.day} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: 'var(--navy-900)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>Day {day.day} - {day.city}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{fmtDate(day.date)}</div>
            </div>
            
            <div style={{ padding: '20px' }}>
              {['morning', 'afternoon', 'evening'].map(timeOfDay => (
                day[timeOfDay] && day[timeOfDay].length > 0 && (
                  <div key={timeOfDay} style={{ marginBottom: timeOfDay !== 'evening' ? '24px' : '0' }}>
                    <h4 style={{ margin: '0 0 12px 0', textTransform: 'capitalize', color: 'var(--teal-600)', fontSize: '15px', borderBottom: '1px solid var(--line-soft)', paddingBottom: '6px' }}>{timeOfDay}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {day[timeOfDay].map((act, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{ width: '60px', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--ink-soft)', marginTop: '2px' }}>
                            {act.time}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>{act.name}</div>
                            {act.notes && <div style={{ fontSize: '13px', color: 'var(--ink-faint)', marginTop: '4px' }}>{act.notes}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/trips')}>Save for Later</button>
        <button className="btn btn-primary btn-lg" onClick={handleAccept}>
          <Sparkles size={18} /> Accept This Itinerary
        </button>
      </div>
    </div>
  );
}
