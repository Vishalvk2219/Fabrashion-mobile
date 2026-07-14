/** Compact relative timestamp for back-office lists: "just now", "10 min ago", "Yesterday"… */
export function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  const mins = Math.floor((Date.now() - then) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Time-of-day greeting for the staff dashboard. */
export function greetingFor(name: string, at: Date = new Date()): string {
  const h = at.getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${part}, ${name}`;
}

/** Trial slot window in IST, e.g. `"11 am – 1 pm"`. */
export function formatSlot(startIso: string, endIso: string): string {
  const fmt = (iso: string) =>
    new Date(iso)
      .toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' })
      .replace(/\s/g, ' ');
  return `${fmt(startIso)} – ${fmt(endIso)}`;
}

/** Day chip for a `YYYY-MM-DD` slot date, e.g. `{ label: "Thu", day: "9" }`. */
export function formatDayChip(date: string): { label: string; day: string } {
  const d = new Date(`${date}T00:00:00Z`);
  return {
    label: d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' }),
    day: String(d.getUTCDate()),
  };
}
