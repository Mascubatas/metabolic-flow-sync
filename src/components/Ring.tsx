interface RingProps {
  value: number;
  max: number;
  label: string;
  sub?: string;
  color?: string;
  size?: number;
}

export function Ring({ value, max, label, sub, color = "var(--primary)", size = 108 }: RingProps) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={9}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold leading-none">{Math.round(value)}</span>
          <span className="text-[10px] text-muted-foreground">/ {Math.round(max)}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
        {sub ? <div className="text-[11px] text-muted-foreground">{sub}</div> : null}
      </div>
    </div>
  );
}
