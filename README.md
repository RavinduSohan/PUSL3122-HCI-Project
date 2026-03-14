# FurniView (Group 56)

Furniture Room Visualisation System for PUSL3122 (HCI, Computer Graphics and Visualisation).

FurniView is the actual system delivered by Group 56: a full-stack web app where staff and customers design rooms in 2D, inspect them in 3D, and manage saved designs through a portfolio workflow.

Deadline: 19 March 2026, 16:00 SL time.

---

## What FurniView Is

FurniView supports the furniture consultation scenario from the brief.

Two account roles are implemented:
1. Admin account for furniture shop staff.
2. User account for independent customer use.

Core user journey:
1. Register or login.
2. Create room (name, dimensions, shape, wall color).
3. Arrange furniture in 2D.
4. Toggle to 3D to review space.
5. Save, reopen, edit, duplicate, or delete designs.

---

## Group 56 Team

Fill final names before submission.

| Name | Role | Area |
|---|---|---|
| Member 1 | Team Lead | Planning, integration |
| Member 2 | Backend | API, auth, models |
| Member 3 | Frontend | Dashboard, auth UI |
| Member 4 | Graphics | Canvas2D, Scene3D |
| Member 5 | QA | Tests, CI/CD |
| Member 6 | UX | Wireframes, evaluation docs |

---

## Implemented Scope (Real System)

### FR Coverage

| Requirement | Status |
|---|---|
| FR1 - Admin + User login + portfolio | Done |
| FR2 - Room specification input | Done |
| FR3 - 2D room visualization | Done |
| FR4 - 3D view conversion | Done |
| FR5 - Furniture scaling to room dimensions | Done |
| FR6 - Shading (whole and selected) | Done |
| FR7 - Color change (whole and selected) | Done |
| FR8 - Save design | Done |
| FR9 - Edit and delete design | Done |

### Delivered UX and Interaction Features

1. Undo and redo history.
2. Keyboard shortcuts (Ctrl/Cmd+Z, Ctrl/Cmd+Y, Delete/Backspace, Escape).
3. Snap-to-grid option.
4. Quick room templates (living, bedroom, office).
5. Duplicate and rotate selected furniture.
6. Unsaved changes badge and navigation warning.
7. Save spinner and success states.
8. PNG export and print action.
9. Dashboard empty-state and loading skeletons.

### Delivered Graphics Features

2D:
1. Canvas ruler and metric scale.
2. Rectangle and L-shape rendering.
3. Drag and resize handles for furniture.
4. Area and furniture coverage overlay.

3D:
1. OrbitControls and camera reset.
2. Procedural wood floor texture.
3. Multi-part procedural furniture builders.
4. Lighting rig and scene fog.
5. GLTF model path ready for model replacement.

---

## Architecture (Implemented)

Layered, non-monolithic architecture:
1. Presentation layer: Next.js pages and React components.
2. Application layer: state, API client, backend controllers and middleware.
3. Data layer: MongoDB via Mongoose models.

Core backend modules:
1. Auth controller and routes.
2. Room controller and routes.
3. Authenticate/authorize middleware.
4. Validation middleware.
5. Error middleware.
6. User, Room, Design models.

Core frontend modules:
1. Auth pages and Zustand auth store.
2. Dashboard and DesignCard portfolio views.
3. Room editor page.
4. Canvas2D renderer.
5. Scene3D renderer.
6. ErrorBoundary for rendering failures.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| State and forms | Zustand, React Hook Form, Zod |
| 2D graphics | HTML5 Canvas API |
| 3D graphics | Three.js, OrbitControls, GLTFLoader |
| Backend | Express, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Security | JWT, bcryptjs, Helmet, CORS, express-rate-limit |
| Testing | Vitest, Supertest, Testing Library, jsdom |
| CI/CD | GitHub Actions |

---

## Repository Layout

```text
backend/
  src/
    app.ts
    server.ts
    seed.ts
    controllers/
    db/
    middleware/
    models/
    routes/
    utils/
  tests/
    unit/
    integration/

frontend/
  app/
    login/
    register/
    dashboard/
    room/new/
    room/[id]/
    profile/
    guide/
  components/
  lib/
    store/
  tests/
    components/
    lib/

docs/
  evaluation/
  wireframes/

.github/
  workflows/
```

---

## Run the System Locally

### Prerequisites
1. Node.js 20+
2. npm
3. Git
4. MongoDB Atlas connection configured in backend env

### Backend setup

```bash
cd backend
npm install
```

Create backend/.env from backend/.env.example and fill required values.

Seed demo data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend URL: http://localhost:4000

Health endpoint: http://localhost:4000/api/health

### Frontend setup

```bash
cd frontend
npm install
```

Create frontend env file from frontend/.env.example and set NEXT_PUBLIC_API_URL.

Start frontend:

```bash
npm run dev
```

Frontend URL: http://localhost:3000

---

## Demo Accounts

Default seeded accounts:
1. Admin: admin@shop.com / admin123
2. User: user@home.com / user123

If seed data changes, update this section.

---

## API Overview

Auth endpoints:
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me
4. PUT /api/auth/me/password

Room endpoints:
1. GET /api/rooms
2. GET /api/rooms/:id
3. POST /api/rooms
4. PUT /api/rooms/:id
5. DELETE /api/rooms/:id
6. POST /api/rooms/:id/design
7. GET /api/rooms/admin/all

---

## Testing and CI/CD

### Local commands

Backend:

```bash
cd backend
npm run lint
npm run test
npm run test:coverage
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run test
npm run test:coverage
npm run build
```

### Current coverage status

From testing status records:
1. Backend statement coverage: 72.61%
2. Frontend statement coverage: 95.45%

### CI workflow

Workflow file: .github/workflows/ci.yml

Triggers:
1. Push to main
2. Push to develop
3. Pull request to main

Jobs:
1. Backend: install, lint, test, build
2. Frontend: install, lint, test, build

---

## Project Documentation Map

Use these files as authoritative project references:

1. FULL_SYSTEM_OVERVIEW.md
   - System-level source of truth.

2. FULL_REPORT_COMPLETE_DRAFT.md
   - Extended report draft.

3. REPORT_STRUCTURE_TEMPLATE.md
   - Section-by-section report writing template.

4. TESTING_CICD_COVERAGE_STATUS.md
   - Test coverage and CI status snapshot.

5. docs/evaluation/README.md
   - Required evaluation artifacts checklist.

6. docs/wireframes/README.md
   - Required wireframe artifacts checklist.

---

## Submission Readiness Checklist

1. Backend build and tests pass.
2. Frontend build and tests pass.
3. CI pipeline is green.
4. Team names and roles are finalized in docs.
5. Report PDF follows required section numbering.
6. GitHub and video links open from logged-out browser.

---

## Credits and External Resources

1. Three.js - https://threejs.org
2. Sketchfab (GLTF sources) - https://sketchfab.com
3. React Hot Toast - https://react-hot-toast.com
4. Tailwind CSS - https://tailwindcss.com
5. Next.js - https://nextjs.org

Add per-model attribution details for all external 3D assets used in final demo and report.

