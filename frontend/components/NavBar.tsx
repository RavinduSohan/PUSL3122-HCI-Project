'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '?';

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className="text-sm font-medium relative transition-colors"
          style={{
          color: active ? '#F5F5F5' : '#B0B0B0',
          padding: '6px 14px 10px',
        }}
      >
        {label}
        {active && (
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              left: 14,
              right: 14,
              height: 2,
              borderRadius: 1,
              background: '#C89B3C',
              display: 'block',
            }}
          />
        )}
      </Link>
    );
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(15,15,15,0.92)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: '1px solid rgba(200,155,60,0.22)',
        boxShadow: '0 1px 0 rgba(200,155,60,0.08), 0 4px 24px rgba(0,0,0,0.80)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #A67C2A, #C89B3C)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M3 13V10a1 1 0 011-1h16a1 1 0 011 1v3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="2" y="13" width="20" height="6" rx="2" fill="#0F0F0F" fillOpacity="0.25" stroke="#0F0F0F" strokeWidth="1.5"/>
                <path d="M5 13v3M19 13v3" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 17h20" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">FurniView</span>
          </Link>

          {/* Nav links (desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-0.5">
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/guide', 'Guide')}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Ghost outline New Room button */}
          <Link
            href="/room/new"
            className="text-sm px-4 py-2 rounded-lg transition-all font-medium hidden sm:flex items-center gap-1"
            style={{ border: '1.5px solid rgba(200,155,60,0.40)', color: '#C89B3C' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(200,155,60,0.10)'; e.currentTarget.style.borderColor = 'rgba(200,155,60,0.75)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,155,60,0.40)'; }}
          >
            <span className="text-base leading-none">+</span> New Room
          </Link>

          {/* Profile avatar — gradient */}
          {user && (
            <Link
              href="/profile"
              title={user.email}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: 'linear-gradient(135deg, #A67C2A, #C89B3C)' }}
            >
              {initials}
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded-lg transition-colors"
            style={{ color: '#B0B0B0' }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#F87171';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#B0B0B0';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

