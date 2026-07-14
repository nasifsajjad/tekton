/**
 * Hand-drawn line-icon set for the product category cards. Inline SVG —
 * zero network requests, zero layout shift, scales crisp at any size, and
 * inherits `currentColor` so it always matches surrounding text. The single
 * filled accent per icon uses the brand forge yellow.
 */

type IconProps = { className?: string };

const shared = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function ElectricalIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="6" y="6" width="36" height="36" rx="4" />
      <path
        className="fill-forge"
        stroke="none"
        d="M27 12 15 27h8l-2 9 12-15h-8l2-9z"
      />
    </svg>
  );
}

function GeneratorsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="6" y="14" width="30" height="18" rx="3" />
      <path d="M17 14V8h4v6" />
      <path d="M11 20h3M16 20h3M11 25h3M16 25h3" />
      <circle className="fill-forge" stroke="none" cx="29" cy="23" r="2" />
    </svg>
  );
}

function ItPrintingIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="7" y="8" width="30" height="20" rx="2" />
      <path d="M15 34h18M24 28v6" />
      <path d="M15 15h18" />
      <circle className="fill-forge" stroke="none" cx="32" cy="21" r="1.75" />
    </svg>
  );
}

function HydraulicsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="6" y="19" width="20" height="10" rx="2" />
      <path d="M12 19v-4M18 19v-4" />
      <path d="M26 24h8" />
      <rect className="fill-forge" stroke="none" x="34" y="20" width="3" height="8" rx="1" />
    </svg>
  );
}

function PumpsMotorsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="19" cy="22" r="10" />
      <path d="M19 8v4M29 22h8" />
      <circle className="fill-forge" stroke="none" cx="19" cy="22" r="2.5" />
    </svg>
  );
}

function CompressorsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="15" y="8" width="14" height="30" rx="5" />
      <circle cx="22" cy="17" r="4.5" />
      <path d="M22 12.5v1.5M13 38h18" />
      <circle className="fill-forge" stroke="none" cx="22" cy="17" r="1.5" />
    </svg>
  );
}

function FittingsFastenersIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M24 8 34 14v12L24 32 14 26V14z" />
      <circle cx="24" cy="20" r="5" />
      <circle className="fill-forge" stroke="none" cx="24" cy="20" r="1.75" />
    </svg>
  );
}

function CouplingIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="14" cy="24" r="8" />
      <circle cx="34" cy="24" r="8" />
      <path d="M22 24h4" />
      <circle className="fill-forge" stroke="none" cx="14" cy="24" r="2" />
      <circle className="fill-forge" stroke="none" cx="34" cy="24" r="2" />
    </svg>
  );
}

function LiftingHandlingIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M22 6v16" />
      <path d="M22 22c0 6 5 8 9 5.5" />
      <rect className="fill-forge" stroke="none" x="24" y="30" width="9" height="8" rx="1.5" />
    </svg>
  );
}

function InstrumentationIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="24" cy="24" r="14" />
      <path d="M24 12v3M36 24h-3M24 36v-3M12 24h3" />
      <path className="fill-forge" stroke="none" d="M24 24 32 17l-5 10z" />
    </svg>
  );
}

function FiltersIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M11 10h26l-9 13v9l-8 4v-13z" />
      <circle className="fill-forge" stroke="none" cx="20" cy="38" r="1.75" />
    </svg>
  );
}

function PipeTestingPlugsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M6 20h20v8H6z" />
      <ellipse cx="30" cy="24" rx="5" ry="6" />
      <path d="M35 24h7" />
      <circle className="fill-forge" stroke="none" cx="30" cy="24" r="2" />
    </svg>
  );
}

function DesalinationIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M24 8c7 9 10 14.5 10 19a10 10 0 0 1 -20 0c0-4.5 3-10 10-19z" />
      <path d="M9 40c3-2 6-2 9 0s6 2 9 0 6-2 9 0" />
      <circle className="fill-forge" stroke="none" cx="24" cy="27" r="2.25" />
    </svg>
  );
}

function ChemicalsLubricantsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="11" y="14" width="26" height="24" rx="3" />
      <path d="M11 22h26M11 30h26" />
      <circle className="fill-forge" stroke="none" cx="24" cy="10" r="2.25" />
      <path d="M24 10v4" />
    </svg>
  );
}

function PackagingIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M24 6 40 14v20L24 42 8 34V14z" />
      <path d="M8 14 24 22l16-8M24 22v20" />
      <path className="fill-forge" stroke="none" d="M14 10h6v4h-6zM28 10h6v4h-6z" />
    </svg>
  );
}

const GEAR_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function SawingToolsIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="24" cy="24" r="12" />
      {GEAR_ANGLES.map((angle) => (
        <rect
          key={angle}
          x="22"
          y="6"
          width="4"
          height="7"
          rx="1"
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
      <circle className="fill-forge" stroke="none" cx="24" cy="24" r="4" />
    </svg>
  );
}

function MarineIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="24" cy="11" r="3.5" />
      <path d="M24 14.5V34M15 22h18" />
      <path d="M12 28c1 6 6 10 12 10s11-4 12-10" />
      <circle className="fill-forge" stroke="none" cx="24" cy="11" r="1.25" />
    </svg>
  );
}

function HvacSafetyIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="24" cy="24" r="3" />
      <path d="M24 21c0-6 4-10 4-10s3 6-1 10zM24 27c0 6-4 10-4 10s-3-6 1-10zM21 24c-6 0-10-4-10-4s6-3 10 1zM27 24c6 0 10 4 10 4s-6 3-10-1z" />
      <circle className="fill-forge" stroke="none" cx="24" cy="24" r="1.5" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  electrical: ElectricalIcon,
  generators: GeneratorsIcon,
  "it-printing": ItPrintingIcon,
  "hydraulics-pneumatics": HydraulicsIcon,
  "pumps-motors": PumpsMotorsIcon,
  compressors: CompressorsIcon,
  "fittings-fasteners": FittingsFastenersIcon,
  coupling: CouplingIcon,
  "lifting-handling": LiftingHandlingIcon,
  instrumentation: InstrumentationIcon,
  filters: FiltersIcon,
  "pipe-testing-plugs": PipeTestingPlugsIcon,
  desalination: DesalinationIcon,
  "chemicals-lubricants": ChemicalsLubricantsIcon,
  packaging: PackagingIcon,
  "sawing-tools": SawingToolsIcon,
  marine: MarineIcon,
  "hvac-safety": HvacSafetyIcon,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export default function CategoryIcon({
  icon,
  className = "size-9",
}: {
  icon: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[icon] ?? ElectricalIcon;
  return <Icon className={className} />;
}
