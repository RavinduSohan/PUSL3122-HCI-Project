'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import NavBar from '@/components/NavBar';
import { inputCls } from '@/lib/ui';

const schema = z.object({
  name: z.string().min(1, 'Room name is required'),
  width: z.coerce.number().min(1, 'Width must be at least 1 metre').max(50, 'Width too large'),
  height: z.coerce.number().min(1, 'Height must be at least 1 metre').max(50, 'Height too large'),
  shape: z.enum(['rectangle', 'l-shape']),
  wallColour: z.string().min(1, 'Choose a wall colour'),
});

type FormData = z.infer<typeof schema>;

export default function NewRoomPage() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => { document.title = 'New Room — FurniView'; }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { shape: 'rectangle', wallColour: '#F5F0E8' },
  });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/rooms', data);
      toast.success(`"${data.name}" created!`);
      router.push(`/room/${res.data.data._id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create room.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>New Room</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Set up your room dimensions and style</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Room Name</label>
            <input
              {...register('name')}
              className={inputCls(!!errors.name)}
              placeholder="e.g. Living Room"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Width (metres)</label>
              <input
                {...register('width')}
                type="number"
                step="0.1"
                className={inputCls(!!errors.width)}
                placeholder="e.g. 5"
              />
              {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Height (metres)</label>
              <input
                {...register('height')}
                type="number"
                step="0.1"
                className={inputCls(!!errors.height)}
                placeholder="e.g. 4"
              />
              {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
            </div>
          </div>

          {/* Shape */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Room Shape</label>
            <select
              {...register('shape')}
              className="w-full px-4 py-2.5 border rounded-lg text-sm bg-white"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="rectangle">Rectangle</option>
              <option value="l-shape">L-Shape</option>
            </select>
          </div>

          {/* Wall Colour */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Wall Colour</label>
            <div className="flex items-center gap-3">
              <input
                {...register('wallColour')}
                type="color"
                className="h-10 w-20 border rounded-lg cursor-pointer p-1"
                style={{ borderColor: 'var(--border)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Click to choose a colour</span>
            </div>
            {errors.wallColour && <p className="text-red-500 text-xs mt-1">{errors.wallColour.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50"
              style={{ background: 'var(--accent)', height: 40 }}
              onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              {isSubmitting ? 'Creating…' : 'Create Room'}
            </button>
            <Link
              href="/dashboard"
              className="px-5 border text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', height: 40 }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
