# ULTIMATE FULLSTACK EXECUTION GUIDE v2
> Read once. Generate project guide from any requirement. Execute stage by stage.
> App works by S04. Every stage after improves it. Never go back.
> Read `.architecture` before every stage. Update `.architecture` after every stage.
> Read `stack.config` in S01. Never change it after S01 without updating `.architecture`.

---

## SYSTEM FILES

```
ULTIMATE_GUIDE.md     → this file. rules, stages, discipline
stack.config          → infra decisions. locked after S01
.architecture         → live state. updated every stage
README.md             → how to bootstrap any project with this system
```

---

## BOOTSTRAP SEQUENCE — before writing any code

```
1. Read requirement fully
2. Identify: core feature, entities, auth needs, realtime needs, infra needs
3. Fill stack.config — every service decision locked here
4. Fill .architecture top section: project, conventions, stack
5. Generate PROJECT_GUIDE.md using stage format below
6. PROJECT_GUIDE.md header must say:
   > Follows ULTIMATE_GUIDE.md v2. stack.config locked. .architecture is source of truth.
7. Begin S01
```

---

## STAGE SHAPE — every stage in PROJECT_GUIDE.md uses this exactly

```
## S[XX] — [NAME]
> Runnable after this stage: yes/no — [what works]

### PRE-CHECK
- what must exist in .architecture before starting
- what must be running/reachable
- if pre-check fails: do not start, fix previous stage first

### DO
- tight verb-first bullets
- no explanations

### VERIFY
- exact checks that must pass before marking done
- if any fail: fix now, do not proceed

### RECORD
- exact .architecture keys to update
```

---

## THE 12 STAGES

### S01 — INFRA + REPO
> Runnable after: health check responds

**Purpose:** lock everything before writing app code. Every infra decision made here. Nothing improvised later.

#### PRE-CHECK
- stack.config exists and fully filled
- all paid services have credentials ready
- local tools installed: node, git, relevant CLI tools

#### DO
- create repo, clone, init workspaces: [backend, frontend, websocket if needed]
- mkdir per service: src/{models,controllers,routes,middleware,utils,types,config}, tests
- frontend: init with flags from stack.config (typescript, css framework, router)
- install ALL dependencies declared in stack.config — backend, frontend, websocket
- configure tsconfig per service from stack.config.language settings
- .gitignore: node_modules, dist, .env, .env.local, coverage, *.log, .DS_Store
- create .env.example per service — every var from stack.config.env_patterns
- connect to every external service declared in stack.config:
  - db: connection file, test connection, log success
  - paid services: init SDK, verify credentials work
- server bootstrap: middleware stack, error handler, 404 handler
- GET /health → {status:ok, service:name, timestamp, db:connected}
- verify: start server, hit /health, db connected confirmed in response

#### VERIFY
- [ ] server starts without errors
- [ ] /health responds 200
- [ ] db connection confirmed (not just no error — actively log connected)
- [ ] every external service SDK initializes without error
- [ ] .env.example has every var needed
- [ ] git: initial commit on develop branch

#### RECORD
```
project.name, project.type, project.repo
stack: all fields from stack.config
workspace: all paths
env_vars: every var with service and example
deps.backend: all installed with versions
deps.frontend: all installed with versions
conventions: all locked
stages.S01.done: true
```

---

### S02 — FIRST SLICE: ONE MODEL + ONE ENDPOINT + SEEDED
> Runnable after: one real API endpoint returns seeded data

**Purpose:** prove the full stack works before building more. DB → model → endpoint → seed → verify.

#### PRE-CHECK
- `.architecture` has: stack, env_vars, db connected
- S01 verify all passed

#### DO
- pick the most central model from requirement (the thing everything else revolves around)
- create model/schema with all fields, indexes, relationships placeholder
- create controller: getAll with pagination, getById
- create route, wire to server
- seed script: insert minimum 5 realistic records for this model
- run seed, verify records in db
- test: GET /api/[entity] returns seeded data
- test: GET /api/[entity]/:id returns one record

#### VERIFY
- [ ] seed runs without error
- [ ] db has seeded records (check count)
- [ ] GET /api/[entity] returns array with data
- [ ] GET /api/[entity]/:id returns single record
- [ ] 404 on nonexistent id returns correct error shape

#### RECORD
```
models.[Name]: file, fields, indexes, add_at:S02
seed.file, seed.data.[Model]: count
endpoints.[Entity].getAll: full spec
endpoints.[Entity].getById: full spec
api.response_shape: locked here, used everywhere
api.error_shape: locked here, used everywhere
stages.S02.done: true
```

---

### S03 — AUTH END TO END
> Runnable after: register → login → hit protected route → works in browser

**Purpose:** auth is a dependency of everything. Do it completely. Frontend included.

#### PRE-CHECK
- `.architecture` has: response_shape, error_shape, stack.frontend confirmed
- User model not yet created

#### DO
**Backend:**
- User model: fields from requirement + role
- utils: hashPassword, comparePassword, generateToken(id,email,role), verifyToken — from stack.config.auth service or custom
- middleware: authenticate, authorize(...roles), errorHandler wired globally
- controller: register, login — use locked error_shape and response_shape
- routes: POST /api/auth/register, POST /api/auth/login
- wire to server

**Frontend (minimal — just enough to test auth):**
- api client: axios instance, baseURL from env, request interceptor(attach token), response interceptor(401→logout)
- auth store: user, token, isAuthenticated, login, logout, persist
- login page: form, submit, store token, redirect
- register page: form, submit, auto-login, redirect
- protected route wrapper

**Seed:**
- add 2 users to seed script: 1 admin, 1 regular user with known credentials
- document credentials in seed file comments

#### VERIFY
- [ ] POST /register with valid data → 201, token returned
- [ ] POST /register duplicate email → 409
- [ ] POST /login valid → 200, token returned
- [ ] POST /login wrong password → 401
- [ ] GET protected route with token → 200
- [ ] GET protected route without token → 401
- [ ] GET protected route with wrong role → 403
- [ ] frontend: login page loads, submit works, redirects
- [ ] frontend: token persisted after page refresh
- [ ] frontend: logout clears token, redirects

#### RECORD
```
models.User: full spec
auth: token_field, header, jwt_expire
auth.middleware: authenticate file, authorize file
auth.utils: all 4 functions, files
endpoints.auth: register and login full spec
frontend.auth_store: file, state, actions, persist
frontend.api_client: file, interceptors
pages./login: full spec
pages./register: full spec
seed.data.User: count, note credentials in comments
stages.S03.done: true
```

---

### S04 — CORE FEATURE: VERTICAL SLICE
> Runnable after: the main thing this app does works completely in browser

**Purpose:** minimum viable app. Real feature. Real data. Real UI. Seeded. Demonstrable.
This is the most important stage. Everything before enables this. Everything after improves it.

#### PRE-CHECK
- `.architecture` has: auth complete, response_shape, error_shape, S01-S03 done
- identify core feature from requirement — the one feature that defines the app
- list every model, endpoint, frontend page, component needed for JUST this feature

#### DO
**Models:**
- all remaining models needed for core feature only
- add to seed script: seed all new models with realistic data
- run seed, verify

**Backend:**
- full CRUD for core feature entities
- business logic for core feature: stateful operations, status transitions
- wire all routes

**Frontend:**
- pages for core feature: list, detail, action page
- components: whatever the feature needs to work
- wire api calls using exact endpoint specs from .architecture
- wire auth — protected routes where needed
- basic loading states, basic error display

**End to end test manually:**
- open browser, login with seeded credentials
- do the core feature completely
- verify db reflects the action

#### VERIFY
- [ ] all new models seeded, records in db
- [ ] all new endpoints respond correctly
- [ ] core feature works end to end in browser
- [ ] auth gates work — wrong role blocked
- [ ] db state correct after feature actions
- [ ] no console errors in browser
- [ ] api errors display to user (not silent)

#### RECORD
```
models.[each new]: full spec
endpoints.[each new]: full spec
business.[operation]: steps, modifies, atomic, states, transitions
pages.[each new]: full spec
components.[each new]: full spec
seed.data.[each new model]: count
stages.S04.done: true
```

---

### S05 — REMAINING ENTITIES + FULL CRUD
> Runnable after: all entities accessible via API and basic UI

**Purpose:** complete the data layer. Everything that wasn't core feature gets built here.

#### PRE-CHECK
- `.architecture` has: all S04 models, core feature working
- list all remaining models from requirement not yet built

#### DO
- remaining models: create with full spec
- CRUD controllers for each
- routes wired
- add to seed script, run seed
- frontend: list + detail pages for each (basic — just working, not polished)
- wire to existing nav

#### VERIFY
- [ ] every model has records in db
- [ ] every CRUD endpoint works: create, read, update, delete
- [ ] frontend pages load with data
- [ ] pagination works on list endpoints

#### RECORD
```
models.[each]: full spec
endpoints.[each]: full spec
controllers.[each]: file, methods
routes.[each]: file, prefix
pages.[each basic]: file, api_calls
stages.S05.done: true
```

---

### S06 — BUSINESS LOGIC + STATE MACHINES
> Runnable after: all stateful operations work, status transitions enforced

**Purpose:** everything that isn't simple CRUD. Booking flows, order processing, status machines, complex queries, calculations.

#### PRE-CHECK
- `.architecture` has: all models, all basic endpoints
- list all stateful operations from requirement

#### DO
- for each stateful operation:
  - define all valid states, all valid transitions
  - implement transition validation: invalid → 400 with clear message
  - atomic where needed: use db transactions/sessions if supported
  - update all dependent model fields in same operation
  - unique ID generation where needed
- complex queries: filtering, sorting, aggregation if needed
- any calculated fields or derived data
- update seed to cover all status states

#### VERIFY
- [ ] every status transition: valid ones work, invalid ones return 400
- [ ] atomic operations: partial failure leaves db clean
- [ ] dependent model updates happen correctly
- [ ] seed covers all states

#### RECORD
```
business.[each operation]:
  endpoint, steps, modifies, atomic, states, transitions
status_fields: [Model.field: [all states]]
unique_ids: [field: pattern]
stages.S06.done: true
```

---

### S07 — REALTIME (skip if not in requirement)
> Runnable after: realtime feature works with 2 browser tabs

**Purpose:** websocket layer if requirement has realtime. If not — mark skipped, move on.

#### PRE-CHECK
- check requirement: does it need realtime?
- if no: mark S07 skipped in .architecture, go to S08
- if yes: `.architecture` has all business logic complete

#### DO
- websocket server: wrap http, init socket lib, cors, JWT auth from handshake
- auth middleware: verify token, attach user to socket
- room management: join/leave, room naming from .architecture conventions
- handlers per domain: one file per feature area
- every event: name, payload shape, validation, broadcast target
- error event: consistent shape
- frontend client: connect(token), disconnect, joinRoom, emit, on wrappers
- integrate into existing pages that need realtime: connect on mount, disconnect + release locks on unmount
- seed: ensure data exists to demo realtime

#### VERIFY
- [ ] two browser tabs: action in tab 1 updates tab 2 in real time
- [ ] disconnect/reconnect: state recovers correctly
- [ ] invalid token rejected at connection
- [ ] room isolation: tab in room A doesn't receive room B events

#### RECORD
```
ws: port, entry, auth method, room_pattern
ws.events.[each]: direction, payload, handler, broadcasts
ws.client: file, methods
stages.S07.done: true (or skipped: true, reason)
```

---

### S08 — FRONTEND COMPLETE
> Runnable after: full UI, all flows, all pages, polished enough to demo

**Purpose:** complete every page, every form, every connected component. UX complete.

#### PRE-CHECK
- `.architecture` has: every endpoint spec, every ws event, every store
- all backend stages S01-S07 done and verified

#### DO
- every page from requirement: full implementation
- every form: validation schema matches backend validation exactly (derive from .architecture)
- all loading states: skeleton or spinner on every async operation
- all error states: user-facing messages, not raw API errors
- all empty states: no blank screens
- navigation: complete, protected routes enforced
- responsive: mobile and desktop
- realtime pages: connect, handle events, clean disconnect
- review every api call against .architecture endpoint spec — exact match

#### VERIFY
- [ ] every page loads without error
- [ ] every form: valid submit works, invalid submit shows errors
- [ ] every protected page: redirects if not authenticated
- [ ] every api error: displays to user
- [ ] all loading states visible
- [ ] no console errors on any page
- [ ] mobile viewport: usable

#### RECORD
```
pages.[each]: complete spec
components.[each]: complete spec
stages.S08.done: true
```

---

### S09 — TESTING
> Runnable after: coverage targets met, all tests passing

**Purpose:** test the working system. Not build — test. Everything exists, now verify it holds.

#### PRE-CHECK
- `.architecture` has: all endpoints, all business logic, all components
- testing frameworks installed (should be from S01 deps)

#### DO
**Backend unit:**
- every util function: all paths
- every middleware: pass, fail, edge cases
- every model method and hook

**Backend integration:**
- every endpoint: happy path + each error case
- every business logic operation: valid transitions + invalid transitions
- use in-memory db or test db — never production

**Frontend component:**
- every form: renders, validates, submits, handles errors
- every page: renders with data, renders loading, renders error
- auth flows: login, logout, protected redirect

**Coverage:**
- run with coverage flag
- if under target: add tests until met
- record actual % in .architecture

#### VERIFY
- [ ] all tests pass
- [ ] backend coverage ≥ 70%
- [ ] frontend coverage ≥ 60%
- [ ] no test touches production db

#### RECORD
```
tests.unit.[each]: file, target, cases
tests.integration.[each]: file, endpoints, cases
tests.component.[each]: file, component, cases
tests.coverage.backend.actual: %
tests.coverage.frontend.actual: %
stages.S09.done: true
```

---

### S10 — CI/CD
> Runnable after: pipeline green on all branches

**Purpose:** automated quality gate. Every push verified.

#### PRE-CHECK
- `.architecture` has: test commands, build commands, all env vars
- repo has develop and main branches

#### DO
- .github/workflows/ci.yml (or platform equivalent)
- jobs: backend(install,lint,test,build), frontend(install,lint,test,build), websocket if exists
- triggers: push main, push develop, pull_request to main
- env secrets: list from stack.config.secrets — add to GitHub Secrets
- lint: zero errors enforced — fix all existing lint errors first
- if stack.config has deploy target: add deploy job triggered on merge to main
- push to develop, verify pipeline runs, all jobs green

#### VERIFY
- [ ] pipeline triggers on push
- [ ] all jobs complete green
- [ ] lint job catches a real lint error if introduced
- [ ] secrets accessible in pipeline (not hardcoded)
- [ ] deploy job runs if configured

#### RECORD
```
cicd.file, cicd.jobs, cicd.triggers, cicd.secrets
cicd.deploy: platform, url if available
cicd.status: passing
stages.S10.done: true
```

---

### S11 — PERFORMANCE + SECURITY
> Runnable after: app handles load, no obvious vulnerabilities

**Purpose:** make it production-grade. Not optional.

#### PRE-CHECK
- `.architecture` has: all endpoints, all models, cicd passing

#### DO
**Security:**
- all inputs validated and sanitized server-side
- all routes have correct auth — audit every endpoint against .architecture
- rate limiting on auth endpoints minimum
- helmet configured
- no secrets in code — audit all files
- CORS: locked to actual origins

**Performance:**
- db indexes on all queried fields — derive from endpoint query patterns in .architecture
- pagination on all list endpoints (if not already)
- query optimization: no N+1, use populate/join correctly
- frontend: no unnecessary re-renders on realtime updates
- image optimization if applicable

**Audit:**
- run npm audit, fix critical and high
- check all .env.example vars have corresponding values set

#### VERIFY
- [ ] npm audit: no critical/high vulnerabilities
- [ ] rate limiting active on auth routes
- [ ] all list endpoints paginated
- [ ] db indexes verified in db console
- [ ] no hardcoded secrets in codebase

#### RECORD
```
security.rate_limit: endpoints, limits
security.cors: allowed_origins
performance.indexes: [Model.field]
performance.pagination: confirmed on all list endpoints
stages.S11.done: true
```

---

### S12 — FINAL SWEEP + READY
> Runnable after: clean, documented, submittable

**Purpose:** everything clean, everything verified, ready to hand off or deploy.

#### PRE-CHECK
- all S01-S11 done or explicitly skipped with reason
- `.architecture` has all fields filled

#### DO
- remove: all console.log, commented code, unused imports, debug routes
- seed: complete realistic dataset covering all features and status states
- run full manual flow: every feature, every role, every edge case
- README: setup steps exact, env vars complete, run commands for all services, architecture overview
- .env.example: matches every var in .architecture.env_vars exactly
- verify no .env files committed: git log check
- PR: develop → main, CI must pass
- tag: v1.0
- if deploy configured: verify live URL works

#### VERIFY
- [ ] full manual flow: no errors
- [ ] README: fresh clone + follow README = running app (test this)
- [ ] .env.example complete
- [ ] no secrets in git history
- [ ] CI green on main
- [ ] all 12 stages marked done or skipped in .architecture
- [ ] v1.0 tag exists

#### RECORD
```
final.readme: true
final.env_verified: true
final.clean: true
final.version_tag: v1.0
final.deploy_url: if applicable
stages.S12.done: true
stage_completed: [S01..S12]
```

---

## RECOVERY PROTOCOL

When a stage fails mid-execution:

```
1. Do not proceed to next stage
2. Open .architecture — find what was recorded vs what was planned
3. Find exact deviation — wrong field name, wrong response shape, wrong path
4. Fix only the deviation
5. Re-run VERIFY checklist for current stage
6. Only if all checks pass: update .architecture, proceed
```

Never rewrite a whole file to fix a bug. Find the deviation. Fix it. Verify.

---

## CONTRACT RULE

Every boundary between services is a contract. Record both sides before coding either side.

```
backend exposes   → frontend consumes  → record in endpoints.[entity]
ws emits          → frontend handles   → record in ws.events.[name]
frontend sends    → backend validates  → body shape in endpoints.[entity]
service A calls B → record in both
```

If a contract changes: update both sides in .architecture before touching code.

---

## DEPENDENCY CHAIN

Before writing any code trace the full chain. Every link must exist in .architecture first.

```
Model → Controller → Route → server.ts wire
→ Frontend Type → API Client call → Store action → Component render
```

Missing a link? Record it first. Then code it.

---

## NAMING CONVENTIONS

Locked in S01 under conventions in .architecture. Never change after S01.

```
files:        camelCase utils/hooks, PascalCase models/components
routes:       kebab-case plural /api/food-items
env_vars:     SCREAMING_SNAKE_CASE
db:           camelCase plural collections
ws_events:    camelCase verb+noun seatUpdated bookingConfirmed
branches:     feature/name  fix/name  release/version
commits:      feat(scope): fix(scope): test(scope): docs(scope):
css:          utility-first, no custom unless recorded
ids:          all generated IDs: pattern recorded in .architecture
```

---

## ERROR + RESPONSE SHAPE

Locked in S02. Used everywhere. Never deviate.

```
response: {data, message}          or    {data}          — pick one in S02
error:    {message, code, status}  — always, everywhere
```

Frontend error handler written once in api client interceptor.
Every endpoint uses errorHandler middleware.
Zero custom error formats anywhere.

---

## STACK.CONFIG RULES

- Filled before S01 starts
- Every service decision final — no changing library mid-project
- If a service must change: update stack.config + .architecture + all affected entries + re-verify affected stages
- stack.config drives: which SDKs to install, which env vars to create, which connection patterns to use

---

## .ARCHITECTURE DISCIPLINE

- Update within the same stage execution — not after, not later
- Every file created: entry in .architecture
- Every function signature: recorded if called from another service
- Every env var added: recorded immediately
- Skipped item: mark skipped:true, reason, deferred_to if applicable
- Never delete entries — supersede: mark superseded_by if replaced
- Stage done: only after VERIFY checklist fully passed
