'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * A single piece of furniture placed in the 2-D floor plan.
 * Positions and dimensions are in canvas pixels; divide by {@link SCALE} to get metres.
 */
export interface FurnitureItem {
  _id?: string;
  furnitureType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  rotation: number;
  label: string;
}

/** Imperative handle exposed via `ref` so parent components can capture a PNG snapshot. */
export interface Canvas2DHandle {
  /** Returns the canvas contents as a PNG data-URL, or `null` if the canvas is not mounted. */
  capture: () => string | null;
}

type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

type DragState =
  | { mode: 'move'; id: string; offsetX: number; offsetY: number }
  | { mode: 'resize'; id: string; handle: HandleType; startCx: number; startCy: number; origX: number; origY: number; origW: number; origH: number }
  | null;

interface Props {
  roomWidth: number;
  roomHeight: number;
  roomName?: string;
  wallColour: string;
  shape: 'rectangle' | 'l-shape';
  furniture: FurnitureItem[];
  selectedId: string | null;
  onSelectFurniture: (id: string | null) => void;
  onMoveFurniture: (id: string, x: number, y: number) => void;
  onResizeFurniture?: (id: string, x: number, y: number, width: number, height: number) => void;
  snapToGrid?: boolean;
}

/** Pixels per metre used for scaling furniture and room dimensions on the canvas. */
export const SCALE = 60;
/** Canvas padding (px) reserved for scale rulers along the top and left edges. */
const PADDING = 45;

const Canvas2D = forwardRef<Canvas2DHandle, Props>(function Canvas2D(
  { roomWidth, roomHeight, roomName, wallColour, shape, furniture, selectedId, onSelectFurniture, onMoveFurniture, onResizeFurniture, snapToGrid = false },
  ref,
) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // Local copy of furniture positions — updated every pixel during drag,
  // so React never re-renders on mousemove.
  const localItems  = useRef<FurnitureItem[]>(furniture);
  const selectedRef = useRef<string | null>(selectedId);
  const dragRef     = useRef<DragState>(null);
  const rafRef      = useRef<number | null>(null);
  const isDragging  = useRef(false);

  const canvasWidth  = roomWidth  * SCALE + PADDING * 2;
  const canvasHeight = roomHeight * SCALE + PADDING * 2;

  useImperativeHandle(ref, () => ({
    capture: () => canvasRef.current?.toDataURL('image/png') ?? null,
  }));

  // ── Draw ──────────────────────────────────────────────────────────────────
  const drawScene = useCallback((items: FurnitureItem[], selId: string | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ── Scale rulers ────────────────────────────────────────────────────────
    ctx.save();
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, PADDING);          // top ruler bg
    ctx.fillRect(0, 0, PADDING, canvas.height);         // left ruler bg
    // Horizontal ruler (metres along width)
    for (let m = 0; m <= roomWidth; m++) {
      const x = PADDING + m * SCALE;
      const isMajor = true;
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, PADDING - (isMajor ? 8 : 4));
      ctx.lineTo(x, PADDING);
      ctx.stroke();
      // half-metre sub-tick
      if (m < roomWidth) {
        const hx = x + SCALE / 2;
        ctx.beginPath();
        ctx.moveTo(hx, PADDING - 4);
        ctx.lineTo(hx, PADDING);
        ctx.stroke();
      }
      if (m > 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${m}`, x, PADDING / 2);
      }
    }
    // Vertical ruler (metres along height)
    for (let m = 0; m <= roomHeight; m++) {
      const y = PADDING + m * SCALE;
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PADDING - 8, y);
      ctx.lineTo(PADDING, y);
      ctx.stroke();
      if (m < roomHeight) {
        const hy = y + SCALE / 2;
        ctx.beginPath();
        ctx.moveTo(PADDING - 4, hy);
        ctx.lineTo(PADDING, hy);
        ctx.stroke();
      }
      if (m > 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(PADDING / 2, y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${m}`, 0, 0);
        ctx.restore();
      }
    }
    // Ruler unit label
    ctx.fillStyle = '#9ca3af';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('m', PADDING / 2, PADDING / 2);
    ctx.restore();

    // Floor
    ctx.fillStyle = '#e5e0d8';
    if (shape === 'rectangle') {
      ctx.fillRect(PADDING, PADDING, roomWidth * SCALE, roomHeight * SCALE);
    } else {
      const hw = Math.round(roomWidth  / 2) * SCALE;
      const hh = Math.round(roomHeight / 2) * SCALE;
      ctx.beginPath();
      ctx.moveTo(PADDING, PADDING);
      ctx.lineTo(PADDING + hw, PADDING);
      ctx.lineTo(PADDING + hw, PADDING + hh);
      ctx.lineTo(PADDING + roomWidth * SCALE,  PADDING + hh);
      ctx.lineTo(PADDING + roomWidth * SCALE,  PADDING + roomHeight * SCALE);
      ctx.lineTo(PADDING, PADDING + roomHeight * SCALE);
      ctx.closePath();
      ctx.fill();
    }

    // Walls
    ctx.strokeStyle = wallColour === '#FFFFFF' || wallColour === '#ffffff' ? '#cccccc' : wallColour;
    ctx.lineWidth = 8;
    if (shape === 'rectangle') {
      ctx.strokeRect(PADDING, PADDING, roomWidth * SCALE, roomHeight * SCALE);
    } else {
      const hw = Math.round(roomWidth  / 2) * SCALE;
      const hh = Math.round(roomHeight / 2) * SCALE;
      ctx.beginPath();
      ctx.moveTo(PADDING, PADDING);
      ctx.lineTo(PADDING + hw, PADDING);
      ctx.lineTo(PADDING + hw, PADDING + hh);
      ctx.lineTo(PADDING + roomWidth * SCALE, PADDING + hh);
      ctx.lineTo(PADDING + roomWidth * SCALE, PADDING + roomHeight * SCALE);
      ctx.lineTo(PADDING, PADDING + roomHeight * SCALE);
      ctx.closePath();
      ctx.stroke();
    }

    // Dimension label (centred in top ruler strip)
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${roomWidth}m × ${roomHeight}m`, PADDING + (roomWidth * SCALE) / 2, PADDING / 2);

    // Room name label (top-left inside floor area)
    if (roomName) {
      ctx.fillStyle = 'rgba(107,114,128,0.7)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(roomName, PADDING + 6, PADDING + 5);
    }

    // Furniture
    items.forEach((item) => {
      const isSelected = selId !== null && (item._id === selId || getId(item) === selId);

      ctx.save();
      ctx.translate(PADDING + item.x + item.width / 2, PADDING + item.y + item.height / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);

      if (isSelected) {
        ctx.shadowColor = 'rgba(99,102,241,0.45)';
        ctx.shadowBlur  = 18;
      }

      const grad = ctx.createLinearGradient(-item.width / 2, -item.height / 2, item.width / 2, item.height / 2);
      grad.addColorStop(0, item.colour);
      grad.addColorStop(1, shadeColour(item.colour, -25));
      ctx.fillStyle   = grad;

      ctx.beginPath();
      ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border: dashed indigo when selected, subtle otherwise
      if (isSelected) {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth   = 2;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(0,0,0,0.14)';
        ctx.lineWidth   = 1;
      }
      ctx.beginPath();
      ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // 8-point resize handles on selected items
      if (isSelected) {
        const hw = item.width / 2;
        const hh = item.height / 2;
        const hSize = 8;
        const handles: [number, number][] = [
          [-hw, -hh], [0, -hh], [hw, -hh],
          [hw,  0],
          [hw,  hh], [0,  hh], [-hw,  hh],
          [-hw, 0],
        ];
        handles.forEach(([hx, hy]) => {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.fillRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
          ctx.strokeRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
        });
      }

      // Label: Inter, 10px, uppercase, letter-spaced
      const fontSize = Math.min(10, Math.floor(item.width / 5));
      ctx.fillStyle    = isDragging.current && dragRef.current?.id === (item._id ?? '') ? '#333' : '#2d2d2d';
      ctx.font         = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      // Approximate letter-spacing by measuring and spacing manually
      const text = (item.label || item.furnitureType).toUpperCase();
      ctx.fillText(text, 0, 0);

      ctx.restore();
    });
  }, [roomWidth, roomHeight, roomName, wallColour, shape]);  // furniture & selectedId intentionally excluded

  // ── Sync from props (only when not dragging) ──────────────────────────────
  useEffect(() => {
    if (!isDragging.current) {
      localItems.current  = furniture;
      selectedRef.current = selectedId;
      drawScene(localItems.current, selectedRef.current);
    }
  }, [furniture, selectedId, drawScene]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getId = (item: FurnitureItem) =>
    item._id ?? (item.furnitureType + '_' + item.furnitureType); // stable key

  // Hit-test using the item's index-stable identity
  const getItemAt = (cx: number, cy: number): FurnitureItem | null => {
    for (let i = localItems.current.length - 1; i >= 0; i--) {
      const item = localItems.current[i];
      const ix = PADDING + item.x;
      const iy = PADDING + item.y;
      if (cx >= ix && cx <= ix + item.width && cy >= iy && cy <= iy + item.height) {
        return item;
      }
    }
    return null;
  };

  const getHandleAt = (cx: number, cy: number, item: FurnitureItem): HandleType | null => {
    const centerX = PADDING + item.x + item.width / 2;
    const centerY = PADDING + item.y + item.height / 2;
    const rad = (item.rotation * Math.PI) / 180;
    const dx = cx - centerX;
    const dy = cy - centerY;
    const lx = dx * Math.cos(-rad) - dy * Math.sin(-rad);
    const ly = dx * Math.sin(-rad) + dy * Math.cos(-rad);
    const hw = item.width / 2;
    const hh = item.height / 2;
    const THRESHOLD = 10;
    const positions: [HandleType, number, number][] = [
      ['nw', -hw, -hh], ['n', 0, -hh], ['ne', hw, -hh],
      ['e',   hw,  0],
      ['se',  hw,  hh], ['s', 0, hh], ['sw', -hw, hh],
      ['w',  -hw,  0],
    ];
    for (const [name, hx, hy] of positions) {
      if (Math.abs(lx - hx) <= THRESHOLD && Math.abs(ly - hy) <= THRESHOLD) {
        return name;
      }
    }
    return null;
  };

  // ── Mouse events ─────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width  / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const cx = (e.clientX - rect.left)  * scaleX;
    const cy = (e.clientY - rect.top)   * scaleY;

    // Check for resize handle hit on the currently selected item first
    if (selectedRef.current !== null) {
      const selItem = localItems.current.find((item, idx) =>
        (item._id ?? String(idx)) === selectedRef.current,
      );
      if (selItem) {
        const handle = getHandleAt(cx, cy, selItem);
        if (handle !== null) {
          const id = selItem._id ?? String(localItems.current.indexOf(selItem));
          isDragging.current = true;
          dragRef.current = {
            mode: 'resize',
            id,
            handle,
            startCx: cx,
            startCy: cy,
            origX: selItem.x,
            origY: selItem.y,
            origW: selItem.width,
            origH: selItem.height,
          };
          canvasRef.current!.style.cursor = 'nwse-resize';
          return;
        }
      }
    }

    const hit = getItemAt(cx, cy);
    if (hit) {
      const id = hit._id ?? String(localItems.current.indexOf(hit));
      // Update selection ref + notify React (cheap — one state update)
      selectedRef.current = id;
      onSelectFurniture(id);

      isDragging.current = true;
      dragRef.current    = {
        mode: 'move',
        id,
        offsetX: cx - (PADDING + hit.x),
        offsetY: cy - (PADDING + hit.y),
      };
      canvasRef.current!.style.cursor = 'grabbing';
    } else {
      selectedRef.current = null;
      onSelectFurniture(null);
      drawScene(localItems.current, null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectFurniture, drawScene]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !isDragging.current) return;
    e.preventDefault();

    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width  / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top)  * scaleY;

    const state = dragRef.current;

    if (state.mode === 'move') {
      const GRID = 30; // 0.5 m per cell
      const rawX = cx - state.offsetX - PADDING;
      const rawY = cy - state.offsetY - PADDING;
      const newX = Math.max(0, Math.min(
        snapToGrid ? Math.round(rawX / GRID) * GRID : rawX,
        roomWidth  * SCALE - 10,
      ));
      const newY = Math.max(0, Math.min(
        snapToGrid ? Math.round(rawY / GRID) * GRID : rawY,
        roomHeight * SCALE - 10,
      ));
      const dragId = state.id;
      // Update local ref — zero React re-renders
      localItems.current = localItems.current.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === dragId ? { ...item, x: newX, y: newY } : item;
      });
    } else if (state.mode === 'resize') {
      const dx = cx - state.startCx;
      const dy = cy - state.startCy;
      const { id: dragId, handle, origX, origY, origW, origH } = state;

      let newX = origX;
      let newY = origY;
      let newW = origW;
      let newH = origH;

      switch (handle) {
        case 'nw':
          newW = Math.max(20, origW - dx);
          newH = Math.max(20, origH - dy);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'n':
          newH = Math.max(20, origH - dy);
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'ne':
          newW = Math.max(20, origW + dx);
          newH = Math.max(20, origH - dy);
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'e':
          newW = Math.max(20, origW + dx);
          break;
        case 'se':
          newW = Math.max(20, origW + dx);
          newH = Math.max(20, origH + dy);
          break;
        case 's':
          newH = Math.max(20, origH + dy);
          break;
        case 'sw':
          newW = Math.max(20, origW - dx);
          newH = Math.max(20, origH + dy);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          break;
        case 'w':
          newW = Math.max(20, origW - dx);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          break;
      }

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      if (newX + newW > roomWidth  * SCALE) newW = roomWidth  * SCALE - newX;
      if (newY + newH > roomHeight * SCALE) newH = roomHeight * SCALE - newY;
      newW = Math.max(20, newW);
      newH = Math.max(20, newH);

      localItems.current = localItems.current.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === dragId
          ? { ...item, x: newX, y: newY, width: newW, height: newH }
          : item;
      });
    }

    // Schedule canvas redraw via rAF — at most once per frame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        drawScene(localItems.current, selectedRef.current);
      });
    }
  }, [roomWidth, roomHeight, snapToGrid, drawScene]);

  const commitDrag = useCallback(() => {
    if (!isDragging.current || !dragRef.current) return;
    isDragging.current = false;
    canvasRef.current!.style.cursor = 'default';

    const state = dragRef.current;
    const dragId = state.id;
    const moved  = localItems.current.find((item, idx) =>
      (item._id ?? String(idx)) === dragId,
    );
    dragRef.current = null;

    if (state.mode === 'resize' && moved && onResizeFurniture) {
      onResizeFurniture(dragId, moved.x, moved.y, moved.width, moved.height);
    } else if (state.mode === 'move' && moved) {
      // Single React state commit — triggers one re-render + redraw
      onMoveFurniture(dragId, moved.x, moved.y);
    }
  }, [onMoveFurniture, onResizeFurniture]);

  const handleMouseUp   = useCallback(() => { commitDrag(); }, [commitDrag]);
  const handleMouseLeave = useCallback(() => { commitDrag(); }, [commitDrag]);

  // ── Touch events (thin wrappers over mouse logic) ─────────────────────────
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      cx: (clientX - rect.left) * (canvasRef.current!.width  / rect.width),
      cy: (clientY - rect.top)  * (canvasRef.current!.height / rect.height),
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    const { cx, cy } = getCanvasCoords(t.clientX, t.clientY);

    // Check for resize handle hit on the currently selected item first
    if (selectedRef.current !== null) {
      const selItem = localItems.current.find((item, idx) =>
        (item._id ?? String(idx)) === selectedRef.current,
      );
      if (selItem) {
        const handle = getHandleAt(cx, cy, selItem);
        if (handle !== null) {
          const id = selItem._id ?? String(localItems.current.indexOf(selItem));
          isDragging.current = true;
          dragRef.current = {
            mode: 'resize',
            id,
            handle,
            startCx: cx,
            startCy: cy,
            origX: selItem.x,
            origY: selItem.y,
            origW: selItem.width,
            origH: selItem.height,
          };
          return;
        }
      }
    }

    const hit = getItemAt(cx, cy);
    if (hit) {
      const id = hit._id ?? String(localItems.current.indexOf(hit));
      selectedRef.current = id;
      onSelectFurniture(id);
      isDragging.current = true;
      dragRef.current = { mode: 'move', id, offsetX: cx - (PADDING + hit.x), offsetY: cy - (PADDING + hit.y) };
    } else {
      selectedRef.current = null;
      onSelectFurniture(null);
      drawScene(localItems.current, null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectFurniture, drawScene]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !isDragging.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const { cx, cy } = getCanvasCoords(t.clientX, t.clientY);

    const state = dragRef.current;

    if (state.mode === 'move') {
      const GRID = 30;
      const rawX = cx - state.offsetX - PADDING;
      const rawY = cy - state.offsetY - PADDING;
      const newX = Math.max(0, Math.min(snapToGrid ? Math.round(rawX / GRID) * GRID : rawX, roomWidth  * SCALE - 10));
      const newY = Math.max(0, Math.min(snapToGrid ? Math.round(rawY / GRID) * GRID : rawY, roomHeight * SCALE - 10));
      const dragId = state.id;
      localItems.current = localItems.current.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === dragId ? { ...item, x: newX, y: newY } : item;
      });
    } else if (state.mode === 'resize') {
      const dx = cx - state.startCx;
      const dy = cy - state.startCy;
      const { id: dragId, handle, origX, origY, origW, origH } = state;

      let newX = origX;
      let newY = origY;
      let newW = origW;
      let newH = origH;

      switch (handle) {
        case 'nw':
          newW = Math.max(20, origW - dx);
          newH = Math.max(20, origH - dy);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'n':
          newH = Math.max(20, origH - dy);
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'ne':
          newW = Math.max(20, origW + dx);
          newH = Math.max(20, origH - dy);
          newY = newH > 20 ? origY + dy : origY + origH - 20;
          break;
        case 'e':
          newW = Math.max(20, origW + dx);
          break;
        case 'se':
          newW = Math.max(20, origW + dx);
          newH = Math.max(20, origH + dy);
          break;
        case 's':
          newH = Math.max(20, origH + dy);
          break;
        case 'sw':
          newW = Math.max(20, origW - dx);
          newH = Math.max(20, origH + dy);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          break;
        case 'w':
          newW = Math.max(20, origW - dx);
          newX = newW > 20 ? origX + dx : origX + origW - 20;
          break;
      }

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      if (newX + newW > roomWidth  * SCALE) newW = roomWidth  * SCALE - newX;
      if (newY + newH > roomHeight * SCALE) newH = roomHeight * SCALE - newY;
      newW = Math.max(20, newW);
      newH = Math.max(20, newH);

      localItems.current = localItems.current.map((item, idx) => {
        const itemId = item._id ?? String(idx);
        return itemId === dragId
          ? { ...item, x: newX, y: newY, width: newW, height: newH }
          : item;
      });
    }

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        drawScene(localItems.current, selectedRef.current);
      });
    }
  }, [snapToGrid, roomWidth, roomHeight, drawScene]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    commitDrag();
  }, [commitDrag]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="rounded-xl max-w-full touch-none"
      style={{ cursor: 'default', border: '1px solid #E8E6E0', background: '#FAFAF8' }}
      role="img"
      aria-label={`2D floor plan: ${roomName ? roomName + ', ' : ''}${roomWidth}m × ${roomHeight}m ${shape} room with ${furniture.length} furniture items`}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
});

export default Canvas2D;

function shadeColour(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r   = Math.min(255, Math.max(0, (num >> 16)         + percent));
  const g   = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b   = Math.min(255, Math.max(0, (num & 0xff)        + percent));
  return `rgb(${r},${g},${b})`;
}

function getId(item: FurnitureItem): string {
  return item._id ?? (item.furnitureType + item.x + item.y);
}
