interface TaskCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export function TaskCheckbox({ checked, label, onChange }: TaskCheckboxProps) {
  return (
    <button
      type="button"
      className="task-checkbox"
      aria-label={`${checked ? '重新打开' : '完成'}：${label}`}
      aria-pressed={checked}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
    >
      <span aria-hidden="true">{checked ? '✓' : ''}</span>
    </button>
  );
}
