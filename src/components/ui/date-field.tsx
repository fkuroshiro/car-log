import { TextField } from './text-field';

export interface DateFieldProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}

/**
 * Native fallback: a plain YYYY-MM-DD text input. Metro picks
 * date-field.web.tsx on web, which renders a real calendar picker.
 * (A native date-picker module can replace this when mobile ships.)
 */
export function DateField(props: DateFieldProps) {
  return (
    <TextField
      placeholder="YYYY-MM-DD"
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  );
}
