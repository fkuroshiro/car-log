import { i18next } from '@/i18n';

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** 132500 -> "132 500 km" (the thin-space grouping is locale-neutral). */
export function formatKm(km: number): string {
  return `${km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km`;
}

/**
 * "2026-03-12" -> "12 Mar 2026" (en) / "12. 3. 2026" (cs).
 * Hand-rolled instead of toLocaleDateString so the output is deterministic:
 * the static pre-render (always English) must match the first client render.
 */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  if (i18next.language === 'cs') {
    return `${day}. ${month}. ${year}`;
  }
  return `${day} ${MONTHS_EN[month - 1]} ${year}`;
}

/** Today as YYYY-MM-DD in local time. */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
