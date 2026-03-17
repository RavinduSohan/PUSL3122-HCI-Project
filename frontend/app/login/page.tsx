'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { inputCls } from '@/lib/ui';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => { document.title = 'Log In — FurniView'; }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.data.token, res.data.data.user);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Check your credentials.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 mb-4">
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <rect x="3" y="19" width="26" height="10" rx="2" fill="white" fillOpacity="0.9"/>
                <rect x="5" y="14" width="22" height="7" rx="3" fill="white"/>
                <rect x="3" y="17" width="5" height="5" rx="2" fill="white" fillOpacity="0.7"/>
                <rect x="24" y="17" width="5" height="5" rx="2" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to your FurniView account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={inputCls(!!errors.email)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className={inputCls(!!errors.password)}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50"
              style={{ background: 'var(--accent)', height: 42 }}
              onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-7" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: decorative panel ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--bg-nav)' }}
      >
        {/* Decorative grid dot background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* Decorative floor-plan SVG */}
          <svg viewBox="0 0 220 160" fill="none" className="w-64 mx-auto mb-8" aria-hidden="true">
            <rect x="10" y="10" width="200" height="140" rx="4" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeDasharray="6 4"/>
            <rect x="10" y="10" width="200" height="140" rx="4" fill="rgba(99,102,241,0.04)"/>
            {/* Room divider */}
            <line x1="110" y1="10" x2="110" y2="150" stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeDasharray="4 3"/>
            {/* Sofa */}
            <rect x="28" y="30" width="60" height="22" rx="3" fill="rgba(201,169,110,0.35)" stroke="rgba(201,169,110,0.6)" strokeWidth="0.8"/>
            {/* Coffee table */}
            <rect x="38" y="62" width="34" height="18" rx="2" fill="rgba(92,61,46,0.25)" stroke="rgba(92,61,46,0.5)" strokeWidth="0.8"/>
            {/* Bed */}
            <rect x="128" y="28" width="60" height="70" rx="3" fill="rgba(143,163,177,0.25)" stroke="rgba(143,163,177,0.55)" strokeWidth="0.8"/>
            {/* Wardrobe */}
            <rect x="128" y="108" width="60" height="20" rx="2" fill="rgba(74,74,74,0.25)" stroke="rgba(74,74,74,0.5)" strokeWidth="0.8"/>
            {/* Door arc */}
            <path d="M 10 90 Q 30 90 30 70" stroke="rgba(99,102,241,0.4)" strokeWidth="0.8" fill="none" strokeDasharray="3 2"/>
            <line x1="10" y1="70" x2="10" y2="90" stroke="rgba(99,102,241,0.5)" strokeWidth="1"/>
            {/* Compass */}
            <g transform="translate(200, 20)" opacity="0.5">
              <circle r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
              <path d="M 0 -5 L 1.5 1.5 L 0 0 L -1.5 1.5 Z" fill="rgba(99,102,241,0.8)"/>
            </g>
          </svg>
          <h2 className="font-display text-3xl text-white mb-3" style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Design your space
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.75)', maxWidth: 280, margin: '0 auto' }}>
            Plan furniture layouts in 2D, then step inside your room in immersive 3D
          </p>
          {/* Feature chips */}
          <div className="flex flex-col gap-2 mt-8 items-start">
            {['2D floor-plan editor', 'Multi-part 3D furniture', 'Walk-in camera view'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }}/>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
