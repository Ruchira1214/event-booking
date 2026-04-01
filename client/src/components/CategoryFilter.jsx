const CATEGORIES = ['All', 'Concerts & Music', 'Tech Conferences', 'Sports', 'Workshops & Learning'];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            border: '1.5px solid',
            borderColor: selected === cat ? 'var(--primary)' : 'var(--border)',
            background: selected === cat ? 'var(--primary)' : 'transparent',
            color: selected === cat ? '#fff' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}