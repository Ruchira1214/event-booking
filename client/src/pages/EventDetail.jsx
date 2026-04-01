import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingDeadline from '../components/CountdownTimer';
import toast from 'react-hot-toast';

const categoryBadge = {
  'Concerts & Music': 'badge-music',
  'Tech Conferences': 'badge-tech',
  'Sports': 'badge-sports',
  'Workshops & Learning': 'badge-workshop',
};

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then(({ data }) => setEvent(data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/mock-payment', { state: { event, seats } });
  };

  if (loading) return <div className="page-wrapper"><div className="container">Loading...</div></div>;
  if (!event) return null;

  const available = event.totalSeats - event.bookedSeats;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Image */}
          <div style={{
            height: '240px',
            background: event.image
              ? `url(${event.image}) center/cover`
              : 'linear-gradient(135deg, var(--primary-light), var(--border))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {!event.image && <span style={{ fontSize: '64px', opacity: 0.3 }}>
              {event.category === 'Concerts & Music' ? '🎵' :
               event.category === 'Tech Conferences' ? '💻' :
               event.category === 'Sports' ? '⚽' : '📚'}
            </span>}
          </div>

          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <span className={`badge ${categoryBadge[event.category]}`}>{event.category}</span>
              <BookingDeadline eventDate={event.date} />
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '16px' }}>{event.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { icon: '📅', label: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: '🕐', label: new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                { icon: '📍', label: event.location },
                { icon: '💺', label: `${available} seats left` },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{event.description}</p>

            {/* Booking section */}
            {available > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Seats:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => setSeats(s => Math.max(1, s - 1))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '18px' }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>{seats}</span>
                    <button onClick={() => setSeats(s => Math.min(available, s + 1))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: '18px' }}>+</button>
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{(event.price * seats).toLocaleString()}
                </div>
                <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }} onClick={handleBook}>
                  Proceed to Pay
                </button>
              </div>
            ) : (
              <div style={{ padding: '16px', background: 'var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-muted)' }}>
                This event is sold out
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}