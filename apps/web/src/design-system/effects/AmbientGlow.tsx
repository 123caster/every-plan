interface AmbientGlowProps {
  enabled?: boolean;
}

export function AmbientGlow({ enabled = true }: AmbientGlowProps) {
  if (!enabled) return null;
  return <div className="ambient-glow" aria-hidden="true" data-testid="ambient-glow" />;
}

