'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import NavBar from '@/components/NavBar';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { inputCls } from '@/lib/ui';
import Link from 'next/link';

interface ProfileData {
  user: { id: string; email: string; role: string; createdAt: string };
  stats: { rooms: number; totalFurniture: number };
}

const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type PwForm = z.infer<typeof pwSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage, user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Profile — FurniView'; }, []);
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);
  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    api.get('/auth/me')
      .then((res) => setProfile(res.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PwForm>({
    resolver: zodResolver(pwSchema),
  });

  const onChangePassword = async (data: PwForm) => {
    try {
      await api.put('/auth/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    }
  };

  const initials = (authUser?.email ?? '?').slice(0, 2).toUpperCase();
  const memberSince = profile?.user.createdAt
    ? new Date(profile.user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <NavBar />

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* ── Account info card ── */}
        <div className="card p-6">
          <div className="flex items-center gap-5">
            {/* Avatar — gradient */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {authUser?.email ?? '…'}
              </h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-xs font-medium capitalize" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  {authUser?.role ?? 'user'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!loading && profile && (
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'var(--bg-inset)',
                  borderLeft: '3px solid #6366F1',
                }}
              >
                <p className="text-3xl font-bold" style={{ color: '#6366F1' }}>{profile.stats.rooms}</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Room design{profile.stats.rooms !== 1 ? 's' : ''}
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'var(--bg-inset)',
                  borderLeft: '3px solid #10B981',
                }}
              >
                <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{profile.stats.totalFurniture}</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Furniture items placed</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
              <div className="bg-slate-100 rounded-xl h-20" />
              <div className="bg-slate-100 rounded-xl h-20" />
            </div>
          )}
        </div>

        {/* ── Quick links ── */}
        <div className="card p-5">
          <h2 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm border px-4 py-2.5 rounded-lg transition-colors font-medium"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border)', background: 'var(--bg-inset)', height: 40 }}
              onMouseOver={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-inset)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              My Rooms
            </Link>
            <Link
              href="/room/new"
              className="flex items-center gap-2 text-sm text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
              style={{ background: 'var(--accent)', height: 40 }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              + New Room
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-2 text-sm border px-4 py-2.5 rounded-lg transition-colors font-medium"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border)', background: 'var(--bg-inset)', height: 40 }}
              onMouseOver={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-inset)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              User Guide
            </Link>
          </div>
        </div>

        {/* ── Change password ── */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Change Password</h2>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Current Password
              </label>
              <input
                {...register('currentPassword')}
                type="password"
                className={inputCls(!!errors.currentPassword)}
                placeholder="Your current password"
                autoComplete="current-password"
              />
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                New Password
              </label>
              <input
                {...register('newPassword')}
                type="password"
                className={inputCls(!!errors.newPassword)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Confirm New Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className={inputCls(!!errors.confirmPassword)}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
            >
              {isSubmitting ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
