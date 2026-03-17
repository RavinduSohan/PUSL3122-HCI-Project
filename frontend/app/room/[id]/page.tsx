'use client';

import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import NavBar from '@/components/NavBar';
import dynamic from 'next/dynamic';
import Canvas2D, { FurnitureItem, Canvas2DHandle, SCALE } from '@/components/Canvas2D';
import ErrorBoundary from '@/components/ErrorBoundary';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

interface Room {
  _id: string;
  name: string;
  width: number;
  height: number;
  shape: 'rectangle' | 'l-shape';
  wallColour: string;
}

const FURNITURE_CATALOGUE = [
  { type: 'sofa',        label: 'Sofa',         w: 150, h: 60,  colour: '#C9A96E', icon: '🛋️' },
  { type: 'armchair',   label: 'Armchair',      w: 70,  h: 70,  colour: '#B8834A', icon: '🪑' },
  { type: 'coffee-table',label: 'Coffee Table', w: 80,  h: 40,  colour: '#5C3D2E', icon: '🟫' },
  { type: 'dining-table',label: 'Dining Table', w: 120, h: 70,  colour: '#B8834A', icon: '🍽️' },
  { type: 'bed-double',  label: 'Double Bed',   w: 140, h: 160, colour: '#8FA3B1', icon: '🛏️' },
  { type: 'bed-single',  label: 'Single Bed',   w: 90,  h: 160, colour: '#8FA3B1', icon: '🛌' },
  { type: 'wardrobe',    label: 'Wardrobe',     w: 120, h: 50,  colour: '#4A4A4A', icon: '🗄️' },
  { type: 'tv-unit',     label: 'TV Unit',      w: 120, h: 30,  colour: '#4A4A4A', icon: '📺' },
  { type: 'bookshelf',   label: 'Bookshelf',    w: 90,  h: 25,  colour: '#6E5A3E', icon: '📚' },
  { type: 'desk',        label: 'Desk',         w: 100, h: 50,  colour: '#B8834A', icon: '🖥️' },
];

const FURNITURE_SVGS: Record<string, ReactNode> = {
  'sofa': (
    <svg viewBox="0 0 40 24" width="40" height="24" fill="none">
      <rect x="2" y="10" width="36" height="12" rx="3" fill="#C9A96E"/>
      <rect x="2" y="6" width="8" height="8" rx="2" fill="#B8935E"/>
      <rect x="30" y="6" width="8" height="8" rx="2" fill="#B8935E"/>
      <rect x="6" y="20" width="4" height="4" rx="1" fill="#9A7A4A"/>
      <rect x="30" y="20" width="4" height="4" rx="1" fill="#9A7A4A"/>
      <rect x="10" y="6" width="20" height="6" rx="2" fill="#D4AF7A"/>
    </svg>
  ),
  'armchair': (
    <svg viewBox="0 0 28 24" width="28" height="24" fill="none">
      <rect x="4" y="8" width="20" height="14" rx="3" fill="#B8834A"/>
      <rect x="0" y="8" width="6" height="10" rx="2" fill="#A07840"/>
      <rect x="22" y="8" width="6" height="10" rx="2" fill="#A07840"/>
      <rect x="4" y="4" width="20" height="8" rx="2" fill="#C9956A"/>
      <rect x="6" y="20" width="3" height="4" rx="1" fill="#8A6030"/>
      <rect x="19" y="20" width="3" height="4" rx="1" fill="#8A6030"/>
    </svg>
  ),
  'coffee-table': (
    <svg viewBox="0 0 36 18" width="36" height="18" fill="none">
      <rect x="2" y="2" width="32" height="10" rx="2" fill="#7C5B3A"/>
      <rect x="4" y="12" width="4" height="6" rx="1" fill="#5C3D2E"/>
      <rect x="28" y="12" width="4" height="6" rx="1" fill="#5C3D2E"/>
    </svg>
  ),
  'dining-table': (
    <svg viewBox="0 0 40 22" width="40" height="22" fill="none">
      <rect x="2" y="4" width="36" height="10" rx="2" fill="#B8834A"/>
      <rect x="2" y="14" width="4" height="8" rx="1" fill="#9A6A35"/>
      <rect x="34" y="14" width="4" height="8" rx="1" fill="#9A6A35"/>
      <rect x="0" y="0" width="8" height="6" rx="1" fill="#D0A068" opacity="0.5"/>
      <rect x="32" y="0" width="8" height="6" rx="1" fill="#D0A068" opacity="0.5"/>
    </svg>
  ),
  'bed-double': (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <rect x="2" y="8" width="36" height="30" rx="3" fill="#8FA3B1"/>
      <rect x="2" y="2" width="36" height="12" rx="3" fill="#7A8E9B"/>
      <rect x="6" y="12" width="12" height="20" rx="2" fill="#A8BCC8"/>
      <rect x="22" y="12" width="12" height="20" rx="2" fill="#A8BCC8"/>
    </svg>
  ),
  'bed-single': (
    <svg viewBox="0 0 28 40" width="22" height="30" fill="none">
      <rect x="2" y="8" width="24" height="30" rx="3" fill="#8FA3B1"/>
      <rect x="2" y="2" width="24" height="12" rx="3" fill="#7A8E9B"/>
      <rect x="5" y="12" width="18" height="20" rx="2" fill="#A8BCC8"/>
    </svg>
  ),
  'wardrobe': (
    <svg viewBox="0 0 36 28" width="36" height="28" fill="none">
      <rect x="1" y="1" width="34" height="26" rx="2" fill="#4A4A4A"/>
      <line x1="18" y1="1" x2="18" y2="27" stroke="#333" strokeWidth="1.5"/>
      <circle cx="15" cy="14" r="1.5" fill="#888"/>
      <circle cx="21" cy="14" r="1.5" fill="#888"/>
      <rect x="1" y="24" width="34" height="3" rx="1" fill="#383838"/>
    </svg>
  ),
  'tv-unit': (
    <svg viewBox="0 0 40 16" width="40" height="16" fill="none">
      <rect x="1" y="1" width="38" height="14" rx="2" fill="#4A4A4A"/>
      <rect x="3" y="3" width="14" height="8" rx="1" fill="#2A2A2A"/>
      <rect x="19" y="3" width="14" height="8" rx="1" fill="#2A2A2A"/>
      <line x1="1" y1="8" x2="39" y2="8" stroke="#383838" strokeWidth="0.5"/>
    </svg>
  ),
  'bookshelf': (
    <svg viewBox="0 0 36 24" width="36" height="24" fill="none">
      <rect x="1" y="1" width="34" height="22" rx="2" fill="#6E5A3E"/>
      <line x1="1" y1="9" x2="35" y2="9" stroke="#5A4830" strokeWidth="1"/>
      <line x1="1" y1="16" x2="35" y2="16" stroke="#5A4830" strokeWidth="1"/>
      <rect x="4" y="3" width="3" height="5" rx="0.5" fill="#C84B4B"/>
      <rect x="8" y="3" width="3" height="5" rx="0.5" fill="#4B8AC8"/>
      <rect x="12" y="4" width="3" height="4" rx="0.5" fill="#4BC870"/>
      <rect x="20" y="3" width="3" height="5" rx="0.5" fill="#C8A84B"/>
      <rect x="4" y="11" width="3" height="4" rx="0.5" fill="#8A4BC8"/>
      <rect x="9" y="11" width="4" height="4" rx="0.5" fill="#4BC8C8"/>
    </svg>
  ),
  'desk': (
    <svg viewBox="0 0 36 22" width="36" height="22" fill="none">
      <rect x="1" y="1" width="34" height="8" rx="2" fill="#B8834A"/>
      <rect x="3" y="9" width="4" height="13" rx="1" fill="#9A6A35"/>
      <rect x="29" y="9" width="4" height="13" rx="1" fill="#9A6A35"/>
      <rect x="22" y="3" width="10" height="4" rx="1" fill="#8A5A2A" opacity="0.5"/>
    </svg>
  ),
};

  const living_items = [
      { furnitureType: 'sofa', label: 'Sofa', x: 20, y: 20, width: 150, height: 60, colour: '#C9A96E', rotation: 0 },
      { furnitureType: 'coffee-table', label: 'Coffee Table', x: 50, y: 100, width: 80, height: 40, colour: '#5C3D2E', rotation: 0 },
      { furnitureType: 'tv-unit', label: 'TV Unit', x: 20, y: 180, width: 120, height: 30, colour: '#4A4A4A', rotation: 0 },
      { furnitureType: 'armchair', label: 'Armchair', x: 200, y: 20, width: 70, height: 70, colour: '#B8834A', rotation: 0 },
    ];
  const bedroom_items = [
      { furnitureType: 'bed-double', label: 'Double Bed', x: 30, y: 30, width: 140, height: 160, colour: '#8FA3B1', rotation: 0 },
      { furnitureType: 'wardrobe', label: 'Wardrobe', x: 200, y: 20, width: 120, height: 50, colour: '#4A4A4A', rotation: 0 },
      { furnitureType: 'desk', label: 'Desk', x: 200, y: 100, width: 100, height: 50, colour: '#B8834A', rotation: 0 },
    ];
  const office_items = [
      { furnitureType: 'desk', label: 'Desk 1', x: 20, y: 20, width: 100, height: 50, colour: '#B8834A', rotation: 0 },
      { furnitureType: 'desk', label: 'Desk 2', x: 20, y: 100, width: 100, height: 50, colour: '#B8834A', rotation: 0 },
      { furnitureType: 'bookshelf', label: 'Bookshelf', x: 200, y: 20, width: 90, height: 25, colour: '#6E5A3E', rotation: 0 },
      { furnitureType: 'armchair', label: 'Armchair', x: 200, y: 80, width: 70, height: 70, colour: '#B8834A', rotation: 0 },
    ];

const ROOM_TEMPLATES: Record<string, { label: string; items: Omit<FurnitureItem, '_id'>[] }> = {
  living:  { label: 'Living Room', items: living_items },
  bedroom: { label: 'Bedroom',     items: bedroom_items },
  office:  { label: 'Office',      items: office_items },
};

const WALL_PRESETS = [
  { name: 'Brilliant White', hex: '#FAFAFA' },
  { name: 'Warm Cream',      hex: '#F5F0E8' },
  { name: 'Sage Green',      hex: '#84A98C' },
  { name: 'Slate Blue',      hex: '#6B89A5' },
  { name: 'Terracotta',      hex: '#C87941' },
  { name: 'Charcoal',        hex: '#3D4042' },
  { name: 'Blush Pink',      hex: '#E8B4B8' },
  { name: 'Dove Grey',       hex: '#9E9E9E' },
];

const FURNITURE_SWATCHES = [
  { name: 'Walnut',   hex: '#6B4226' },
  { name: 'Oak',      hex: '#C9A96E' },
  { name: 'Charcoal', hex: '#4A4A4A' },
  { name: 'Cream',    hex: '#F5F0E8' },
  { name: 'Sage',     hex: '#84A98C' },
  { name: 'Slate',    hex: '#8FA3B1' },
];

export default function RoomEditorPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  const [room, setRoom] = useState<Room | null>(null);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [view, setView] = useState<'2d' | '3d'>('2d');
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ── Canvas ref for PNG export ──────────────────────────────────────────────
  const canvasRef = useRef<Canvas2DHandle>(null);

  // ── Undo / Redo history ────────────────────────────────────────────────────
  const historyRef = useRef<FurnitureItem[][]>([[]]);
  const historyIdxRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const commitHistory = useCallback((items: FurnitureItem[]) => {
    const trimmed = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current = [...trimmed, [...items]];
    historyIdxRef.current = trimmed.length;
    setFurniture(items);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
    setHasUnsavedChanges(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current -= 1;
    setFurniture([...historyRef.current[historyIdxRef.current]]);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current += 1;
    setFurniture([...historyRef.current[historyIdxRef.current]]);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < historyRef.current.length - 1);
  }, []);

  // Keyboard Ctrl+Z / Ctrl+Y / Delete / Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); handleRedo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // only act if focus is NOT in an input/textarea
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          if (selectedId) {
            setFurniture((prev) => {
              const next = prev.filter((item) => (item._id ?? 'unknown') !== selectedId);
              // push to history — only ref mutations here, no setState
              const trimmed = historyRef.current.slice(0, historyIdxRef.current + 1);
              historyRef.current = [...trimmed, [...next]];
              historyIdxRef.current = trimmed.length;
              return next;
            });
            // All setState calls outside any updater (React 18 batches these)
            setSelectedId(null);
            setCanUndo(true);
            setCanRedo(false);
            setHasUnsavedChanges(true);
            toast.success('Furniture removed');
          }
        }
      }
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo, selectedId]);

  // Beforeunload warning when there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleExportPNG = () => {
    const dataUrl = canvasRef.current?.capture();
    if (!dataUrl) { toast.error('Switch to 2D view to export'); return; }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${room?.name ?? 'room'}-design.png`;
    a.click();
    toast.success('Design exported as PNG');
  };

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        const loaded = res.data.data.design?.furnitureItems ?? [];
        setRoom(res.data.data.room);
        document.title = `${res.data.data.room.name} — FurniView`;
        if (loaded.length) {
          setFurniture(loaded);
          historyRef.current = [[...loaded]];
          historyIdxRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);
        }
      } catch {
        toast.error('Room not found');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [isAuthenticated, roomId, router]);

  const getId = (item: FurnitureItem) => item._id ?? 'unknown';

  const handleAddFurniture = (cat: typeof FURNITURE_CATALOGUE[0]) => {
    // Prevent adding furniture larger than the room
    if (room && (cat.w / SCALE > room.width || cat.h / SCALE > room.height)) {
      toast.error(`${cat.label} is too large for this room`);
      return;
    }
    const newItem: FurnitureItem = {
      _id: Math.random().toString(36).slice(2),
      furnitureType: cat.type,
      label: cat.label,
      x: 10,
      y: 10,
      width: cat.w,
      height: cat.h,
      colour: cat.colour,
      rotation: 0,
    };
    commitHistory([...furniture, newItem]);
    toast.success(`${cat.label} added`);
  };

  const handleLoadTemplate = (key: string) => {
    const tmpl = ROOM_TEMPLATES[key];
    if (!tmpl) return;
    if (furniture.length > 0 && !window.confirm(`Replace ${furniture.length} item${furniture.length !== 1 ? 's' : ''} with the "${tmpl.label}" template?`)) return;
    const withIds = tmpl.items.map((item) => ({
      ...item,
      _id: Math.random().toString(36).slice(2),
    })) as FurnitureItem[];
    commitHistory(withIds);
    toast.success(`${tmpl.label} template loaded`);
  };

  const handleMoveFurniture = useCallback((id: string, x: number, y: number) => {
    setFurniture((prev) =>
      prev.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === id ? { ...item, x, y } : item;
      })
    );
  }, []);

  const handleResizeFurniture = useCallback((id: string, x: number, y: number, width: number, height: number) => {
    setFurniture((prev) =>
      prev.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === id ? { ...item, x, y, width, height } : item;
      })
    );
  }, []);

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const next = furniture.filter((item) => getId(item) !== selectedId);
    setSelectedId(null);
    commitHistory(next);
    toast.success('Furniture removed');
  };

  const handleDuplicate = () => {
    if (!selectedItem) return;
    const copy: FurnitureItem = {
      ...selectedItem,
      _id: Math.random().toString(36).slice(2),
      x: selectedItem.x + 15,
      y: selectedItem.y + 15,
    };
    commitHistory([...furniture, copy]);
    toast.success(`${selectedItem.label} duplicated`);
  };

  const handleColourChange = (colour: string) => {
    if (!selectedId) return;
    commitHistory(furniture.map((item) => (getId(item) === selectedId ? { ...item, colour } : item)));
  };

  const handleShadeAll = () => {
    commitHistory(furniture.map((item) => ({ ...item, colour: shadeColour(item.colour, -30) })));
    toast.success('Shading applied to all items');
  };

  const handleWallColourChange = async (newColour: string) => {
    if (!room) return;
    setRoom({ ...room, wallColour: newColour });
    try {
      await api.put(`/rooms/${roomId}`, { wallColour: newColour });
      toast.success('Wall colour updated');
    } catch {
      toast.error('Failed to update wall colour');
    }
  };

  // Sync rename input when selection changes
  useEffect(() => {
    const item = furniture.find((f) => (f._id ?? '') === selectedId);
    setEditLabel(item?.label ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const thumbnailDataUrl = view === '2d' ? (canvasRef.current?.capture() ?? null) : null;
      await api.post(`/rooms/${roomId}/design`, { furnitureItems: furniture, thumbnailDataUrl });
      setHasUnsavedChanges(false);
      toast.success('Design saved!');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      toast.error('Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => { window.print(); };

  const selectedItem = furniture.find((item) => getId(item) === selectedId) || null;

  // Floor area + coverage (for area overlay)
  const floorAreaM2 = room
    ? room.shape === 'l-shape'
      ? room.width * room.height - (room.width / 2) * (room.height / 2)
      : room.width * room.height
    : 0;
  const furnitureAreaM2 = furniture.reduce(
    (sum, item) => sum + (item.width / SCALE) * (item.height / SCALE),
    0,
  );
  const coveragePct = floorAreaM2 > 0 ? Math.min(100, (furnitureAreaM2 / floorAreaM2) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen">
      <div className="print:hidden"><NavBar /></div>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
          <div>
            <button
              onClick={() => {
                if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave anyway?')) return;
                router.push('/dashboard');
              }}
              className="text-xs mb-2 flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{room.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {room.width}m × {room.height}m · {room.shape}
              {' · '}
              <a
                href={`/room/${roomId}/edit`}
                className="hover:underline"
                style={{ color: 'var(--accent)' }}
              >Edit specs</a>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Undo / Redo */}
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              aria-label="Undo (Ctrl+Z)"
              title="Undo (Ctrl+Z)"
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-40 transition-colors min-h-10"
            >↩ Undo</button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              aria-label="Redo (Ctrl+Y)"
              title="Redo (Ctrl+Y)"
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-40 transition-colors min-h-10"
            >↪ Redo</button>
            <button
              onClick={handleExportPNG}
              aria-label="Export as PNG"
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors min-h-10"
            >⬇ PNG</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="relative text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all min-h-10"
              style={{ background: saveSuccess ? 'var(--state-success)' : 'var(--accent)', minWidth: 120 }}
              onMouseOver={e => { if (!saving && !saveSuccess) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseOut={e => (e.currentTarget.style.background = saveSuccess ? 'var(--state-success)' : 'var(--accent)')}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  Saving…
                </span>
              ) : saveSuccess ? 'Saved ✓' : 'Save Design'}
              {hasUnsavedChanges && !saving && !saveSuccess && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white" title="Unsaved changes" />
              )}
            </button>
            <button
              onClick={handlePrint}
              aria-label="Print design"
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors min-h-10"
            >🖨 Print</button>
            <button
              onClick={() => setView((v) => (v === '2d' ? '3d' : '2d'))}
              aria-pressed={view === '3d'}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors min-h-10"
            >
              {view === '2d' ? 'View 3D' : 'Back to 2D'}
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        {view === '2d' && (
          <div className="mb-3 flex flex-wrap gap-3 print:hidden" style={{ fontSize: 11 }}>
            {[
              { key: 'Ctrl+Z', label: 'Undo' },
              { key: 'Ctrl+Y', label: 'Redo' },
              { key: 'Del', label: 'Remove selected' },
              { key: 'Esc', label: 'Deselect' },
              { key: 'Drag handles', label: 'Resize' },
            ].map(({ key, label }) => (
              <span key={key} style={{ color: 'var(--text-muted)' }}>
                <kbd style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontFamily: 'inherit', fontSize: 10 }}>{key}</kbd>
                {' '}{label}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-6 flex-wrap lg:flex-nowrap">
          {/* Canvas / 3D Scene */}
          <div className="flex-1 min-w-0 overflow-auto">
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12 text-sm text-red-600">
                  Visualiser failed to load — try refreshing the page.
                </div>
              }
            >
            {view === '2d' ? (
              <>
              <Canvas2D
                ref={canvasRef}
                roomWidth={room.width}
                roomHeight={room.height}
                roomName={room.name}
                wallColour={room.wallColour}
                shape={room.shape}
                furniture={furniture}
                selectedId={selectedId}
                onSelectFurniture={setSelectedId}
                onMoveFurniture={handleMoveFurniture}
                onResizeFurniture={handleResizeFurniture}
                snapToGrid={snapToGrid}
              />
              {/* Selected item coordinate readout */}
              {selectedItem && (
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 rounded-lg px-3 py-1.5" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{selectedItem.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>x: <strong style={{ color: 'var(--text-primary)' }}>{(selectedItem.x / SCALE).toFixed(2)} m</strong></span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>y: <strong style={{ color: 'var(--text-primary)' }}>{(selectedItem.y / SCALE).toFixed(2)} m</strong></span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{(selectedItem.width / SCALE).toFixed(2)} × {(selectedItem.height / SCALE).toFixed(2)} m</span>
                </div>
              )}
              {/* Area overlay */}
              <p className="mt-1.5 text-xs" aria-live="polite" style={{ color: 'var(--text-muted)' }}>
                Floor area: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{floorAreaM2.toFixed(1)} m²</span>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                Furniture coverage: <span style={{ color: coveragePct > 70 ? '#EF4444' : coveragePct > 50 ? '#F59E0B' : 'var(--text-primary)', fontWeight: 500 }}>{coveragePct.toFixed(0)}%{coveragePct > 70 ? ' ⚠ Room may feel cramped' : ''}</span>
              </p>
              </>
            ) : (
              <Scene3D
                roomWidth={room.width}
                roomHeight={room.height}
                wallColour={room.wallColour}
                shape={room.shape}
                furniture={furniture}
              />
            )}
            </ErrorBoundary>
          </div>

          {/* Right panel */}
          <div className="w-full lg:w-72 space-y-4 shrink-0 print:hidden">
            {/* Wall colour */}
            <div className="bg-white border p-4" style={{ borderRadius: 14, borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Room Settings</h3>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Wall Colour</label>
              {/* Colour presets */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {WALL_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    title={p.name}
                    aria-label={p.name}
                    onClick={() => handleWallColourChange(p.hex)}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-indigo-400"
                    style={{
                      backgroundColor: p.hex,
                      borderColor: room.wallColour.toLowerCase() === p.hex.toLowerCase() ? '#6366f1' : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={room.wallColour}
                onChange={(e) => handleWallColourChange(e.target.value)}
                className="h-10 w-full rounded-lg cursor-pointer p-1"
                style={{ border: '1px solid var(--border)' }}
              />
              <button
                onClick={handleShadeAll}
                className="mt-2 w-full text-xs py-1.5 rounded-lg transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                Apply Shade to All Furniture
              </button>
              <label className="block text-xs mt-3 mb-1" style={{ color: 'var(--text-muted)' }}>Apply Colour to All Furniture</label>
              <input
                type="color"
                defaultValue="#C9A96E"
                onChange={(e) => {
                  const c = e.target.value;
                  commitHistory(furniture.map((item) => ({ ...item, colour: c })));
                  toast.success('Colour applied to all furniture');
                }}
                className="h-10 w-full rounded-lg cursor-pointer p-1"
                style={{ border: '1px solid var(--border)' }}
              />
              {/* Snap to grid */}
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Snap to grid (0.5 m)</span>
              </label>
            </div>

            {/* Selected item controls */}
            {selectedItem && (
              <div className="bg-white border p-4" style={{ borderRadius: 14, borderColor: '#C7D2FE', boxShadow: 'var(--shadow-sm)' }}>
                {/* Rename label */}
                <div className="mb-1">
                  <label className="block text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Label</label>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onBlur={() => {
                      if (!selectedId || !editLabel.trim()) return;
                      commitHistory(
                        furniture.map((item) =>
                          getId(item) === selectedId ? { ...item, label: editLabel.trim() } : item,
                        ),
                      );
                    }}
                    className="w-full text-sm font-semibold rounded-lg px-2 py-1"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  {(selectedItem.width / SCALE).toFixed(2)} m W &times; {(selectedItem.height / SCALE).toFixed(2)} m D
                </p>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Furniture Colour</label>
                {/* Preset swatches */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {FURNITURE_SWATCHES.map((sw) => (
                    <button
                      key={sw.hex}
                      title={sw.name}
                      aria-label={sw.name}
                      onClick={() => handleColourChange(sw.hex)}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-indigo-400"
                      style={{
                        backgroundColor: sw.hex,
                        borderColor: selectedItem.colour.toLowerCase() === sw.hex.toLowerCase() ? '#6366f1' : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selectedItem.colour}
                  onChange={(e) => handleColourChange(e.target.value)}
                  className="h-10 w-full rounded-lg cursor-pointer p-1 mb-2"
                  style={{ border: '1px solid var(--border)' }}
                />
                <button
                  onClick={() => {
                    if (!selectedId) return;
                    commitHistory(furniture.map((item) =>
                      getId(item) === selectedId
                        ? { ...item, colour: shadeColour(item.colour, -30) }
                        : item
                    ));
                    toast.success('Shading applied to selected item');
                  }}
                  className="w-full text-xs py-1.5 rounded-lg transition-colors mb-2"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-inset)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Darken Shade (Selected)
                </button>
                <button
                  onClick={() => {
                    if (!selectedId) return;
                    commitHistory(furniture.map((item) =>
                      getId(item) === selectedId
                        ? { ...item, rotation: (item.rotation + 90) % 360 }
                        : item
                    ));
                  }}
                  className="w-full text-xs py-1.5 rounded-lg transition-colors mb-1"
                  style={{ color: 'var(--accent)', border: '1px solid #C7D2FE' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#EEF2FF')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Rotate 90°
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full text-xs py-1.5 rounded-lg transition-colors mb-1"
                  style={{ color: 'var(--accent)', border: '1px solid #C7D2FE' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#EEF2FF')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Duplicate
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="w-full text-xs py-1.5 rounded-lg transition-colors"
                  style={{ color: '#EF4444', border: '1px solid #FECACA' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#FEF2F2')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Remove Furniture
                </button>
              </div>
            )}

            {/* Furniture catalogue */}
            <div className="bg-white border p-4" style={{ borderRadius: 14, borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add Furniture</h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{furniture.length} items</span>
              </div>
              {/* Templates */}
              <div className="mb-3">
                <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Quick templates</p>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(ROOM_TEMPLATES).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => handleLoadTemplate(key)}
                      className="text-xs font-medium rounded-lg transition-colors"
                      style={{ background: '#EEF2FF', color: 'var(--accent)', border: '1px solid #C7D2FE', height: 32, padding: '0 10px' }}
                      onMouseOver={e => (e.currentTarget.style.background = '#E0E7FF')}
                      onMouseOut={e => (e.currentTarget.style.background = '#EEF2FF')}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { label: 'Seating',  types: ['sofa', 'armchair'] },
                { label: 'Surfaces', types: ['coffee-table', 'dining-table', 'tv-unit', 'bookshelf', 'desk'] },
                { label: 'Sleeping', types: ['bed-double', 'bed-single', 'wardrobe'] },
              ].map((section) => (
                <div key={section.label} className="mb-3 last:mb-0">
                  <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                    {section.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FURNITURE_CATALOGUE.filter(c => section.types.includes(c.type)).map((cat) => (
                      <button
                        key={cat.type}
                        onClick={() => handleAddFurniture(cat)}
                        aria-label={`Add ${cat.label}`}
                        title={`${cat.label} — ${(cat.w / SCALE).toFixed(1)} m × ${(cat.h / SCALE).toFixed(1)} m`}
                        className="flex flex-col items-center gap-1.5 rounded-xl transition-all text-center"
                        style={{
                          border: '1px solid var(--border)',
                          padding: '10px 6px 8px',
                          background: 'transparent',
                          minHeight: 72,
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#F0F2F6'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <div style={{ opacity: 0.9 }}>{FURNITURE_SVGS[cat.type]}</div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function shadeColour(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
