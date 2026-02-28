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
- But commits must be **weekly from Day 1** — late dumping is visible and costs marks
- All commit messages must be **descriptive** (not "fix" or "update")
- No `.zip` files of old versions — use branches/commits for version history
- README must include: project description, how to run, all external resources credited

### Report
- Keep Agile/Scrum evidence **minimal in main body** — put extra detail in appendix
- A few UI snapshots in main body — rest can go in appendix
- **No need to put code in appendix** — GitHub link on front page is sufficient
- Small code snippets in report body are optional but welcome
- **Section 3 does not exist** — number your sections 1, 2, 4, 5, 6, 7, 8, 9 exactly

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

Keep UI, logic, and data **strictly separated** — a component that renders the canvas should not also handle database calls. A single class/component doing everything = monolithic = capped below 60%.

---

## All 9 Functional Requirements → Implementation Mapping

| # | Requirement | Web Stack Implementation |
|---|---|---|
| FR1 | Admin + User login + portfolio | Express auth (JWT/session) + Next.js dashboard listing saved designs |
| FR2 | Room spec input (size, shape, colour) | React form → stored via Express API → database |
| FR3 | 2D visualisation with furniture | HTML5 Canvas — draw room outline + furniture shapes to scale |
| FR4 | 3D view conversion | Three.js scene — GLTF models positioned from 2D layout data |
| FR5 | Furniture scaling | Canvas/Three.js scale proportional to room dimensions |
| FR6 | Shading (whole/selected) | Canvas `createLinearGradient` / Three.js materials on selected mesh |
| FR7 | Colour change (whole/selected) | Canvas `fillStyle` / Three.js `material.color` on selected item |
| FR8 | Save designs | POST to Express API → persist to database |
| FR9 | Edit / Delete designs | PUT / DELETE routes in Express, loaded from portfolio dashboard |

### 7 Non-Functional Requirements → What to Show

| NFR | What markers want to see |
|---|---|
| Usability | Intuitive layout, consistent nav, minimal steps to complete tasks |
| Performance | Canvas and Three.js render without noticeable lag |
| Accessibility | WCAG AA contrast ratios (check via WebAIM), min 14px body text |
| Feedback | Toast/status message confirms every action (save, delete, colour change) |
| Error Prevention | Validation on all inputs, confirmation dialogs before delete |
| Efficiency | Tasks completable in minimal clicks — good menu layout |
| Engagement | 3D view is visually appealing, smooth toggle from 2D |

---

## Development Stages (Adapted for Web Stack)

### S01 — Setup
- Create public GitHub repo, push initial commit immediately
- Document context of use: Users (admin/user), Tasks, Environment (in-store + remote), Equipment (browser on desktop/laptop)
- Set up Agile/Scrum: product backlog, 1-week sprints, team communication channel

### S02 — Requirements
- Combine brief's 9 FR + 7 NFR with your own gathered requirements
- Apply MoSCoW prioritisation to everything
- Every requirement must have a traceable source (brief or your research)

### S03 — Personas, Stories, Storyboards
- Minimum 2 personas (name, age, occupation, tech literacy, goals, frustrations)
- User stories for all 9 FR: *"As an [admin/user], I want to [action] so that [goal]"*
- Storyboard: admin greets customer → login → room specs → add furniture → 2D → 3D → save

### S04 — Low-Fi Prototype + Formative Evaluation
- Sketch/wireframe 2–4 screens: login, dashboard, room setup, 2D editor, 3D view
- Minimum 2 participants (no children, identities confidential)
- Written test plan, signed consent forms, demographics table (no names)
- Document findings with severity ratings + specific design changes made as a result

### S05 — High-Fi Prototype (Figma)
- All major screens with consistent nav, colour scheme, typography
- Apply explicitly and name: Nielsen's 10 Heuristics, Gestalt principles, Fitts' Law, WCAG AA
- Document what changed from low-fi feedback

### S06 — Architecture Design
- Draw layered MVC diagram (use draw.io or Lucidchart)
- Define responsibilities: which component/file handles what
- Document data persistence approach (Express + DB schema)

### S07 — Core Implementation (Login + Portfolio)
- Admin and User login with authentication
- Portfolio dashboard listing all saved designs for logged-in account
- Input validation + error handling throughout

### S08 — 2D Implementation
- Canvas renders room outline scaled to actual dimensions
- Furniture drawn as labelled shapes, proportionally scaled
- Click to select furniture → apply colour/shading to selected or whole design
- Add/remove/position furniture

### S09 — 3D Implementation
- Three.js scene with walls, floor, GLTF furniture models
- Positions synced from 2D canvas layout data
- `AmbientLight` + `DirectionalLight` for depth/shading
- `OrbitControls` for rotation/zoom
- Toggle button: 2D ↔ 3D

### S10 — Save/Edit/Delete + Polish
- Save → POST to API, Edit → load from portfolio + modify + PUT, Delete → DELETE with confirmation dialog
- Immediate feedback on every action (toast notifications, status messages)
- UI polish: consistent fonts, spacing, colours throughout

### S11 — Summative Evaluation
- Minimum 2 participants (ideally different from formative, no children)
- SUS questionnaire + task-based testing
- Calculate SUS scores (68 = average, 80+ = excellent), chart results
- Document "areas for further work and improvement" explicitly
- Document recommendations for incorporating feedback

---

## Report Structure

Sections numbered **1, 2, 4, 5, 6, 7, 8, 9** — Section 3 does not exist (matches the brief exactly).

| Section | Contents |
|---|---|
| Cover + Links | Module name, all member names, GitHub URL, OneDrive video URL |
| Roles Table | Member name → role → what they built |
| **Section 1** | Introduction, app features, requirements (MoSCoW), paper prototype images, personas + user stories, storyboards, formative eval summary, requirements gathering summary, feedback incorporation |
| **Section 2** | Scenario background, context of use (users/tasks/environment/equipment), Agile/Scrum methodology with evidence |
| **Section 4** | Requirements gathering: method, justification, process, analysis, findings |
| **Section 5** | Full design: all requirements, personas, user stories, storyboards, low-fi, high-fi Figma, HCI principles named + explained |
| **Section 6** | Architecture diagram (MVC/layered), 2D implementation (screenshots + GitHub hyperlinks), 3D implementation (screenshots + GitHub hyperlinks), all features, coding approach + patterns |
| **Section 7** | Formative + summative evaluation: method, participants, test plan, results, SUS chart, areas for further work, recommendations |
| **Section 8** | Summary — 1–2 sentences per section |
| **Section 9** | Harvard references |
| Limitations Table | % completion for all 9 objectives — be honest |
| Appendix | Blank consent forms, test plans, interview/survey questions, raw anonymised data |

**Word count ~2000 — narrative only, images do not count. Marker stops reading at 2000.**

---

## Video Structure (7–12 min)

| Timestamp | Content |
|---|---|
| 0:00–0:45 | Introduction — team names, what the app does |
| 0:45–3:30 | Live demo of all 9 features with real data |
| 3:30–8:30 | Each member explains and walks through their own code |
| 8:30–10:30 | Design walkthrough — Figma, HCI principles, evaluation findings, what changed |
| 10:30–12:00 | Limitations, future work, close |

**Technical specs:** MP4, H.264, 720p+, 30fps, 16Mbps video, stereo 384kbps audio. Host on university OneDrive. Test link from logged-out device — every member must do this.

---

## 3D Quick Start Tips

- Use **Three.js** with `GLTFLoader` to import pre-built furniture models
- Free GLTF models at [Sketchfab](https://sketchfab.com) and [Three.js examples](https://threejs.org/examples/)
- Use `OrbitControls` for mouse rotation and zoom (covers 360° requirement)
- `AmbientLight` + `DirectionalLight` is sufficient for the lighting/shading requirement
- Sync 3D object positions directly from your 2D canvas layout state

---

## Grade Targets

### 60%+ (Competent)
- All 9 FR implemented and working
- Layered/MVC architecture — demonstrably not monolithic
- Minor bugs acceptable
- Appropriate V&V testing (Verification = code review/unit tests, Validation = user testing)
- Requirements clear with sensible MoSCoW

### 70%+ (Highly Skilled)
- Innovation beyond requirements: drag-and-drop furniture, undo/redo, room shape templates, export as PNG, furniture catalogue with images
- Strong software engineering — patterns named and documented in report
- MVP clearly evident
- SUS + task-based testing + requirements traceability matrix

### 80%+ (Expert)
- Commercial-quality, deployable code
- Original thinking throughout — not just completing requirements
- Expert testing: SUS + A/B + statistical significance
- Professional diagrams reusable in industry
- Writing at peer-reviewed journal standard

> Dr Bakhshi: *"Excellent marks for putting in the effort to improve the usability of the design, the interfaces, the way that menus are laid out — it is all about improving user interaction."*

---

## Requirements Traceability Matrix

| Requirement | Dev Stage | Report Section | Video Timestamp |
|---|---|---|---|
| FR1: Login + Portfolio | S07 | 6 | 0:45–1:30 |
| FR2: Room Specification | S08 | 6 | 1:30–2:00 |
| FR3: 2D Visualisation | S08 | 6 | 2:00–2:30 |
| FR4: 3D View | S09 | 6 | 2:30–3:00 |
| FR5: Scaling | S08 | 6 | Integrated 2D/3D |
| FR6: Shading | S08 | 6 | Integrated 2D/3D |
| FR7: Colour Change | S08 | 6 | Integrated 2D/3D |
| FR8: Save | S10 | 6 | 3:00–3:15 |
| FR9: Edit/Delete | S10 | 6 | 3:15–3:30 |
| NFR: Usability | S05, S11 | 5, 7 | 8:30–9:30 |
| NFR: Performance | S08, S09 | 6 | Test in video |
| NFR: Accessibility | S05 | 5 | Explain in video |
| NFR: Feedback | S10 | 6 | Show in demo |
| NFR: Error Prevention | S10 | 6 | Show in demo |
| NFR: Efficiency | S05, S11 | 5, 7 | SUS results |
| NFR: Engagement | S09, S11 | 6, 7 | 3D demo + SUS |
| Context of Use | S01 | 2 | N/A |
| Requirements Gathering | S02 | 4 | N/A |
| Personas | S03 | 1.4, 5 | N/A |
| User Stories | S03 | 1.4, 5 | N/A |
| Storyboards | S03 | 1.5, 5 | N/A |
| Low-Fi Prototype | S04 | 1.3, 5 | N/A |
| Formative Evaluation | S04 | 1.6, 7 | 9:30–10:00 |
| High-Fi Prototype | S05 | 5 | 8:30–9:30 |
| Architecture (MVC) | S06 | 6 | 4:00–5:00 |
| Summative Evaluation | S11 | 7 | 10:00–10:30 |

---

## ⚠️ Critical Reminders — Never Break These

| Rule | Detail |
|---|---|
| Deadline | **19th March 2026, 16:00 SL time** — late = 0%, no exceptions |
| Architecture | Must be layered/MVC — monolithic = capped below 60% |
| GitHub | Weekly commits from Day 1 — late dumping visible in history |
| Participants | Min 2 per study, no children, identities always confidential |
| Video | 7–12 min exactly — marker stops at 12 |
| Report | ~2000 words narrative — marker stops at 2000 |
| Links | GitHub + video must be publicly accessible — test from logged-out device |
| Submission | Single PDF via DLE only — no other format |
| External linking | No linking report content to Google Drive/Dropbox — instant 0% |
| Section 3 | Does not exist — number sections 1, 2, 4, 5, 6, 7, 8, 9 |
