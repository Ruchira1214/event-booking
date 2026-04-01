import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/events');
        setEvents(data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const total = events.length;
  const active = events.filter(e => e.isActive).length;
  const inactive = events.filter(e => !e.isActive).length;
  const soldOut = events.filter(e => e.bookedSeats >= e.totalSeats).length;

  const statCards = [
    { label: 'Total Events', value: total },
    { label: 'Active', value: active },
    { label: 'Inactive', value: inactive },
    { label: 'Sold Out', value: soldOut },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Manage your events and bookings
          </p>
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {statCards.map(({ label, value }) => (
            <div key={label} className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>
                {loading ? '—' : value}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Manage Events', desc: 'Edit, delete, toggle availability', to: '/admin/events' },
            { label: 'Create Event', desc: 'Add a new event to the platform', to: '/admin/events/new' },
          ].map(({ label, desc, to }) => (
            <Link
              key={label}
              to={to}
              className="card"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{desc}</div>
            </Link>
          ))}
        </div>

        {/* Recent events table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Events</h2>
            <Link to="/admin/events" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
              View all
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : events.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No events yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Event', 'Date', 'Category', 'Seats Left', 'Price', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 5).map((e, i) => (
                    <tr key={e._id} style={{
                      borderTop: '1px solid var(--border)',
                      background: i % 2 === 0 ? 'transparent' : 'var(--bg)',
                    }}>
                      <td style={{
                        padding: '12px 16px', fontWeight: 500,
                        maxWidth: '200px', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {e.title}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {e.category.split(' ')[0]}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {e.totalSeats - e.bookedSeats}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 600 }}>
                        ₹{e.price.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 700,
                          // padding: '3px 10px', borderRadius: '10px',
                          // background: e.isActive ? '#dcfce7' : '#fee2e2',
                          color: e.isActive ? '#15803d' : '#dc2626',
                          // border: `1px solid ${e.isActive ? '#86efac' : '#fca5a5'}`,
                        }}>
                          {e.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}