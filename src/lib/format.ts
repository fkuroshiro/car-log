const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** 132500 -> "132 500 km" */
export function formatKm(km: number): string {
  return `${km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km`;
}

/**
 * "2026-03-12" -> "12 Mar 2026". Deliberately locale-independent: the server
 * pre-render and the browser must produce identical text, or React warns
 * about a hydration mismatch.
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** Today as YYYY-MM-DD in local time. */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
