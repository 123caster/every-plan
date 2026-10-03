interface SegmentedControlProps<Value extends string> {
  label: string;
  value: Value;
  options: Array<{ value: Value; label: string }>;
  onChange: (value: Value) => void;
}

export function SegmentedControl<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<Value>) {
  return (
    <fieldset className="segmented-control">
      <legend>{label}</legend>
      <div className="segmented-control__items">
        {options.map((option) => (
          <button
            type="button"
            aria-pressed={option.value === value}
            className="segmented-control__item"
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

