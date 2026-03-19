interface Props {
  value: string;
  onChange: (value: "gcash" | "paymaya" | "card") => void;
}

const GCashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
    <rect width="24" height="24" rx="4" fill="oklch(0.55 0.25 145)" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="white"
      fontSize="9"
      fontWeight="bold"
    >
      G
    </text>
  </svg>
);

const MayaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
    <rect width="24" height="24" rx="4" fill="oklch(0.55 0.22 245)" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="white"
      fontSize="8"
      fontWeight="bold"
    >
      M
    </text>
  </svg>
);

const CardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <rect
      x="5"
      y="14"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const methods = [
  { Icon: GCashIcon, desc: "e-wallet", id: "gcash" as const, label: "GCash" },
  { Icon: MayaIcon, desc: "e-wallet", id: "paymaya" as const, label: "Maya" },
  {
    Icon: CardIcon,
    desc: "debit / credit",
    id: "card" as const,
    label: "Card",
  },
];

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {methods.map(({ id, label, Icon, desc }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={[
            "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all duration-150",
            value === id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground",
          ].join(" ")}
        >
          <Icon />
          <span className="text-xs font-semibold">{label}</span>
          <span className="text-[10px] text-muted-foreground">{desc}</span>
        </button>
      ))}
    </div>
  );
}
