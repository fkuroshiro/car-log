/** Must stay in sync with the check constraint in the service_records table. */
export const SERVICE_CATEGORIES = [
  { value: 'service', label: 'Service' },
  { value: 'oil_change', label: 'Oil change' },
  { value: 'tires', label: 'Tires' },
  { value: 'brakes', label: 'Brakes' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'repair', label: 'Repair' },
  { value: 'other', label: 'Other' },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]['value'];

export function categoryLabel(value: string): string {
  return (
    SERVICE_CATEGORIES.find((category) => category.value === value)?.label ??
    value
  );
}
