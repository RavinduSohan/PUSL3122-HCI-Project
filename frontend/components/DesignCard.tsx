'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Room {
  _id: string;
  name: string;
  width: number;
  height: number;
  shape: string;
  wallColour: string;
  furnitureCount?: number;
  updatedAt: string;
  thumbnailDataUrl?: string;
}

interface Props {
  room: Room;
  onDeleted: (id: string) => void;
}

/** Rich architectural floor-plan thumbnail — 220 × 140 viewBox */
function FloorPlanSVG({
  shape,
  wallColour,
  furnitureCount = 0,
}: {
  shape: string;
  wallColour: string;
  furnitureCount?: number;
}) {
  const vw = 220, vh = 140;
  const pad = 22;          // outer margin
  const wt  = 7;           // wall thickness in px
  const W = vw - pad * 2;
  const H = vh - pad * 2;

  const isL    = shape === 'l-shape';
  const cutW   = Math.round(W * 0.42);
  const cutH   = Math.round(H * 0.45);
  const wallC  = wallColour ?? '#D4C9B8';

  // ----- path helpers -----
  const rectPath = `M ${pad} ${pad} L ${pad+W} ${pad} L ${pad+W} ${pad+H} L ${pad} ${pad+H} Z`;
  const lPath    = `M ${pad} ${pad}
      L ${pad+W-cutW} ${pad}
      L ${pad+W-cutW} ${pad+cutH}
      L ${pad+W} ${pad+cutH}
      L ${pad+W} ${pad+H}
      L ${pad} ${pad+H} Z`;
  const outerPath = isL ? lPath : rectPath;

  // inner floor (inset by wall thickness)
  const iL = pad + wt, iT = pad + wt;
  const iR = pad + W - wt, iB = pad + H - wt;
  const innerRect = `M ${iL} ${iT} L ${iR} ${iT} L ${iR} ${iB} L ${iL} ${iB} Z`;
  const innerL    = `M ${iL} ${iT}
      L ${pad+W-cutW-wt} ${iT}
      L ${pad+W-cutW-wt} ${pad+cutH-wt}
      L ${iR} ${pad+cutH-wt}
      L ${iR} ${iB}
      L ${iL} ${iB} Z`;
  const floorPath = isL ? innerL : innerRect;

  // door opening: narrow gap in bottom-left wall
  const doorW = 18;
  const doorX = pad + wt + 4;

  // sample furniture blob positions (deterministic from count)
  const furnitureSeed = [
    [0.25, 0.30], [0.55, 0.28], [0.28, 0.62],
    [0.60, 0.65], [0.45, 0.50], [0.72, 0.42],
  ].slice(0, Math.min(furnitureCount, 6));

  const uid = `fp-${shape}-${wallColour.replace('#','')}`;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} fill="none" className="w-full h-full" aria-hidden="true">
      <defs>
        {/* Wood floor plank pattern */}
        <pattern id={`${uid}-wood`} patternUnits="userSpaceOnUse" width="220" height="9" x={iL} y={iT}>
          <rect width="220" height="9" fill="#C9A46A" />
          <rect width="220" height="8.2" fill="#D4AF7A" />
          <rect y="8.2" width="220" height="0.8" fill="#A07840" opacity="0.5" />
          {/* grain lines */}
          <line x1="0"  y1="2.5" x2="40"  y2="2" stroke="#BE9858" strokeWidth="0.4" opacity="0.35"/>
          <line x1="55" y1="5"   x2="110" y2="4.5" stroke="#BE9858" strokeWidth="0.3" opacity="0.28"/>
          <line x1="130" y1="1.5" x2="180" y2="2" stroke="#BE9858" strokeWidth="0.4" opacity="0.30"/>
          {/* plank gap every other row offset */}
          <line x1="110" y1="0" x2="110" y2="9" stroke="#A07840" strokeWidth="0.6" opacity="0.25"/>
        </pattern>

        {/* Vignette radial — dark at edges for depth */}
        <radialGradient id={`${uid}-vign`} cx="50%" cy="50%" r="70%">
          <stop offset="40%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)" />
        </radialGradient>

        {/* Corner ambient occlusion: top-left */}
        <radialGradient id={`${uid}-ao`} cx="0%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Subtle glow on floor */}
        <filter id={`${uid}-glow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(180,130,60,0.18)" />
        </filter>

        {/* Wall drop shadow */}
        <filter id={`${uid}-wshadow`} x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.35)" />
        </filter>

        <clipPath id={`${uid}-clip`}>
          <path d={outerPath} />
        </clipPath>
        <clipPath id={`${uid}-fclip`}>
          <path d={floorPath} />
        </clipPath>
      </defs>

      {/* ── Background ── */}
      <rect width={vw} height={vh} fill="#16202E" />

      {/* Subtle grid on background */}
      {Array.from({length: 8}).map((_,i) => (
        <line key={`bg-v${i}`} x1={Math.round(vw/8*(i+1))} y1={0} x2={Math.round(vw/8*(i+1))} y2={vh}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}
      {Array.from({length: 5}).map((_,i) => (
        <line key={`bg-h${i}`} x1={0} y1={Math.round(vh/5*(i+1))} x2={vw} y2={Math.round(vh/5*(i+1))}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* ── Outer wall body (solid, wall colour tinted) ── */}
      <path d={outerPath} fill={wallC} filter={`url(#${uid}-wshadow)`} />

      {/* ── Wall texture: inner darker edge ── */}
      <path d={outerPath} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />

      {/* ── Wood floor ── */}
      <path d={floorPath} fill={`url(#${uid}-wood)`} filter={`url(#${uid}-glow)`} />

      {/* Floor plank highlight streak */}
      <rect
        x={iL} y={iT}
        width={isL ? W - cutW - wt*2 : W - wt*2}
        height={4}
        fill="rgba(255,255,255,0.09)"
        clipPath={`url(#${uid}-fclip)`}
      />

      {/* ── Vignette over floor ── */}
      <path d={floorPath} fill={`url(#${uid}-vign)`} />

      {/* ── Corner ambient occlusion ── */}
      <rect x={iL} y={iT} width={W-wt*2} height={H-wt*2}
            fill={`url(#${uid}-ao)`} clipPath={`url(#${uid}-fclip)`} opacity="0.7"/>

      {/* ── Wall inner top highlight ── */}
      <line x1={iL} y1={iT} x2={iR} y2={iT} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <line x1={iL} y1={iT} x2={iL} y2={iB} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* ── Baseboard / skirting line ── */}
      <path d={floorPath} fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth="1" />

      {/* ── Door opening ── */}
      {/* gap in bottom wall */}
      <rect x={doorX} y={pad+H-wt} width={doorW} height={wt+1} fill={`url(#${uid}-wood)`} />
      {/* swing arc */}
      <path
        d={`M ${doorX} ${iB} A ${doorW} ${doorW} 0 0 0 ${doorX+doorW} ${iB}`}
        stroke="rgba(255,255,255,0.30)" strokeWidth="0.9" strokeDasharray="2.5 1.5"
      />
      <line x1={doorX} y1={iB-doorW} x2={doorX} y2={iB}
            stroke="rgba(255,255,255,0.30)" strokeWidth="1.2"/>

      {/* ── Furniture position hints ── */}
      {furnitureSeed.map(([fx, fy], idx) => {
        const fw = 18 + (idx % 3) * 6;
        const fh = 10 + (idx % 2) * 6;
        const fx2 = iL + (W - wt*2 - fw) * fx;
        const fy2 = iT + (H - wt*2 - fh) * fy;
        return (
          <rect
            key={idx}
            x={fx2} y={fy2} width={fw} height={fh}
            rx="2"
            fill="rgba(255,255,255,0.10)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.8"
          />
        );
      })}

      {/* ── Compass / north indicator (tiny) ── */}
      <g transform={`translate(${vw - 14}, 12)`} opacity="0.45">
        <circle r="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
        <path d="M 0 -4.5 L 1.5 1 L 0 -0.5 L -1.5 1 Z" fill="rgba(255,255,255,0.7)"/>
        <text x="0" y="3.5" textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.5)"
              fontFamily="Inter,sans-serif">N</text>
      </g>
    </svg>
  );
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours   / 24);
  const weeks   = Math.floor(days    / 7);
  const months  = Math.floor(days    / 30);
  if (seconds < 60)  return 'just now';
  if (minutes < 60)  return rtf.format(-minutes, 'minute');
  if (hours   < 24)  return rtf.format(-hours,   'hour');
  if (days    < 7)   return rtf.format(-days,    'day');
  if (weeks   < 5)   return rtf.format(-weeks,   'week');
  return rtf.format(-months, 'month');
}

export default function DesignCard({ room, onDeleted }: Props) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/rooms/${room._id}`);
      toast.success(`"${room.name}" deleted`);
      onDeleted(room._id);
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const areaM2 = room.shape === 'l-shape'
    ? room.width * room.height - (room.width / 2) * (room.height / 2)
    : room.width * room.height;

  return (
    <div className="card-premium overflow-hidden transition-all duration-200 group flex flex-col">
      {/* ── Architectural floor plan preview ── */}
      <div className="w-full relative" style={{ height: 140, background: '#0F0F0F' }}>
        {room.thumbnailDataUrl
          ? <img src={room.thumbnailDataUrl} alt={`${room.name} preview`} className="w-full h-full" style={{ objectFit: 'cover', opacity: 0.95 }} />
          : <FloorPlanSVG shape={room.shape} wallColour={room.wallColour} furnitureCount={room.furnitureCount} />
        }

        {/* Wall colour swatch — premium dot */}
        <span
          className="absolute top-3 right-3 rounded-full"
          style={{
            background: room.wallColour,
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.7)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.40)',
            display: 'block',
          }}
          title={`Wall colour: ${room.wallColour}`}
        />

        {/* Furniture count badge */}
        {room.furnitureCount != null && room.furnitureCount > 0 && (
          <span className="absolute bottom-2.5 left-3 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(200,155,60,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(200,155,60,0.35)', color: '#DFB962' }}>
            {room.furnitureCount} item{room.furnitureCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1" style={{ background: '#1A1A1A' }}>
        {/* Room name */}
        <h3
          className="font-semibold text-base truncate mb-2"
          style={{ color: '#F5F5F5', lineHeight: 1.4, letterSpacing: '-0.01em' }}
        >
          {room.name}
        </h3>
        {/* Chip metadata row */}
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {([
            `${room.width} × ${room.height} m`,
            room.furnitureCount != null ? `${room.furnitureCount} item${room.furnitureCount !== 1 ? 's' : ''}` : null,
            `${Math.round(areaM2)} m²`,
          ] as (string | null)[]).filter(Boolean).map((chip) => (
            <span key={chip} style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#C89B3C',
              background: 'rgba(200,155,60,0.10)',
              border: '1px solid rgba(200,155,60,0.24)',
              borderRadius: 20,
              padding: '2px 8px',
              whiteSpace: 'nowrap',
            }}>{chip}</span>
          ))}
        </div>
        {/* Relative time */}
        <p style={{ fontSize: 11, color: '#B0B0B0', opacity: 0.80 }}>
          {relativeTime(room.updatedAt)}
        </p>

        <div className="flex gap-2 mt-auto pt-4">
          <Link
            href={`/room/${room._id}`}
            className="flex-1 text-center text-sm px-3 py-2.5 rounded-lg transition-all font-semibold flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8A6520, #C89B3C)', color: '#0F0F0F', height: 40, boxShadow: '0 2px 10px rgba(200,155,60,0.35)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.03em' }}
            onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #A67C2A, #DFB962)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,155,60,0.55)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8A6520, #C89B3C)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(200,155,60,0.35)'; }}
          >
            Open
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: 40,
              height: 40,
              color: '#B0B0B0',
              border: '1px solid rgba(200,155,60,0.18)',
              background: 'transparent',
            }}
            onMouseOver={e => {
              const b = e.currentTarget;
              b.style.background = 'rgba(239,68,68,0.12)';
              b.style.color = '#EF4444';
              b.style.borderColor = 'rgba(239,68,68,0.35)';
            }}
            onMouseOut={e => {
              const b = e.currentTarget;
              b.style.background = 'transparent';
              b.style.color = '#B0B0B0';
              b.style.borderColor = 'rgba(200,155,60,0.18)';
            }}
            aria-label={`Delete ${room.name}`}
            title={`Delete ${room.name}`}
          >
            {/* Heroicons trash outline */}
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h2a1 1 0 011 1v.5H7V4a1 1 0 011-1zm-4 2.5h10M8.5 8.5v5m3-5v5M4.5 5.5l1 10a1 1 0 001 .9h7a1 1 0 001-.9l1-10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
