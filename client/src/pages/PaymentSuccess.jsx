import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const { state } = useLocation();
  if (!state) return <div className="page-wrapper"><div className="container">No booking data.</div></div>;
  const { event, seats, total } = state;

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✓</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Your tickets are booked successfully.</p>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
          {[
            { label: 'Event', value: event.title },
            { label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'Seats', value: seats },
            { label: 'Amount Paid', value: `₹${total.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/my-bookings" className="btn btn-primary" style={{ flex: 1 }}>My Bookings</Link>
          <Link to="/events" className="btn btn-outline" style={{ flex: 1 }}>More Events</Link>
        </div>
      </div>
    </div>
  );
}