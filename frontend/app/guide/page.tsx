'use client';

import NavBar from '@/components/NavBar';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Create a Room',
    icon: '🏠',
    colour: '#EEF2FF',
    accent: '#6366F1',
    description: 'Click "+ New Room" in the navigation bar. Give your room a name, set its width and height in metres, choose rectangle or L-shape, and pick a wall colour.',
    tips: ['Tip: Most living rooms are 4–7 m wide', 'Tip: L-shape mode cuts the top-right corner by 50%'],
  },
  {
    number: '02',
    title: 'Add Furniture',
    icon: '🛋️',
    colour: '#F0FDF4',
    accent: '#22C55E',
    description: 'In the room editor, click any item in the right-hand furniture catalogue to add it to the canvas. Items drop near the top-left corner — drag them to position.',
    tips: ['Tip: Drag items anywhere on the floor plan', 'Tip: Use "Apply Template" to auto-fill a standard layout'],
  },
  {
    number: '03',
    title: 'Arrange & Customise',
    icon: '✏️',
    colour: '#FFFBEB',
    accent: '#F59E0B',
    description: 'Click a placed item to select it. Use the panel on the right to rotate it (90°), change its colour, or rename its label. Ctrl+Z / Ctrl+Y to undo and redo.',
    tips: ['Tip: Rotation is in 90° increments', 'Tip: Click the label field to rename any item inline on the canvas'],
  },
  {
    number: '04',
    title: 'Check Dimensions',
    icon: '📐',
    colour: '#FFF1F2',
    accent: '#F43F5E',
    description: 'The scale ruler along the top and left edges shows metres. The info bar below the canvas shows the room area (m²) and how much floor space your furniture covers.',
    tips: ['Tip: Click an item to see its exact W × D in metres', 'Tip: Keep coverage below 60% for comfortable spacing'],
  },
  {
    number: '05',
    title: 'Switch to 3D View',
    icon: '🎮',
    colour: '#F0F9FF',
    accent: '#0EA5E9',
    description: 'Toggle "3D View" at the top to see a Three.js rendered preview of your room. Orbit with your mouse, scroll to zoom, and right-click to pan.',
    tips: ['Tip: The 3D view mirrors your 2D layout exactly', 'Tip: Wall colour from the 2D planner is applied to the 3D walls'],
  },
  {
    number: '06',
    title: 'Save & Export',
    icon: '💾',
    colour: '#F5F3FF',
    accent: '#8B5CF6',
    description: 'Click "Save Design" to persist your layout to the cloud. Use the "Print" button to export a print-ready PDF — the sidebar and header are hidden in the printout.',
    tips: ['Tip: Designs auto-associate with your account', 'Tip: Print to PDF for a clean floor plan handout'],
  },
];

const faqs = [
  {
    q: 'Can I have multiple rooms?',
    a: 'Yes — your dashboard shows all saved rooms. Click "+ New Room" as many times as you like.',
  },
  {
    q: 'Is my data saved automatically?',
    a: 'No, you must click "Save Design" explicitly. Unsaved changes are flagged with an indicator in the editor.',
  },
  {
    q: 'What is the difference between rectangle and L-shape?',
    a: 'Rectangle fills the full W × H area. L-shape removes the top-right quarter (W/2 × H/2), creating an L-shaped floor plan.',
  },
  {
    q: 'How do I delete a furniture item?',
    a: 'Select the item on the canvas, then click the "Remove" button in the right panel, or press the Delete key.',
  },
  {
    q: 'Can I resize furniture items?',
    a: 'Not by dragging — set the exact size in the right-hand panel when an item is selected.',
  },
  {
    q: "How do I change a room's wall colour after creation?",
    a: "In the room editor, use the wall colour picker and presets in the right panel. The change is reflected immediately on both 2D and 3D views.",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <NavBar />

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 55%, #111827 100%)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1555041469-f01abe21b32c?w=1400&q=60&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none"
        />
        <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">User Guide</p>
          <h1 className="text-3xl font-bold text-white mb-3">How to use FurniView</h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Design and visualise furniture layouts in 2D and 3D — from creating your first room
            to printing a finished floor plan.
          </p>
          <Link
            href="/room/new"
            className="inline-flex items-center gap-2 mt-6 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Start Designing →
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* ── Step-by-step ── */}
        <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Step-by-step walkthrough
        </h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card p-6 flex gap-5"
            >
              {/* Icon bubble */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: step.colour }}
              >
                {step.icon}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-widest" style={{ color: step.accent }}>
                    STEP {step.number}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.tips.map((tip) => (
                    <li key={tip} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="mt-0.5 shrink-0" style={{ color: step.accent }}>✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── Keyboard shortcuts ── */}
        <h2 className="text-lg font-bold mt-12 mb-5" style={{ color: 'var(--text-primary)' }}>
          Keyboard shortcuts
        </h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)', background: '#F8FAFC' }}>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Shortcut</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Ctrl + Z', 'Undo last action'],
                ['Ctrl + Y', 'Redo last action'],
                ['Delete / Backspace', 'Remove selected item'],
                ['Click item', 'Select and inspect item'],
                ['Drag item', 'Move item on the floor plan'],
                ['Ctrl + P', 'Print / export floor plan'],
              ].map(([key, action], i) => (
                <tr
                  key={key}
                  className="border-b last:border-0"
                  style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}
                >
                  <td className="px-5 py-3">
                    <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {key}
                    </kbd>
                  </td>
                  <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── FAQs ── */}
        <h2 className="text-lg font-bold mt-12 mb-5" style={{ color: 'var(--text-primary)' }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-5">
              <p className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(160deg, #0F172A, #1E293B)' }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Ready to design?</h3>
          <p className="text-slate-400 text-sm mb-5">Create your first room in under a minute.</p>
          <Link
            href="/room/new"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            + New Room
          </Link>
        </div>

      </main>
    </div>
  );
}
