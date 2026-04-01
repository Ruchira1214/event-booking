import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const categoryBadge = {
  'Concerts & Music': 'badge-music',
  'Tech Conferences': 'badge-tech',
  'Sports': 'badge-sports',
  'Workshops & Learning': 'badge-workshop',
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (event) => {
    try {
      await API.put(`/events/${event._id}`, { ...event, isActive: !event.isActive });
      toast.success(`Event ${event.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success('Event deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>Manage Events</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{events.length} events total</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin" className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 16px' }}>← Dashboard</Link>
            <Link to="/admin/events/new" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>+ New Event</Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px' }}>🎪</div>
            <p>No events yet. Create your first one!</p>
            <Link to="/admin/events/new" className="btn btn-primary" style={{ marginTop: '16px' }}>Create Event</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map(event => {
              const available = event.totalSeats - event.bookedSeats;
              return (
                <div key={event._id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Left: info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{event.title}</span>
                      <span className={`badge ${categoryBadge[event.category]}`} style={{ fontSize: '11px' }}>{event.category}</span>
                      <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px',
                        background: event.isActive ? '#dcfce7' : '#fee2e2',
                        color: event.isActive ? '#15803d' : '#dc2626',
                      }}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>📍 {event.location}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{event.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActive(event)}
                      style={{
                        padding: '7px 14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)',
                        background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      {event.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <Link to={`/admin/events/edit/${event._id}`} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: '13px' }}>
                      Edit
                    </Link>
                    <button className="btn btn-danger" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => deleteEvent(event._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}