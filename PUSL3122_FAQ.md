# PUSL3122 — FAQ Clarifications & Tech Stack Guide

## Key FAQ Clarifications (From Dr Bakhshi)

### Technology
- **Any technology is acceptable** — no need to use Java/Swing
- Desktop or web-based application — your choice
- No hosting required — localhost is fine for demo and video recording

### User Accounts (Important — 2 Required)
| Account Type | Who | What They Do |
|---|---|---|
| **Admin** | Furniture shop staff | Shows visualizations to customers physically in-store |
| **User** | Anyone | Uses app independently — in-shop or from home/office |

Both accounts share the same functional and non-functional requirements.

### 3D & Room Layout
- **6–7 room designs** with **8–10 furniture objects** is sufficient
- **Pre-built 3D objects are allowed** — no need to model from scratch (use GLTF/GLB files)
- 3D furniture should ideally be **moveable within the room**
- 360° rotation and zoom is **ideal but not penalised** if missing — just document it in limitations
- Wall colour change is the **minimum** customisation required
- Floor can be a neutral fixed colour if you choose

### GitHub
- Only **one group member** needs to make commits — not every member required

### Report
- Keep Agile/Scrum evidence **minimal in main body** — put extra detail in appendix
- A few UI snapshots in main body — rest can go in appendix
- **No need to put code in appendix** — GitHub link on front page is sufficient
- Small code snippets in report body are optional but welcome

---

## Recommended Stack

### Overview
| Layer | Technology | Replaces |
|---|---|---|
| Frontend UI | **Next.js + React** | Java Swing |
| 2D Rendering | **HTML5 Canvas API** | Java Graphics2D |
| 3D Rendering | **Three.js** | Java3D / JOGL |
| Backend | **Express (Node.js)** | Java file I/O |
| Database | **SQLite or PostgreSQL** | File-based persistence |
| Language | **TypeScript** throughout | Java |

### Why This Stack Works

**Next.js** handles the UI layer cleanly — pages, routing, and React components map directly to the MVC pattern required for 60%+.

**Canvas API** covers all 2D requirements — drawing room outlines, placing furniture shapes, proportional scaling, colour fill, and shading/gradients are all native Canvas features.

**Three.js** covers the 3D requirement — import pre-built GLTF/GLB furniture models, position them in a 3D room, add basic lighting, and enable mouse-based rotation/zoom. Satisfies the rasterisation/CG algorithm requirement.

**Express** handles the backend — user authentication (admin + user accounts), saving/loading/deleting designs, and serving the API.

---

## Architecture (MVC — Required for 60%+)

```
/app (Next.js)
  /components        → View layer (React UI components)
  /pages or /app     → Page routing
  /lib               → Business logic (room calculations, furniture management)
  /api               → Controller layer (Next.js API routes or Express routes)

/server (Express)
  /routes            → API endpoints
  /controllers       → Business logic handlers
  /models            → Data models (User, Room, Design, Furniture)
  /db                → Database connection and queries
```

Keep UI, logic, and data **strictly separated** — a component that renders the canvas should not also handle database calls.

---

## Feature → Implementation Mapping

| Requirement | Implementation |
|---|---|
| Admin + User login | Express auth (JWT or session) + Next.js login page |
| Room spec input | React form → stored via Express API |
| 2D visualisation | HTML5 Canvas — draw room + furniture shapes to scale |
| 3D view | Three.js scene — import GLTF models, position from 2D layout data |
| Furniture scaling | Canvas/Three.js scale proportional to room dimensions |
| Shading | Canvas `createLinearGradient` / Three.js materials |
| Colour change | Canvas `fillStyle` / Three.js `material.color` |
| Save designs | POST to Express API → persist to database |
| Edit / Delete designs | PUT / DELETE routes in Express |

---

## 3D Quick Start Tips

- Use **Three.js** with `GLTFLoader` to import pre-built furniture models
- Free GLTF models available at [Sketchfab](https://sketchfab.com) and [Three.js examples](https://threejs.org/examples/)
- Use `OrbitControls` for mouse rotation and zoom (covers the 360° requirement)
- Basic `AmbientLight` + `DirectionalLight` is enough for the lighting/shading requirement
- Sync 3D positions from your 2D canvas layout data — same coordinates, different renderer

---

## What Gets You Above Average

From Dr Bakhshi directly:
> *"Excellent marks for putting in the effort to improve the usability of the design, the interfaces, the way that menus are laid out for the user — it is all about improving user interaction."*

Focus on:
- Clean, intuitive UI — good spacing, consistent colours, clear feedback on every action
- Smooth 2D ↔ 3D toggle that reflects the current layout
- Drag-and-drop furniture placement in 2D
- SUS scores from your summative evaluation
- Honest limitations table in the report

---

## Critical Reminders

- Deadline: **19th March 2026, 16:00 SL time** — late = 0%, no exceptions
- Architecture must be **layered/MVC** — monolithic = capped below 60%
- Minimum **2 participants** per user study — no children
- Video: **7–12 minutes** — marker stops at 12
- Report: **~2000 words** narrative — marker stops at 2000
- GitHub and video links must be **publicly accessible** — test from a logged-out device
- Submit as **single PDF via DLE only**
