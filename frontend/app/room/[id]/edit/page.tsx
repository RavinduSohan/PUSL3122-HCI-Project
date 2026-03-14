'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import NavBar from '@/components/NavBar';
import { inputCls } from '@/lib/ui';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  width: z.coerce.number().min(2, 'Min 2m').max(30, 'Max 30m'),
  height: z.coerce.number().min(2, 'Min 2m').max(30, 'Max 30m'),
  shape: z.enum(['rectangle', 'l-shape']),
  wallColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid colour'),
});

type FormData = {
  name: string;
  width: number;
  height: number;
  shape: 'rectangle' | 'l-shape';
  wallColour: string;
};

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => { document.title = 'Edit Room — FurniView'; }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        const room = res.data.data.room;
        reset({
          name: room.name,
          width: room.width,
          height: room.height,
          shape: room.shape,
          wallColour: room.wallColour,
        });
      } catch {
        toast.error('Room not found');
        router.push('/dashboard');
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [isAuthenticated, roomId, router, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/rooms/${roomId}`, data);
      toast.success('Room updated!');
      router.push(`/room/${roomId}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update room';
      toast.error(msg);
    }
  };

  if (loadingRoom) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <NavBar />
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Edit Room Specs</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Update dimensions, shape and wall colour.</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Room name */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Room name</label>
              <input
                {...register('name')}
                className={inputCls(!!errors.name)}
                placeholder="e.g. Living Room"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('width')}
                  className={inputCls(!!errors.width)}
                />
                {errors.width && <p className="text-xs text-red-500 mt-1">{errors.width.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Height (m)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('height')}
                  className={inputCls(!!errors.height)}
                />
                {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height.message}</p>}
              </div>
            </div>

            {/* Shape */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Room shape</label>
              <select
                {...register('shape')}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="rectangle">Rectangle</option>
                <option value="l-shape">L-Shape</option>
              </select>
              {errors.shape && <p className="text-xs text-red-500 mt-1">{errors.shape.message}</p>}
            </div>

            {/* Wall colour */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Wall colour</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register('wallColour')}
                  className="h-10 w-16 border rounded-lg cursor-pointer p-1"
                  style={{ borderColor: 'var(--border)' }}
                />
                <input
                  type="text"
                  {...register('wallColour')}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="#FFFFFF"
                />
              </div>
              {errors.wallColour && (
                <p className="text-xs text-red-500 mt-1">{errors.wallColour.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/room/${roomId}`)}
                className="flex-1 border text-sm font-medium rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', height: 40, background: 'transparent' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                style={{ background: 'var(--accent)', height: 40 }}
                onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.background = 'var(--accent-hover)'; }}
                onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
              >
                {isSubmitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
