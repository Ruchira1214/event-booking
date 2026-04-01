export default function BookingDeadline({ eventDate }) {
  const now = new Date();
  const event = new Date(eventDate);
  const diffDays = Math.ceil((event - now) / (1000 * 60 * 60 * 24));

  const lastBookingDate = new Date(event);
  lastBookingDate.setDate(event.getDate() - 7);

  const formattedLastDay = lastBookingDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (diffDays <= 0) return (
    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
      Event has passed
    </span>
  );

  return (
    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
      Book by {formattedLastDay}
    </span>
  );
}