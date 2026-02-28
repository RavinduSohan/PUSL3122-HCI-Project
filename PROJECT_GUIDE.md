# PUSL3122 HCI Project Execution Guide
> Follows ULTIMATE_GUIDE.md v2. All details in PUSL3122_Full_Marks_Guide.md.
> Deadline: **19th March 2026, 16:00 SL time** — late = 0%

---

## Project Overview
**Furniture Room Visualisation Application**
- Language: Java + Swing + integrated computer graphics library
- Architecture: MVC / Layered (NOT monolithic — 60% gate)
- 9 Functional Requirements + 7 Non-Functional Requirements
- Deliverables: GitHub repo + 2000-word PDF report + 7-12 min video

---

## Critical Rules (Never Break)

1. **GitHub commits weekly from Day 1** — graded
2. **Not monolithic** — layered architecture required for 60%+
3. **GitHub & video links must be publicly accessible** — test from logged-out device
4. **Word count ~2000** — marker stops reading at 2000
5. **Video 7-12 min** — marker stops watching at 12
6. **No external file linking in PDF** — instant 0%
7. **Submit as PDF via DLE only** — no other format accepted
8. **Report sections: 1, 2, 4, 5, 6, 7, 8, 9** — Section 3 does not exist

---

## S01 — Setup & Context Analysis
> Runnable after: GitHub repo live, team formed

### PRE-CHECK
- [ ] Team formed (max 6 members)
- [ ] Java + Swing environment verified
- [ ] GitHub account ready

### DO
- [ ] Create public GitHub repository
- [ ] Initial README.md (project name, setup instructions)
- [ ] First commit: "Initial setup"
- [ ] Analyse context of use (ISO 9241-11):
  - Users: interior designers (primary), customers (secondary)
  - Tasks: consultation workflow step-by-step
  - Environment: in-store, time pressure
  - Equipment: desktop/laptop browser
- [ ] Document Agile/Scrum methodology choice with justification
- [ ] Set up weekly sprint structure (1-week sprints recommended)
- [ ] Create team communication channel

### VERIFY
- [ ] GitHub repo is public and accessible
- [ ] Context of use documented: users, tasks, environment, equipment
- [ ] Methodology documented with sprint plan

### RECORD
- Context of use analysis → Section 2 of report
- Methodology → Section 2 of report
- First commit timestamp recorded

---

## S02 — Requirements Gathering
> Runnable after: Context analysis complete

### PRE-CHECK
- [ ] S01 verified
- [ ] Requirements gathering method chosen (interviews/surveys/observation)

### DO
**Brief Requirements (given):**
- FR1: Designer login + portfolio management
- FR2: Room specification input (size, shape, colour)
- FR3: 2D visualisation with furniture
- FR4: 3D view conversion
- FR5: Furniture scaling
- FR6: Shading (whole/selected)
- FR7: Colour change (whole/selected)
- FR8: Save designs
- FR9: Edit/delete designs
- NFR: Usability, Performance, Accessibility (WCAG AA), Feedback, Error Prevention, Efficiency, Engagement

**Your Tasks:**
- [ ] Choose requirements gathering method(s) with justification
- [ ] Recruit participants (no children, identities confidential)
- [ ] Conduct data collection (document questions in appendix)
- [ ] Analyse data (thematic analysis/affinity mapping)
- [ ] Extract additional requirements
- [ ] Combine all requirements + apply MoSCoW prioritisation
- [ ] Create product backlog (user stories, prioritised)
- [ ] Ensure requirements traceability (brief or research source)
- [ ] Weekly commit: "Requirements analysis"

### VERIFY
- [ ] Full requirements list: brief requirements + gathered requirements
- [ ] MoSCoW applied: Must/Should/Could/Won't
- [ ] Every requirement has a source
- [ ] Product backlog created with priorities
- [ ] Data collection method documented with justification

### RECORD
- Requirements gathering method + justification → Section 4
- Full requirements list → Section 1.2
- User stories → Section 1.4
- Product backlog screenshot → Section 2

---

## S03 — Personas, Stories, Storyboards
> Runnable after: Requirements locked

### PRE-CHECK
- [ ] S02 verified
- [ ] MoSCoW requirements finalized

### DO
- [ ] Create minimum 2 personas:
  - Name, age, occupation, tech literacy, goals, frustrations
  - Tie each to specific requirements (traceability)
- [ ] Write user stories for all 9 functional requirements:
  - Format: "As a [designer], I want to [action] so that [goal]"
- [ ] Create storyboard (hand-drawn or digital):
  - Flow: designer meets customer → login → room specs → furniture → 2D → 3D → save
  - Scan/photograph for report
- [ ] Weekly commit: "Personas and storyboards"

### VERIFY
- [ ] Minimum 2 personas complete
- [ ] All 9 FR covered by user stories
- [ ] Storyboard shows full consultation flow
- [ ] Figures have captions and figure numbers

### RECORD
- Personas → Section 1.4
- User stories → Section 1.4
- Storyboards → Section 1.5
- All go into Section 5 (Design)

---

## S04 — Low-Fi Prototype + Formative Evaluation
> Runnable after: Core flows designed on paper

### PRE-CHECK
- [ ] S03 verified
- [ ] Minimum 2 participants recruited (no children)
- [ ] Consent forms prepared

### DO
**Low-Fi Prototype:**
- [ ] Sketch/wireframe 2-4 key screens: login, portfolio, room setup, 2D editor, 3D view
- [ ] Scan/photograph with clarity

**Formative Evaluation:**
- [ ] Write test plan: objectives, tasks, timing, success criteria, metrics
- [ ] Choose evaluation method (think-aloud/cognitive walkthrough/heuristic evaluation/paper prototype)
- [ ] Justify method choice
- [ ] Recruit participants (document how)
- [ ] Get signed consent forms
- [ ] Create participant demographics table (age range, tech level, occupation — NO NAMES)
- [ ] Conduct study (photograph study setting)
- [ ] Document findings: usability issues + severity ratings
- [ ] List specific design changes made as a result
- [ ] Weekly commit: "Low-fi prototype and formative evaluation"

### VERIFY
- [ ] Low-fi prototype images clear and labelled
- [ ] Minimum 2 participants (no children, identities never disclosed)
- [ ] Test plan complete
- [ ] Method named + justified
- [ ] Recruitment process documented
- [ ] Signed consent forms collected (blank copy for appendix)
- [ ] Demographics table complete (no identifiable info)
- [ ] Photographs of study setting
- [ ] Findings documented with severity
- [ ] Specific changes identified and documented

### RECORD
- Low-fi prototype → Section 1.3
- Formative evaluation → Section 1.6
- Test plan → Section 7 + Appendix
- Consent form template → Appendix
- Demographics → Section 7
- Changes made → Section 1.8
- Full evaluation → Section 7

---

## S05 — High-Fi Prototype (Figma)
> Runnable after: Formative feedback incorporated

### PRE-CHECK
- [ ] S04 verified
- [ ] Formative evaluation changes identified
- [ ] Figma account ready

### DO
- [ ] Create all major screens in Figma:
  - Login, portfolio dashboard, room spec input, 2D editor, 3D view, save/edit/delete
- [ ] Apply consistent navigation, colour scheme, typography
- [ ] Incorporate low-fi feedback (document what changed)
- [ ] Add interactive links between screens
- [ ] Apply HCI principles explicitly:
  - Nielsen's 10 Heuristics (visibility, error prevention, consistency, user control)
  - Gestalt principles (proximity, similarity, continuity)
  - Fitts' Law (frequent buttons large and accessible)
  - WCAG AA (contrast ratios via WebAIM, min 14px body text)
  - Feedback mechanisms (every action confirmed)
- [ ] Screenshot all screens
- [ ] Weekly commit: "High-fidelity Figma prototype"

### VERIFY
- [ ] All major screens present
- [ ] Navigation consistent throughout
- [ ] Low-fi feedback demonstrably incorporated
- [ ] HCI principles applied and can be named
- [ ] WCAG AA contrast verified
- [ ] Screenshots high-resolution with captions

### RECORD
- Figma screenshots → Section 5
- HCI principles applied → Section 5
- Feedback incorporation → Section 1.8
- Design decisions → Section 5

---

## S06 — Architecture Design
> Runnable after: High-fi prototype approved

### PRE-CHECK
- [ ] S05 verified
- [ ] Java + Swing environment confirmed

### DO
- [ ] Design layered architecture (NOT monolithic):
  - Presentation/UI layer (Swing components)
  - Business Logic layer (room calculations, furniture management)
  - Data/Model layer (persistence, design storage)
- [ ] Apply MVC pattern:
  - Model: Room, Furniture, Design classes
  - View: Swing panels
  - Controller: event handlers, business logic orchestration
- [ ] Define class responsibilities (single responsibility principle)
- [ ] Create architecture diagram (use draw.io/Lucidchart)
- [ ] Design data persistence approach (file-based or database)
- [ ] Weekly commit: "Architecture design diagram"

### VERIFY
- [ ] Architecture is NOT monolithic
- [ ] Layers interact but are separated
- [ ] MVC pattern clearly defined
- [ ] Diagram shows interactions between layers
- [ ] Class responsibilities documented

### RECORD
- Architecture diagram → Section 6
- Pattern explanation → Section 6
- Design decisions → Section 5 and Section 6

---

## S07 — Core Implementation (Login + Portfolio)
> Runnable after: Architecture locked

### PRE-CHECK
- [ ] S06 verified
- [ ] GitHub repo structure matches architecture

### DO
- [ ] Implement Model classes: Designer, Design, Portfolio
- [ ] Implement data persistence (save/load designers + designs)
- [ ] Implement login UI (Swing JFrame, JTextField, JPasswordField)
- [ ] Implement login logic (authentication)
- [ ] Implement portfolio dashboard UI (JList/JTable of saved designs)
- [ ] Implement portfolio logic (list designs for logged-in designer)
- [ ] Add input validation (empty fields, etc.)
- [ ] Add error handling (file I/O failures)
- [ ] Use meaningful names, add comments
- [ ] Named constants (no magic numbers)
- [ ] Weekly commit: "Login and portfolio management"

### VERIFY
- [ ] Designer can log in
- [ ] Portfolio dashboard displays saved designs (even if list is empty)
- [ ] Data persists after app restart
- [ ] Input validation works
- [ ] Error handling present
- [ ] Code follows architecture design
- [ ] Commit messages descriptive

### RECORD
- Screenshot login + portfolio → Section 6
- GitHub hyperlinks to code files → Section 6
- Coding approach → Section 6

---

## S08 — 2D Implementation
> Runnable after: Core app shell works

### PRE-CHECK
- [ ] S07 verified
- [ ] Login + portfolio tested

### DO
- [ ] Implement room specification input UI (dimensions, shape, colour)
- [ ] Implement room specification storage
- [ ] Implement 2D canvas (extend JPanel, override paintComponent)
- [ ] Use Graphics2D to draw room outline (rectangle/L-shape) scaled to dimensions
- [ ] Draw furniture items as shapes/rectangles with labels
- [ ] Implement furniture scaling proportional to room (2m chair in 5m room = 40% width)
- [ ] Implement furniture selection (mouse click)
- [ ] Implement colour change (whole design or selected furniture)
- [ ] Implement shading (gradient/fill on whole design or selected furniture)
- [ ] Add furniture management UI (add, remove, position)
- [ ] Weekly commit: "2D visualisation with scaling, colour, shading"

### VERIFY
- [ ] Room renders in 2D with correct proportions
- [ ] Furniture renders to scale
- [ ] User can add/remove/position furniture
- [ ] User can select furniture (click)
- [ ] Colour change works (whole + selected)
- [ ] Shading works (whole + selected)
- [ ] Room spec persists with design

### RECORD
- Screenshot 2D editor → Section 6
- GitHub hyperlink to 2D rendering code → Section 6
- Graphics2D algorithm explanation → Section 6

---

## S09 — 3D Implementation
> Runnable after: 2D fully working

### PRE-CHECK
- [ ] S08 verified
- [ ] 2D rendering tested with multiple furniture items
- [ ] 3D library chosen (Java 3D/JOGL or custom projection)

### DO
- [ ] Implement 3D view (isometric or perspective projection)
- [ ] Convert 2D layout to 3D (furniture positioned in 3D room)
- [ ] Render walls, floor, furniture with depth
- [ ] Apply basic lighting/shading for depth perception
- [ ] Add toggle button to switch 2D ↔ 3D
- [ ] Ensure 3D view reflects current 2D state
- [ ] Weekly commit: "3D visualisation with perspective and lighting"

### VERIFY
- [ ] 3D view renders with visible depth
- [ ] Furniture positioned correctly in 3D space
- [ ] Walls and floor visible
- [ ] Toggle between 2D and 3D works
- [ ] 3D view updates when 2D changes
- [ ] Learning Outcome 5 met (rasterisation API renderer)

### RECORD
- Screenshot 3D view → Section 6
- GitHub hyperlink to 3D rendering code → Section 6
- Graphics algorithm explanation → Section 6
- HCI + CG integration → Section 6 and Approach

---

## S10 — Save/Edit/Delete + Polish
> Runnable after: All 9 FR implemented

### PRE-CHECK
- [ ] S09 verified
- [ ] 2D and 3D both working

### DO
- [ ] Implement Save design (persist to file/database)
- [ ] Implement Edit design (load from portfolio, modify, save)
- [ ] Implement Delete design (remove from portfolio + storage)
- [ ] Add confirmation dialogs (delete, unsaved changes)
- [ ] Add undo/redo if targeting 70%+ (innovation)
- [ ] Add immediate feedback for all actions (status messages, visual confirmation)
- [ ] Implement error recovery (file save failure handling)
- [ ] Polish UI (consistent fonts, colors, spacing)
- [ ] Test all features end-to-end
- [ ] Weekly commit: "Save, edit, delete with feedback and polish"

### VERIFY
- [ ] All 9 functional requirements work:
  1. Login ✓
  2. Room spec input ✓
  3. 2D visualisation ✓
  4. 3D view ✓
  5. Scaling ✓
  6. Shading ✓
  7. Colour change ✓
  8. Save ✓
  9. Edit/Delete ✓
- [ ] Every action gives immediate feedback
- [ ] Error handling throughout
- [ ] Confirmation dialogs present
- [ ] UI polished and consistent

### RECORD
- Screenshots of save/edit/delete flows → Section 6
- GitHub hyperlinks → Section 6
- Feature completion status → Limitations table

---

## S11 — Summative Evaluation
> Runnable after: Application complete and polished

### PRE-CHECK
- [ ] S10 verified
- [ ] Application fully working
- [ ] Minimum 2 participants recruited (no children)
- [ ] Consent forms prepared

### DO
- [ ] Write summative test plan: objectives, tasks, timing, metrics, success criteria
- [ ] Choose evaluation method (SUS questionnaire recommended + task-based testing)
- [ ] Justify method choice
- [ ] Recruit participants (document how; ideally different from formative)
- [ ] Get signed consent forms
- [ ] Create participant demographics table (NO NAMES)
- [ ] Conduct testing on working application
- [ ] Photograph study setup
- [ ] Collect results:
  - SUS scores (calculate, compare to 68 average / 80+ excellent)
  - Task completion rates
  - Issues found
- [ ] Analyse results
- [ ] Document "areas for further work and improvement"
- [ ] Document "how user feedback was/would be incorporated" (recommendations)
- [ ] Weekly commit: "Summative evaluation results"

### VERIFY
- [ ] Minimum 2 participants (no children, identities confidential)
- [ ] Test plan complete
- [ ] Method named + justified
- [ ] Recruitment documented
- [ ] Signed consents collected
- [ ] Demographics table complete (no identifiable info)
- [ ] Photographs of study
- [ ] SUS scores calculated + charted
- [ ] Task-based results analysed
- [ ] "Areas for further work" explicitly stated
- [ ] Recommendations documented

### RECORD
- Test plan → Section 7 + Appendix
- Method + justification → Section 7
- Demographics → Section 7
- Results + analysis → Section 7
- SUS chart → Section 7
- Areas for improvement → Section 7
- Recommendations → Section 7
- Consent form template → Appendix

---

## S12 — Report + Video
> Runnable after: All work complete

### PRE-CHECK
- [ ] S11 verified
- [ ] All features implemented and tested
- [ ] All documentation collected

### DO
**Report (PDF):**
- [ ] Cover page: module name, all member names
- [ ] Roles & Responsibilities table
- [ ] Project Links: GitHub (public URL), OneDrive video (public URL)
- [ ] Table of Contents
- [ ] **Section 1 — Introduction** (~2 paragraphs + subsections 1.1-1.8)
  - Links to GitHub + video
  - Application features overview
  - Requirements list (MoSCoW)
  - Paper prototype images
  - Personas + user stories
  - Storyboards
  - Formative evaluation summary
  - Requirements gathering summary
  - Feedback incorporation
- [ ] **Section 2 — Background**
  - Scenario explanation
  - Context of use analysis (users, tasks, environment, equipment)
  - Methodology (Agile/Scrum) with justification and evidence
- [ ] **Section 4 — Gathering Data**
  - Method(s) used
  - Justification
  - Data collection process
  - Analysis approach
  - Findings
- [ ] **Section 5 — Design**
  - All requirements documented
  - Personas + user stories
  - Storyboards
  - Low-fi prototypes
  - High-fi prototypes
  - HCI principles applied with explanation
- [ ] **Section 6 — Implementation**
  - Architecture diagram (MVC/layered)
  - 2D implementation (screenshots + GitHub hyperlinks to code)
  - 3D implementation (screenshots + GitHub hyperlinks to code)
  - All features (screenshots + hyperlinks)
  - Coding approach + patterns
- [ ] **Section 7 — Evaluation**
  - Formative: method, participants, test plan, findings, changes made
  - Summative: method, participants, test plan, results, SUS scores
  - Areas for further work
  - Recommendations
  - How feedback incorporated
- [ ] **Section 8 — Summary**
  - 1-2 sentences per section summarizing key findings
- [ ] **Section 9 — References** (Harvard style)
- [ ] **Limitations Table** (% completion for all 9 objectives)
- [ ] **Appendix**
  - Blank consent forms
  - Test plans
  - Interview/survey questions
  - Raw anonymised data
- [ ] Word count check: ~2000 words narrative (images don't count)
- [ ] Convert to PDF

**Video (MP4):**
- [ ] Record 7-12 minutes (time precisely)
- [ ] Every member appears on screen
- [ ] Every member explains their specific contribution
- [ ] Demonstrate all 9 features with real data
- [ ] Walk through code with hyperlinks
- [ ] Explain design solution
- [ ] Show Figma screens, HCI principles, evaluation findings
- [ ] Discuss limitations and future work
- [ ] Technical specs: MP4, H.264, 720p+, 30fps, 16Mbps video, stereo 384kbps audio
- [ ] Upload to university OneDrive
- [ ] Set link to public access
- [ ] Test link from logged-out device on different network (ALL members test)

**Final GitHub Polish:**
- [ ] README complete: project description, how to run, all resources credited
- [ ] No .zip files of old versions
- [ ] All commit messages descriptive
- [ ] Commits weekly throughout project timeline visible
- [ ] Repository public and accessible

### VERIFY
**Report:**
- [ ] Single PDF
- [ ] Sections numbered 1, 2, 4, 5, 6, 7, 8, 9 (no Section 3)
- [ ] ~2000 words (narrative only)
- [ ] Both links in Introduction + Project Links section
- [ ] Roles table complete
- [ ] Context of use in Section 2
- [ ] Methodology in Section 2
- [ ] Requirements gathering in Section 4
- [ ] Full requirements + MoSCoW in Section 1.2
- [ ] Min 2 personas in Section 1.4
- [ ] All 9 FR user stories
- [ ] Storyboards with captions
- [ ] Low-fi images (2-4 screens) with captions
- [ ] High-fi Figma screenshots with captions
- [ ] HCI principles named + explained
- [ ] Formative eval: plan, method, demographics, findings, changes
- [ ] Summative eval: plan, method, demographics, results, SUS
- [ ] Recruitment process stated for both studies
- [ ] Min 2 participants each study, no children
- [ ] Identities confidential
- [ ] Blank consent forms in appendix
- [ ] "Areas for further work" in Section 7
- [ ] "Recommendations" in Section 7
- [ ] Architecture diagram in Section 6 (not monolithic)
- [ ] Hyperlinks to specific GitHub code files in Section 6
- [ ] 2D explanation + screenshot + hyperlink
- [ ] 3D explanation + screenshot + hyperlink
- [ ] CG algorithms explained
- [ ] Coding approach + patterns explained
- [ ] Limitations table honest percentages
- [ ] Harvard references all sources
- [ ] File is PDF not .docx

**Video:**
- [ ] 7-12 minutes
- [ ] All members appear + explain own contribution
- [ ] All 9 features demonstrated with real data
- [ ] MP4, H.264, 720p+, 30fps, correct bitrates
- [ ] OneDrive hosted, public link
- [ ] Link tested by ALL members from logged-out devices
- [ ] Link in report

**GitHub:**
- [ ] Public repo accessible
- [ ] Weekly commits from Day 1 visible
- [ ] Descriptive commit messages
- [ ] README complete with credits
- [ ] No .zip files
- [ ] Tested by ALL members

**Submission:**
- [ ] PDF uploaded to DLE
- [ ] Before 19th March 2026, 16:00 SL time
- [ ] Confirmation received

### RECORD
- Submission timestamp
- Final checklist completion
- Backup copy stored

---

## Requirements Traceability Matrix

| Requirement | Stage | Report Section | Video Timestamp |
|-------------|-------|----------------|-----------------|
| FR1: Login + Portfolio | S07 | 6 | 0:45-1:30 |
| FR2: Room Specification | S08 | 6 | 1:30-2:00 |
| FR3: 2D Visualisation | S08 | 6 | 2:00-2:30 |
| FR4: 3D View | S09 | 6 | 2:30-3:00 |
| FR5: Scaling | S08 | 6 | Integrated 2D/3D |
| FR6: Shading | S08 | 6 | Integrated 2D/3D |
| FR7: Colour Change | S08 | 6 | Integrated 2D/3D |
| FR8: Save | S10 | 6 | 3:00-3:15 |
| FR9: Edit/Delete | S10 | 6 | 3:15-3:30 |
| NFR: Usability | S05, S11 | 5, 7 | 8:30-9:30 |
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
| Formative Evaluation | S04 | 1.6, 7 | 9:30-10:00 |
| High-Fi Prototype | S05 | 5 | 8:30-9:30 |
| Architecture (MVC) | S06 | 6 | 4:00-5:00 |
| Summative Evaluation | S11 | 7 | 10:00-10:30 |

---

## Grade Target Checklist

**For 60%+ (Competent):**
- [x] All 9 FR implemented and working
- [x] Not monolithic — layered/MVC architecture evident
- [x] Minor bugs acceptable
- [x] Appropriate testing with V&V
- [x] Requirements clear and sensible
- [x] Lucid writing, evidence-based

**For 70%+ (Highly Skilled):**
- [ ] Innovation beyond taught material (drag-drop, undo/redo, templates, export, etc.)
- [ ] Strong software engineering (patterns documented)
- [ ] MVP evident
- [ ] Testing beyond basics (SUS + task-based + traceability matrix)
- [ ] Diagrams derived from requirements
- [ ] Writing approaching peer-reviewed standard

**For 80%+ (Expert):**
- [ ] Commercial-quality code
- [ ] Deployable with minimal modification
- [ ] Original thinking evident throughout
- [ ] Expert testing (SUS + A/B + metrics + statistical significance)
- [ ] Professional-standard diagrams (reusable in industry)
- [ ] Peer-reviewed journal standard writing

---

## Emergency Recovery

**If stuck at any stage:**
1. Check PRE-CHECK — are previous stages actually verified?
2. Re-read corresponding section in PUSL3122_Full_Marks_Guide.md
3. Check GitHub commits — is weekly pattern maintained?
4. Check architecture — are layers separated?
5. Don't skip stages — fix blockers, then proceed

**If deadline approaching:**
- Priority order: S07 → S08 → S09 → S10 (get all 9 FR working first)
- Then S11 (summative eval)
- Then S12 (report + video)
- All other stages feed into report — don't skip documentation

**If unsure about implementation:**
- Check PUSL3122_Full_Marks_Guide.md Phase 5 for specific algorithms
- Ask Dr Bakhshi before deviating from Java + Swing
- Document decisions in report Section 6

---

**End of Guide**
