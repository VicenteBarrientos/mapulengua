type StatBadgeProps = {
  icon: React.ReactNode;
  value: number | string;
  label?: string;
  variant?: "default" | "xp" | "streak" | "hearts";
};

const variantStyles = {
  default: "bg-sand text-earth",
  xp: "bg-gold/20 text-earth",
  streak: "bg-terracotta/15 text-terracotta-dark",
  hearts: "bg-coral/10 text-coral",
};

export function StatBadge({ icon, value, label, variant = "default" }: StatBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${variantStyles[variant]}`}
      title={label}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

export function HeartsDisplay({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${hearts} de ${maxHearts} vidas`}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span
          key={i}
          className={`text-lg transition-opacity ${i < hearts ? "opacity-100" : "opacity-25 grayscale"}`}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

export function XpBar({ xp, goal = 100 }: { xp: number; goal?: number }) {
  const progress = Math.min(100, (xp % goal) / goal * 100);
  const level = Math.floor(xp / goal) + 1;

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-earth-muted">
        <span>Nivel {level}</span>
        <span>{xp % goal}/{goal} XP</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  completed,
  total,
  size = 48,
}: {
  completed: number;
  total: number;
  size?: number;
}) {
  const pct = total > 0 ? completed / total : 0;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-sand)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 origin-center fill-earth text-xs font-bold"
        style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {completed}/{total}
      </text>
    </svg>
  );
}
