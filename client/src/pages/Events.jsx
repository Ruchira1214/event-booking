import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await API.get('/events', { params });
        setEvents(data);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>All Events</h1>
          <input
            className="input-field"
            style={{ maxWidth: '280px' }}
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <CategoryFilter selected={category} onChange={setCategory} />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ height: '380px', background: 'var(--border)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px' }}>🔍</div>
            <p>No events found. Try a different category or search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
}