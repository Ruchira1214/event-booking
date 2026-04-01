import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Concerts & Music', 'Tech Conferences', 'Sports', 'Workshops & Learning'];

const empty = { title: '', description: '', category: 'Concerts & Music', date: '', location: '', price: '', totalSeats: '', image: '', isActive: true };

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    API.get(`/events/${id}`)
      .then(({ data }) => {
        setForm({
          ...data,
          date: new Date(data.date).toISOString().slice(0, 16),
          price: data.price.toString(),
          totalSeats: data.totalSeats.toString(),
        });
      })
      .catch(() => toast.error('Failed to load event'))
      .finally(() => setFetching(false));
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location || !form.price || !form.totalSeats) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), totalSeats: Number(form.totalSeats) };
      if (isEdit) {
        await API.put(`/events/${id}`, payload);
        toast.success('Event updated!');
      } else {
        await API.post('/events', payload);
        toast.success('Event created!');
      }
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
    setLoading(false);
  };

  if (fetching) return <div className="page-wrapper"><div className="container">Loading...</div></div>;

  const lbl = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' };
  const required = <span style={{ color: 'var(--danger)' }}>*</span>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <Link to="/admin/events" style={{ color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1 }}>←</Link>
          <h1 className="page-title" style={{ margin: 0 }}>{isEdit ? 'Edit Event' : 'Create Event'}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Title */}
            <div>
              <label style={lbl}>Event Title {required}</label>
              <input className="input-field" placeholder="e.g. React Summit 2025" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            {/* Description */}
            <div>
              <label style={lbl}>Description {required}</label>
              <textarea
                className="input-field"
                placeholder="Describe your event..."
                rows={4}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            {/* Category + Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}>Category {required}</label>
                <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Date & Time {required}</label>
                <input className="input-field" type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} required />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={lbl}>Location {required}</label>
              <input className="input-field" placeholder="e.g. Hyderabad International Convention Centre" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>

            {/* Price + Seats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}>Price (₹) {required}</label>
                <input className="input-field" type="number" placeholder="499" min="0" value={form.price} onChange={e => set('price', e.target.value)} required />
              </div>
              <div>
                <label style={lbl}>Total Seats {required}</label>
                <input className="input-field" type="number" placeholder="200" min="1" value={form.totalSeats} onChange={e => set('totalSeats', e.target.value)} required />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label style={lbl}>Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input className="input-field" placeholder="https://..." value={form.image} onChange={e => set('image', e.target.value)} />
              {form.image && (
                <div style={{ marginTop: '10px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '120px' }}>
                  <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '12px' }}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
              </button>
              <Link to="/admin/events" className="btn btn-outline" style={{ padding: '12px 20px' }}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}