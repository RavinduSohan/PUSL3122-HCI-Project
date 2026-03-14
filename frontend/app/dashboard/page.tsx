'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import NavBar from '@/components/NavBar';
import DesignCard from '@/components/DesignCard';
import api from '@/lib/api';
import Link from 'next/link';

interface Room {
  _id: string;
  name: string;
  width: number;
  height: number;
  shape: string;
  wallColour: string;
  furnitureCount?: number;
  updatedAt: string;
}

const HERO_SLIDES = [
  {
    id: '1493809842364-78817add7ffb',
    caption: 'Modern living spaces',
    sub: 'Clean lines, warm textures',
  },
  {
    id: '1484101403633-562f891dc89a',
    caption: 'Comfortable interiors',
    sub: 'Furniture that tells a story',
  },
  {
    id: '1556909114-f6e7ad7d3136',
    caption: 'Serene bedrooms',
    sub: 'Designed for rest & calm',
  },
  {
    id: '1618219740975-d40978bb7378',
    caption: 'Contemporary dining',
    sub: 'Spaces made for gathering',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage, user } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [adminRoomCount, setAdminRoomCount] = useState<number | null>(null);

  useEffect(() => { document.title = 'My Dashboard — FurniView'; }, []);
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    const fetchRooms = async () => {
      try {
        // Admin sees ALL rooms across all users; regular users see only their own
        const endpoint = user?.role === 'admin' ? '/rooms/admin/all' : '/rooms';
        const res = await api.get(endpoint);
        const fetched = res.data.data as Room[];
        setRooms(fetched);
        if (user?.role === 'admin') setAdminRoomCount(fetched.length);
      } catch {
        // 401 handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [isAuthenticated, router, user?.role]);

  // Auto-advance slideshow
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  const goSlide = useCallback((i: number) => setSlide(i), []);

  const handleDeleted = (id: string) => {
    setRooms((prev) => prev.filter((r) => r._id !== id));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.email?.split('@')[0] ?? '';

  return (
    <div className="min-h-screen" style={{ background: '#0F0F0F' }}>
      <NavBar />

      {/* ── Hero slideshow ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 480, background: '#0F0F0F' }}
      >
        {/* Slides — crossfade */}
        {HERO_SLIDES.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.id}
            src={`https://images.unsplash.com/photo-${s.id}?w=1600&q=80&auto=format&fit=crop`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{
              opacity: i === slide ? 0.60 : 0,
              transition: 'opacity 1.2s ease-in-out',
            }}
          />
        ))}

        {/* Clean dark overlay 40% — lets the render breathe */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.42)' }} />
        {/* Left text zone: deeper on left only */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 42%, transparent 72%)' }} />
        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
             style={{ height: 120, background: 'linear-gradient(to bottom, transparent, #0F0F0F)' }} />

        {/* Content */}
        <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-center pb-6">
          <p className="text-xs font-semibold mb-2 animate-fade-up"
             style={{ letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C89B3C' }}>
            {greeting}
          </p>
          <h1 className="text-4xl font-bold mb-1 animate-fade-up stagger-1"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.1, color: '#F5F5F5' }}>
            {firstName ? `Welcome back, ${firstName}` : 'My Dashboard'}
          </h1>

          {/* Slide caption — animates per slide, DM Serif Display */}
          <p
            key={slide}
            className="animate-fade-up font-display"
            style={{ color: '#DFB962', fontWeight: 400, fontSize: '1.35rem', marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.3 }}
          >
            {HERO_SLIDES[slide].caption}
            <span className="font-sans" style={{ color: 'rgba(200,155,60,0.55)', fontSize: '0.875rem', marginLeft: 10 }}>
              {HERO_SLIDES[slide].sub}
            </span>
          </p>

          {/* Stats row */}
          {!loading && (
            <div className="flex flex-wrap gap-3 mt-6 animate-fade-up stagger-2">
              {[
                { value: rooms.length, label: `Room design${rooms.length !== 1 ? 's' : ''}` },
                { value: rooms.reduce((s, r) => s + (r.furnitureCount ?? 0), 0), label: 'Furniture items' },
                {
                  value: rooms.length > 0
                    ? `${Math.round(rooms.reduce((s, r) => s + r.width * r.height, 0) / rooms.length)} m²`
                    : '—',
                  label: 'Avg room area',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl px-5 py-3"
                  style={{
                    background: 'rgba(200,155,60,0.08)',
                    border: '1px solid rgba(200,155,60,0.30)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.50), inset 0 1px 0 rgba(200,155,60,0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    minWidth: 110,
                  }}
                >
                  <p className="text-2xl font-bold" style={{ lineHeight: 1.2, color: '#C89B3C' }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.50)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dot indicators */}
          <div className="flex gap-2 mt-5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === slide ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === slide ? '#C89B3C' : 'rgba(200,155,60,0.28)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.4s ease, background 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Admin banner ─────────────────────────────────────────────── */}
      {user?.role === 'admin' && adminRoomCount !== null && (
        <div className="max-w-6xl mx-auto px-6 mt-5">
          <div className="flex items-center gap-3 rounded-xl px-5 py-3" style={{ background: '#1A1A1A', border: '1px solid rgba(200,155,60,0.25)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="#C89B3C" fillOpacity="0.20" stroke="#C89B3C" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="#C89B3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm font-semibold" style={{ color: '#C89B3C' }}>Admin View</p>
            <span className="h-4 w-px" style={{ background: 'rgba(200,155,60,0.30)' }} />
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Platform total: <strong style={{ color: '#DFB962' }}>{adminRoomCount}</strong> room{adminRoomCount !== 1 ? 's' : ''} across all users</p>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6" style={{ paddingTop: 36, paddingBottom: 52 }}>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-widest uppercase"
                style={{ color: '#C89B3C', letterSpacing: '0.14em' }}>
              {loading ? 'Loading…' : rooms.length === 0 ? 'No rooms yet' : `All rooms (${rooms.length})`}
            </h2>
            <div className="h-px flex-1" style={{ background: 'rgba(200,155,60,0.25)', width: 40 }} />
          </div>
          <Link
            href="/room/new"
            className="text-sm px-4 rounded-lg transition-all font-semibold flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #8A6520, #C89B3C)', color: '#0F0F0F', height: 38, boxShadow: '0 2px 12px rgba(200,155,60,0.35)' }}
            onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #A67C2A, #DFB962)'; e.currentTarget.style.boxShadow = '0 4px 22px rgba(200,155,60,0.55)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8A6520, #C89B3C)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(200,155,60,0.35)'; }}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/></svg>
            New Room
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-premium overflow-hidden animate-pulse">
                <div className="w-full h-36" style={{ background: '#111111' }} />
                <div className="p-5 space-y-2.5">
                  <div className="h-4 rounded w-2/3" style={{ background: '#2A2A2A' }} />
                  <div className="h-3 rounded w-1/2" style={{ background: '#222222' }} />
                  <div className="h-3 rounded w-1/3" style={{ background: '#222222' }} />
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 h-9 rounded-lg" style={{ background: 'rgba(200,155,60,0.15)' }} />
                    <div className="h-9 w-9 rounded-lg" style={{ background: '#2A2A2A' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="card-premium text-center py-20 px-8 animate-fade-up">
            {/* Decorative radial glow behind the icon */}
            <div className="relative mx-auto mb-5" style={{ width: 128, height: 80 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 70% at 50% 60%, rgba(200,155,60,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
              <svg viewBox="0 0 120 80" fill="none" className="w-full h-full" aria-hidden="true">
                <rect x="10" y="20" width="100" height="50" rx="4" stroke="#C89B3C" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.50"/>
                <rect x="22" y="32" width="28" height="18" rx="2" stroke="#C89B3C" strokeWidth="1.2" fill="none" opacity="0.60"/>
                <rect x="58" y="36" width="38" height="12" rx="2" stroke="#C89B3C" strokeWidth="1.2" fill="none" opacity="0.60"/>
                <circle cx="60" cy="15" r="5" stroke="#DFB962" strokeWidth="1.2" fill="none" opacity="0.50"/>
                <path d="M56 15h8M60 11v8" stroke="#DFB962" strokeWidth="1.2" strokeLinecap="round" opacity="0.70"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#F5F5F5' }}>Your canvas is empty</h2>
            <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: '#B0B0B0' }}>Create your first room to start designing. Add furniture, pick colours, and visualise in 3D.</p>
            <Link
              href="/room/new"
              className="inline-flex items-center gap-1.5 font-semibold px-6 rounded-xl text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #8A6520, #C89B3C)', color: '#0F0F0F', height: 44, boxShadow: '0 2px 16px rgba(200,155,60,0.40)' }}
              onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #A67C2A, #DFB962)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,155,60,0.60)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8A6520, #C89B3C)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(200,155,60,0.40)'; }}
            >
              + Create Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <div key={room._id} className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
                <DesignCard room={room} onDeleted={handleDeleted} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

