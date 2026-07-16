import { i18next } from '@/i18n';

/** Must stay in sync with the check constraint in the service_records table. */
export const SERVICE_CATEGORIES = [
  'service',
  'oil_change',
  'tires',
  'brakes',
  'inspection',
  'repair',
  'other',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export function categoryLabel(value: string): string {
  return i18next.t(`categories.${value}`, { defaultValue: value });
}
