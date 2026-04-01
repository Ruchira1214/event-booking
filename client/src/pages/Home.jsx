import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-block',
            // background: 'var(--primary-light)',
            color: 'var(--primary)',
            // padding: '6px 16px',
            // borderRadius: '20px',
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            Discover · Book · Attend
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
            Find events that<br />
            <span style={{ color: 'var(--primary)' }}>excite you</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Concerts, tech conferences, sports, workshops — book tickets in seconds and never miss what matters.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {[
              { value: '500+', label: 'Events Listed' },
              { value: '4', label: 'Categories' },
              { value: '10k+', label: 'Tickets Booked' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}