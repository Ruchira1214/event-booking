import { Link } from 'react-router-dom';
import BookingDeadline from './CountdownTimer';

const categoryBadge = {
  'Concerts & Music': 'badge-music',
  'Tech Conferences': 'badge-tech',
  'Sports': 'badge-sports',
  'Workshops & Learning': 'badge-workshop',
};

export default function EventCard({ event }) {
  const available = event.totalSeats - event.bookedSeats;
  const isSoldOut = available === 0;

  return (
    <div className="card" style={{
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex', flexDirection: 'column',
    }}
      // onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      // onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      {/* Image */}
      <div style={{
        height: '160px',
        background: event.image
          ? `url(${event.image}) center/cover no-repeat`
          : 'linear-gradient(135deg, var(--primary-light), var(--border))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {!event.image && (
          <span style={{ fontSize: '40px', opacity: 0.4 }}>
            {event.category === 'Concerts & Music' ? '🎵' :
             event.category === 'Tech Conferences' ? '💻' :
             event.category === 'Sports' ? '⚽' : '📚'}
          </span>
        )}
        {isSoldOut && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '1px' }}>SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className={`badge ${categoryBadge[event.category] || 'badge-music'}`}>
            {event.category}
          </span>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--primary)' }}>
            ₹{event.price.toLocaleString()}
          </span>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.3 }}>{event.title}</h3>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>📍 {event.location}</span>
          <span>💺 {available} seats left</span>
          <BookingDeadline eventDate={event.date} />
        </div>

        <Link to={`/events/${event._id}`} className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
          {isSoldOut ? 'View Details' : 'Book Now'}
        </Link>
      </div>
    </div>
  );
}