import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function MockPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  if (!state?.event) { navigate('/events'); return null; }
  const { event, seats } = state;
  const total = event.price * seats;

  const handlePay = async (e) => {
    e.preventDefault();
    if (card.number.replace(/\s/g, '').length !== 16) { toast.error('Enter a valid 16-digit card number'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000)); // simulate processing
    try {
      await API.post('/bookings/create', { eventId: event._id, seats });
      navigate('/payment-success', { state: { event, seats, total } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => val.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2');

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>Complete Payment</h1>

        {/* Order summary */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 500 }}>ORDER SUMMARY</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{event.title}</span>
            <span>{seats} × ₹{event.price.toLocaleString()}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '17px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Card form */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['VISA', 'MC', 'AMEX'].map(b => (
              <div key={b} style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{b}</div>
            ))}
          </div>

          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lbl}>Name on card</label>
              <input className="input-field" placeholder="John Doe" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} required />
            </div>
            <div>
              <label style={lbl}>Card number</label>
              <input className="input-field" placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Expiry</label>
                <input className="input-field" placeholder="MM/YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} required />
              </div>
              <div>
                <label style={lbl}>CVV</label>
                <input className="input-field" type="password" placeholder="•••" maxLength={3} value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} required />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '4px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Processing...
                </span>
              ) : `Pay ₹${total.toLocaleString()}`}
            </button>

            {/* <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              🔒 This is a demo payment — no real charge
            </p> */}
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' };