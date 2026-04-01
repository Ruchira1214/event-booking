import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data);
        await API.patch('/notifications/mark-read');
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Notifications</h1>
          {notifications.length > 0 && (
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>
              {notifications.length}
            </span>
          )}
        </div>

        {loading ? <p>Loading...</p> : notifications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px' }}>🔔</div>
            <p>No notifications yet. Book an event to get reminders!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map(n => (
              <div key={n._id} className="card" style={{
                padding: '16px 20px',
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                borderLeft: `3px solid ${n.isRead ? 'var(--border)' : 'var(--primary)'}`,
                borderRadius: 'var(--radius)',
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                  🔔
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.5, marginBottom: '4px' }}>{n.message}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}