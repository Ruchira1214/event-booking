import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const statusColor = { confirmed: 'var(--success)', cancelled: 'var(--danger)' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch { toast.error('Failed to load bookings'); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await API.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetch();
    } catch { toast.error('Could not cancel'); }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '760px' }}>
        <h1 className="page-title">My Bookings</h1>

        {loading ? <p>Loading...</p> : bookings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px' }}>🎟️</div>
            <p>No bookings yet. Go explore events!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bookings.map(b => (
              <div key={b._id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{b.event?.title || 'Event deleted'}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: statusColor[b.status], background: b.status === 'confirmed' ? '#dcfce7' : '#fee2e2', padding: '2px 8px', borderRadius: '10px' }}>
                      {b.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>📅 {b.event ? new Date(b.event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                    <span>💺 {b.seats} seat{b.seats > 1 ? 's' : ''}</span>
                    <span>💰 ₹{b.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                {b.status === 'confirmed' && b.event && new Date(b.event.date) > new Date() && (
                  <button className="btn btn-danger" style={{ fontSize: '13px', padding: '7px 16px' }} onClick={() => cancel(b._id)}>
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}