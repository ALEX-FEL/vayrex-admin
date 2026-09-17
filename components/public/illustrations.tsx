import { cn } from '@/lib/utils';

/** Abstract map route illustration — two pins connected by a curved path */
export function RouteIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="route-grad" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B6BFF" />
          <stop offset="1" stopColor="#7B5CFF" />
        </linearGradient>
        <radialGradient id="route-glow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#3B6BFF" stopOpacity="0.15" />
          <stop offset="1" stopColor="#3B6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" rx="16" fill="#141B3D" />
      <rect width="400" height="300" rx="16" fill="url(#route-glow)" />
      {/* grid lines */}
      <g stroke="#1E2A55" strokeWidth="0.5" opacity="0.5">
        {[60, 120, 180, 240].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} />
        ))}
        {[80, 160, 240, 320].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="300" />
        ))}
      </g>
      {/* route path */}
      <path d="M80 220 C 140 220, 160 120, 220 120 S 320 80, 320 80" stroke="url(#route-grad)" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="0" />
      {/* dashed portion */}
      <path d="M80 220 C 140 220, 160 120, 220 120" stroke="url(#route-grad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="6 6" />
      {/* start pin */}
      <circle cx="80" cy="220" r="10" fill="#3B6BFF" />
      <circle cx="80" cy="220" r="5" fill="#0A0E27" />
      <circle cx="80" cy="220" r="18" fill="#3B6BFF" fillOpacity="0.15" />
      {/* end pin */}
      <circle cx="320" cy="80" r="10" fill="#7B5CFF" />
      <circle cx="320" cy="80" r="5" fill="#0A0E27" />
      <circle cx="320" cy="80" r="18" fill="#7B5CFF" fillOpacity="0.15" />
      {/* car icon mid-route */}
      <g transform="translate(200 115)">
        <rect x="-14" y="-8" width="28" height="16" rx="4" fill="url(#route-grad)" />
        <rect x="-10" y="-5" width="20" height="6" rx="2" fill="#0A0E27" fillOpacity="0.3" />
        <circle cx="-8" cy="9" r="3" fill="#0A0E27" />
        <circle cx="8" cy="9" r="3" fill="#0A0E27" />
      </g>
    </svg>
  );
}

/** Phone mockup with app UI suggestion */
export function PhoneIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 420" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="phone-grad" x1="120" y1="0" x2="120" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B6BFF" />
          <stop offset="1" stopColor="#7B5CFF" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="220" height="400" rx="32" fill="#141B3D" stroke="#1E2A55" strokeWidth="2" />
      <rect x="20" y="20" width="200" height="380" rx="24" fill="#0A0E27" />
      {/* notch */}
      <rect x="90" y="22" width="60" height="6" rx="3" fill="#1E2A55" />
      {/* app content: map area */}
      <rect x="32" y="40" width="176" height="160" rx="12" fill="#141B3D" />
      {/* mini route */}
      <path d="M50 150 C 80 150, 100 80, 140 80 S 190 60, 190 60" stroke="url(#phone-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="150" r="5" fill="#3B6BFF" />
      <circle cx="190" cy="60" r="5" fill="#7B5CFF" />
      {/* price card */}
      <rect x="32" y="214" width="176" height="56" rx="12" fill="#141B3D" />
      <rect x="44" y="226" width="80" height="8" rx="4" fill="#1E2A55" />
      <rect x="44" y="242" width="50" height="6" rx="3" fill="#1E2A55" />
      <rect x="150" y="226" width="46" height="24" rx="8" fill="url(#phone-grad)" />
      {/* driver card */}
      <rect x="32" y="282" width="176" height="72" rx="12" fill="#141B3D" />
      <circle cx="56" cy="318" r="16" fill="#1E2A55" />
      <rect x="82" y="302" width="70" height="8" rx="4" fill="#1E2A55" />
      <rect x="82" y="318" width="40" height="6" rx="3" fill="#1E2A55" />
      <rect x="82" y="332" width="50" height="6" rx="3" fill="#1E2A55" />
      {/* bottom button */}
      <rect x="32" y="368" width="176" height="24" rx="12" fill="url(#phone-grad)" />
    </svg>
  );
}

/** Abstract city skyline */
export function CityIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 160" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="city-grad" x1="0" y1="160" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B6BFF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#7B5CFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* buildings */}
      <g fill="url(#city-grad)" stroke="#1E2A55" strokeWidth="1">
        <rect x="20" y="60" width="40" height="100" rx="2" />
        <rect x="70" y="40" width="35" height="120" rx="2" />
        <rect x="115" y="80" width="30" height="80" rx="2" />
        <rect x="155" y="30" width="45" height="130" rx="2" />
        <rect x="210" y="55" width="35" height="105" rx="2" />
        <rect x="255" y="70" width="40" height="90" rx="2" />
        <rect x="305" y="45" width="35" height="115" rx="2" />
        <rect x="350" y="65" width="30" height="95" rx="2" />
      </g>
      {/* windows */}
      <g fill="#3B6BFF" fillOpacity="0.3">
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 28 + (i % 8) * 45 + Math.floor(i / 8) * 5;
          const y = 70 + Math.floor(i / 8) * 20;
          return <rect key={i} x={x} y={y} width="4" height="4" rx="1" />;
        })}
      </g>
    </svg>
  );
}

/** Shield for trust mode */
export function ShieldIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="shield-grad" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B6BFF" />
          <stop offset="1" stopColor="#7B5CFF" />
        </linearGradient>
      </defs>
      <path d="M60 10 L 105 25 V 70 C 105 100, 85 120, 60 130 C 35 120, 15 100, 15 70 V 25 Z" fill="#141B3D" stroke="url(#shield-grad)" strokeWidth="2.5" />
      <path d="M42 68 L 54 80 L 80 52" stroke="url(#shield-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Steering wheel for driver page */
export function SteeringWheelIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="wheel-grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B6BFF" />
          <stop offset="1" stopColor="#7B5CFF" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" stroke="url(#wheel-grad)" strokeWidth="6" fill="none" />
      <circle cx="100" cy="100" r="20" stroke="url(#wheel-grad)" strokeWidth="6" fill="#141B3D" />
      <line x1="100" y1="120" x2="100" y2="180" stroke="url(#wheel-grad)" strokeWidth="6" strokeLinecap="round" />
      <line x1="83" y1="87" x2="30" y2="55" stroke="url(#wheel-grad)" strokeWidth="6" strokeLinecap="round" />
      <line x1="117" y1="87" x2="170" y2="55" stroke="url(#wheel-grad)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
