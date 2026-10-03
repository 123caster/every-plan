import { Field } from '../primitives/Field';

export function PlanTimeField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Field label="计划时间" type="datetime-local" value={value} onChange={(event) => onChange(event.target.value)} />;
}
