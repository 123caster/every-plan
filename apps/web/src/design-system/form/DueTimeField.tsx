import { Field } from '../primitives/Field';

export function DueTimeField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Field label="截止时间" type="datetime-local" value={value} onChange={(event) => onChange(event.target.value)} />;
}
