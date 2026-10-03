import { Field } from '../primitives/Field';

export function DurationField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Field label="预计时长（分钟）" type="number" min="1" step="5" value={value} onChange={(event) => onChange(event.target.value)} />;
}
