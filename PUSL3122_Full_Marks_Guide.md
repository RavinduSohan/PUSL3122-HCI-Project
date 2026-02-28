# PUSL3122 HCI, Computer Graphics & Visualisation
# Complete Full-Marks Guide — Verified Against All Three Documents

---

## Critical Admin Facts (Know These Cold)

| Item | Detail |
|---|---|
| Submission deadline | **19th March 2026, 16:00 SL time** (10:30 UK Winter / 11:30 UK Summer) |
| Late penalty | **0% — absolute, no exceptions** |
| Module weight | This coursework = 50% of your entire module grade |
| Group size | Up to 6 members |
| Submission format | **Single PDF via DLE only** — no other format accepted |
| Word limit | ~2000 words — **marker stops reading at exactly 2000** |
| Video limit | 7–12 minutes — **marker stops watching at 12 minutes** |
| Feedback returned | By 3rd April 2026 (within 20 working days) |
| Module Leader | Dr Taimur Bakhshi — ruttbakhshi@plymouth.ac.uk |

---

## ⚠️ Four Instant-Zero Traps

**1. Submitting after 16:00 SL time** = 0%. No appeals on this.

**2. Linking to external files instead of putting work in the PDF** = 0%. The brief says this twice in bold underlined text. Your GitHub link and video link are fine. Linking your actual report content to a Google Drive folder, Dropbox, etc. is not.

**3. GitHub or video link not publicly accessible** = those sections cannot be marked. Test both links from a logged-out device on a different network. Every single group member must do this independently before submission.

**4. A monolithic application** = capped below 60% on the Application section (40% of your mark). One giant class file will not pass this module at a decent grade regardless of how many features work.

---

## ⚠️ You May Be Called In for a Video Interview

The brief explicitly states: *"You may be invited to an online video call for further discussion at a later date."*

Every member must genuinely understand every part of the project, especially their own contribution. Do not attach your name to code you did not write or design work you did not do.

---

## What You Are Building

A **web-based furniture room visualisation application** for interior designers to use during in-store customer consultations. Designers log in, enter a customer's room specifications, then arrange furniture and visualise the result in 2D and 3D.

**The preferred language is Java with Swing APIs and the integrated computer graphics library.** If your group wants to use a different language, you must discuss this with Dr Bakhshi first — do not assume it is acceptable.

### The Scenario in Full (Appendix A of the brief)

A furniture retailer wants to enhance the in-store experience. During consultations, designers use the app to create a virtual representation of the customer's room, showing how furniture pieces look together. The app lets customers make informed choices about whether furniture fits spatially and aesthetically. **Designers log in to manage their design portfolio.**

Note the phrase "manage their design portfolio" — this means the login isn't just for authentication. It implies a portfolio dashboard where designers can view all their saved designs and manage them. This is a more complete feature than just a save button.

### All Nine Functional Requirements — Must Implement All of Them

| # | Requirement | Notes |
|---|---|---|
| 1 | Designer **login** system | Designers manage their design portfolio — implies a dashboard/list view of designs |
| 2 | Enter and **store room specifications** | Size, shape, colour scheme |
| 3 | **Create new designs** and visualise in **2D** | Arranging furniture shapes in a 2D floor plan |
| 4 | Convert designs to **3D view** | Realistic perspective/isometric view of the room |
| 5 | **Scale** furniture to fit room dimensions | Proportional scaling relative to room size |
| 6 | Apply **shading** to entire design or selected pieces | Applied to whole design or individual furniture items |
| 7 | **Change colours** for entire design or selected pieces | Applied to whole design or individual furniture items |
| 8 | **Save** completed designs | Persistent storage, accessible later |
| 9 | **Edit or delete** existing designs | From the design portfolio / dashboard |

### All Seven Non-Functional Requirements

These are not optional extras — they map directly to the Design & Testing marking category.

| Requirement | What markers want to see |
|---|---|
| **Usability** | Intuitive, consistent interface, minimal training required |
| **Performance** | 2D and 3D render without noticeable delays |
| **Accessibility** | Colour contrast, font sizes, navigation follow accessibility guidelines (WCAG AA minimum) |
| **Feedback** | Immediate visual or textual confirmation of every action (saving, scaling, colour changes) |
| **Error Prevention & Recovery** | Clear prompts and undo options available |
| **Efficiency** | Designers complete tasks with minimal steps |
| **Engagement** | 3D visualisation is visually appealing and immersive |

---

## Marking — Every Category, Every Grade Band, Every Sub-Criterion

### Application (40% of coursework)

**The specific criteria markers use (from the rubric):**
- Implementation of interface design is appropriate
- Implementation of computer graphics algorithms is appropriate
- Implementation of code demonstrates good quality coding approaches
- Application is shown running in the video
- Implementation of code uses appropriate design solutions (patterns, not a monolith)
- Clear indication of innovative and proactive thought going beyond materials provided
- GitHub commits are appropriate and not left to just before the deadline

**Grade bands:**

| Band | What it looks like |
|---|---|
| <30% | No real coding evidence; nothing implemented |
| 30–39% | Broken or confused code; requirements barely implemented; inconsequential |
| 40–49% | Some features work with errors; more than just login/registration exists |
| 50–59% | Moderate complexity, mostly working, some errors; requirements matched with some omissions |
| 60–69% | Competent; minor bugs; **not monolithic** — shows layered architecture with interactions between layers; meaningful requirement choices; appropriate complexity |
| 70–79% | Highly skilled beyond taught content; good complexity; strong software engineering; MVP clearly evident; requirements indicate minimum viable product |
| 80–100% | Commercial quality; deployable with minimal modification; professional standard; expert skill evident throughout |

**The 60% gate is architecture.** The rubric says exactly: *"Application is of suitable complexity and appropriate architecture which is not monolithic but demonstrates interactions between levels and/or layers."* If you have one class doing everything, you cannot score above 60% on this section.

**The 80% gate is innovation.** Your code and its documentation must show original thinking and proactive development that clearly goes beyond what was taught in the module.

---

### Design & Testing (40% of coursework)

**The specific criteria markers use (from the rubric):**
- Appropriate use of UI components to provide a suitable HCI experience
- Interface design illustrates clear application of robust usability testing and HCI principles
- Application architecture demonstrates suitable use of computer graphics algorithms
- Tests have been designed to evaluate the application appropriately

**Grade bands:**

| Band | What it looks like |
|---|---|
| <30% | No testing plan; no requirements shown; images sparse, illegible, or irrelevant |
| 30–39% | Poor application of testing; incorrect or confused; requirements vague and poorly defined; no diagrams |
| 40–49% | Some relevant testing; V&V superficial and sparse; requirements present but need more development; limited understanding in diagrams |
| 50–59% | Appropriate testing in place with omissions/errors; requirements presented with diagrams; some questionable logic |
| 60–69% | Competent testing plan with appropriate Validation and Verification; requirements clear and sensibly defined; appropriate for project complexity |
| 70–79% | Highly competent testing regime in both plan and implementation; demonstrates understanding above and beyond taught modules; diagrams clearly derived from requirements |
| 80–100% | Expert testing plans suitable for commercial use; excellent requirements with little to add; diagrams could be used in a professional setting; peer-reviewed journal standard visuals |

**Key term: V&V.** Verification = did you build the system correctly (code review, unit tests)? Validation = did you build the right system (user testing against requirements)? Both must appear in your report to score well.

---

### Approach (20% of coursework)

**The specific criteria markers use (from the rubric):**
- Illustration provided for how HCI and computer graphics aspects were applied
- Coding approach outlined
- How the application meets the needs of the scenario demonstrated
- Reflection at an appropriate depth, showing understanding of design solutions and their application

**Grade bands:**

| Band | What it looks like |
|---|---|
| <30% | Writing incomprehensible; no attempt to go beyond brief |
| 30–39% | Poor literacy; inadequate and poorly defined innovation plan |
| 40–49% | Mainly appropriate writing style but could improve; innovation vague or unjustified |
| 50–59% | Clear writing and presentation; relevant features considered; accuracy or clarity could improve |
| 60–69% | Lucid, unambiguous writing; logical consideration of innovative features, mostly evidence-based and clearly articulated |
| 70–79% | Writing approaching peer-reviewed standard; innovations well-presented and well-justified |
| 80–100% | Professional-level writing; clear, concise, fully justified innovation plan showing original thinking and proactive development |

---

## Step-by-Step: What to Do and When

### Phase 1 — Setup and Requirements Gathering (Week 1)

**Set up GitHub immediately.** Commits must be weekly from Day 1. This is graded.

**Analyse the scenario** — specifically identify the *context of use*. This is an explicit requirement in the brief (line 85) and a formal HCI concept from ISO 9241-11:
- **Users:** Interior designers (primary); customers (secondary, watching the screen)
- **Tasks:** What designers do step by step during a consultation
- **Equipment:** Web browser on a desktop/laptop in a furniture store
- **Environment:** In-store, customer present, time pressure of consultation

Document this context of use analysis — it goes into Section 2 (Background) of your report.

**Gather your own requirements** beyond what the brief provides. Use at least one formal technique taught in the module. Name it, justify why you chose it, and document it all:

- Interviews with potential users (interior designers, store staff)
- Questionnaires or surveys
- Observation / contextual inquiry
- Focus groups

Document: how you recruited participants, what questions you asked (put questions in appendix), how you analysed the results (e.g. thematic analysis, affinity mapping), and what additional requirements emerged.

**Build your full requirements list:**
- Combine the brief's 9 functional + 7 non-functional requirements with your gathered requirements
- Apply MoSCoW prioritisation: Must / Should / Could / Won't
- Every requirement traceable to a source (brief or your research)

**Define your methodology:** Agile SDLC with Scrum is explicitly required by the brief. Set up:
- Product backlog (all features as user stories, prioritised by MoSCoW)
- Sprint plan (suggest 1-week sprints)
- Communication channel for the team
- Document this — it goes in your report

---

### Phase 2 — Personas, User Stories, Storyboards (Week 1–2)

**Personas (at least 2):**
- Name, age, occupation, tech literacy level, goals, frustrations, context of use
- Each persona tied to specific requirements — show the traceability

**User stories for every functional requirement:**
- Format: *"As a [designer], I want to [action] so that [goal]"*
- Cover all 9 functional requirements plus key non-functional ones

**Storyboards:**
- A comic-strip sequence showing a realistic consultation scenario
- Suggested flow: designer greets customer → opens app → logs in → enters room specs → adds furniture → adjusts in 2D → switches to 3D → customer approves → saves design
- Hand-drawn is fine — what matters is clarity, not artistry
- Scan/photograph and include in report as figures with captions

---

### Phase 3 — Low-Fidelity Prototype and Formative Evaluation (Week 2–3)

**Low-fidelity prototype:**
- Sketches or simple wireframes of at least 2–4 screens
- Cover the core flows: login, room setup, 2D editor, 3D view, portfolio/dashboard
- These are used to gather initial feedback — they do not need to look polished

**Formative user evaluation — every single one of these must appear in the report:**
- Minimum **2 participants** — no children (under 18, explicitly prohibited in the brief), identities never disclosed
- Explain specifically how participants were **invited and recruited**
- Use one formal user testing method taught in the module, e.g.:
  - Think-aloud protocol
  - Cognitive walkthrough
  - Heuristic evaluation against Nielsen's 10 heuristics
  - Paper prototype testing
- Written **test plan** (objectives, tasks list, timing, success criteria, metrics)
- **Signed consent forms** — include a blank template copy in the appendix
- **Participant demographics table** — age range, tech experience level, occupation. No names. No identifiable information ever.
- Photographs of the study setting (the brief specifically mentions this as acceptable evidence)
- Findings: list usability issues found with severity ratings
- **What you changed in your design as a direct result of this feedback** — this is explicitly required

---

### Phase 4 — High-Fidelity Prototype (Week 3–4)

Use **Figma** (explicitly recommended by the brief) or an equivalent prototyping tool.

**Must include:**
- All major screens: login, portfolio dashboard, room spec input, 2D editor, 3D view, save/edit/delete
- Consistent navigation structure, colour scheme, and typography throughout
- Explicit evidence that low-fi evaluation feedback was incorporated — state what changed and why
- Interactive links between screens to simulate real app flow

**HCI principles to visibly apply — markers specifically look for these:**
- **Nielsen's 10 Usability Heuristics**: system status visibility, error prevention, recognition over recall, consistency and standards, user control and freedom
- **Gestalt principles** in layout: proximity (group related elements), similarity, continuity
- **Fitts' Law**: buttons used most frequently should be large and easily reachable
- **Accessible design**: WCAG AA minimum — check all colour contrast ratios (use a tool like WebAIM), font sizes minimum 14px for body text
- **Feedback mechanisms**: every action (save, delete, colour change) gives immediate confirmation

---

### Phase 5 — Implementation (Week 3–6)

**Language:** Java + Swing APIs + integrated computer graphics library. Any deviation requires prior approval from Dr Bakhshi.

**Architecture — this is the single most important technical decision:**

The rubric explicitly states that to score 60%+ the application must demonstrate *"interactions between levels and/or layers"* and must not be monolithic.

- Use **layered architecture**: Presentation/UI layer → Business Logic layer → Data/Model layer
- Apply **MVC design pattern** — well-suited to this type of UI-driven application
- Classes must have single responsibilities — a RoomPanel class does not also handle file saving
- Name and explain your architecture in the report with a diagram

**Computer graphics — required features and how to implement them:**

*2D (using Java `Graphics2D`):*
- Draw room outline as a shape (rectangle, L-shape, etc.) scaled to actual room dimensions
- Draw furniture items as labelled rectangles/shapes positioned within the room
- Scale furniture proportionally relative to the room — a 2m chair in a 5m room takes 40% of room width
- Colour fill — change colour of the whole design or a selected furniture item (click to select)
- Shading — apply gradient or fill shade to whole design or selected item
- Must be interactive: user clicks a furniture piece to select it, then applies colour/shading

*3D:*
- Convert the 2D layout into a 3D view — at minimum, a basic isometric or perspective projection
- Use Java 3D API, JOGL, or implement a basic custom perspective projection
- Show furniture items positioned in a 3D room with walls, floor
- Apply basic lighting/shading to give depth
- This directly addresses **Learning Outcome 5**: *"implement a simple real-time renderer using a rasterisation API"*
- This also appears in the **Design & Testing rubric**: *"Application architecture demonstrates suitable use of computer graphics algorithms"*
- And in the **Approach rubric**: *"Illustration provided for how HCI and computer graphics aspects applied"*

**Code quality — the specific things markers look at:**
- Meaningful names for all variables, methods, and classes
- Comments on all non-obvious logic blocks
- No dead code or commented-out experiments left in
- Exception handling throughout (invalid room dimensions, file save failures, etc.)
- Input validation (negative dimensions, empty fields, division by zero)
- Named constants — no magic numbers scattered through the code
- Design patterns used and documented (MVC, Observer for UI updates, etc.)
- Good separation of concerns — UI code and business logic are not mixed

**GitHub — graded as part of the Application category:**

The brief lists specific GitHub grading criteria:
- README contents: must include all additional resources and they must be fully credited
- **No previous versions in .zip or compressed format** — use commits/branches for version history
- Commits must be **appropriately commented** (descriptive messages, not "update" or "fix")
- Commits made in a **consistent and timely manner, at least once every week**

Set up the repository on Day 1. Make it public. Commit something meaningful every week even during design phases (add wireframes, requirements docs, personas). Late dumping of code is visible in the commit history and will cost marks.

---

### Phase 6 — Summative Evaluation (Week 5–6)

Formal user testing on the working implemented application.

**All of the following must appear in the report:**
- Minimum **2 participants** (ideally different from formative study; no children; identities never disclosed)
- Explain how participants were invited and recruited
- Written test plan (objectives, task list, timing, metrics, success criteria)
- A recognised evaluation method — SUS questionnaire, task-based usability testing with completion rates, A/B testing
- Signed consent forms — blank copy in appendix
- Participant demographics table (no names)
- Photographs of the session setup
- Results with analysis
- Clear identification of **areas for further work and improvement** (the brief requires this phrase explicitly)
- Explanation of **how user feedback was or would be incorporated back into the software** — the brief calls this "recommendations"

**Strongly recommended — System Usability Scale (SUS):**
Give every participant the standard 10-question SUS after testing. Calculate scores. 68 is average, 80+ is excellent. Present as a bar chart. This shows markers you know formal evaluation metrics beyond basic observation.

---

### Phase 7 — Report (Week 6–7)

**Format:** Single PDF. ~2000 words of written narrative. Word count does NOT include images, figures, screenshots, diagrams, or prototypes. Pack in as many visuals as you need.

---

#### The Report Section Numbering Situation

**This is important.** The brief specifies report sections numbered 1, 2, 4, 5, 6, 7, 8, 9 — Section 3 does not exist in the brief (it was deleted from the original document and the gap remains). The template gives you a different internal structure with subsections. Here is how they relate and what your report should actually contain:

**The brief's numbered sections are what markers look for.** The template's subsections tell you how to fill those sections. Use the brief's numbering exactly — including the gap at 3 — because that matches the marking rubric.

---

#### Complete Report Structure

**COVER PAGE** *(before word count):*
- PUSL3122 HCI, Computer Graphics and Visualisation
- All group member names (up to 6)
- Note: convert to PDF before submitting

**ROLES AND RESPONSIBILITIES TABLE** *(before word count):*

| Member Name | Role | Responsible For |
|---|---|---|
| Name | e.g. Project Lead | e.g. Overall coordination, 3D rendering |
| Name | e.g. UI Developer | e.g. Swing components, Figma prototypes |
| ... | ... | ... |

**PROJECT LINKS** *(before word count):*
- GitHub repository (source code): [public URL]
- OneDrive video presentation: [public URL]
- Note: *"Please ensure that above links can be viewed by module leader — have more than a few group members test it before you submit."*

**TABLE OF CONTENTS** *(with page numbers)*

**[WORD COUNT BEGINS HERE]**

---

**Section 1 — Introduction** *(approximately 2 paragraphs, as specified by brief)*

Introduce the document and signpost what the reader will find in each section. Provide links to your GitHub repository and your video. State that it is the students' responsibility to ensure links are accessible.

*Template subsections to include within Section 1:*
- **1.1 Application Features** — overview of main features implemented
- **1.2 Functional and Non-Functional Requirements** — your full combined requirements list (brief requirements + your gathered requirements), MoSCoW prioritised
- **1.3 Paper-based Prototype** — insert sketches/wireframe images of 2–4 interfaces with figure captions
- **1.4 Bringing Requirements to Life** — personas (at least 2) and user stories
- **1.5 Storyboards** — insert storyboard images showing the full consultation flow
- **1.6 Mock Evaluations** — formative evaluation: test plan, method used with justification, participant demographics, findings, specific design changes made as a result
- **1.7 User Feedback** — your requirements gathering technique: method, why chosen, how data analysed, findings
- **1.8 Feedback and Updates** — how evaluation feedback was incorporated into design decisions

---

**Section 2 — Background**

Explain the scenario in full: the furniture retailer, in-store consultation context, what problem the app solves. State who the potential users are and what they need.

**Critically: include your Context of Use analysis here.** This is explicitly required by the brief ("Analyse the scenario to identify the context of use and the user(s)"). Cover:
- Who the users are (primary: designers; secondary: customers)
- What tasks they perform and in what order
- The environment (in-store, consultation setting, time constraints)
- Equipment (browser on desktop/laptop)

Also include your methodology here: name Agile/Scrum, justify choosing it for this project, show evidence (sprint table, backlog screenshot, burndown chart if you have one).

---

*[Section 3 does not exist — this is not an error in your report, it matches the brief]*

---

**Section 4 — Gathering Data**

Explain in detail how further requirements were gathered beyond what the brief provided:
- Which method(s)/technique(s) you used
- Why you chose those methods (justify)
- How you carried out the data collection
- How the data was analysed
- What requirements or insights emerged

---

**Section 5 — Design**

Present the full design of the application:
- Documentation of all requirements (functional and non-functional, with MoSCoW)
- Personas and user stories
- Storyboards (images with captions)
- Low-fidelity prototypes (sketches — images with captions)
- High-fidelity prototypes (Figma screenshots — images with captions)
- Discussion of design decisions from a usability perspective — name the HCI principles you applied and explain how they influenced specific design choices

---

**Section 6 — Implementation**

Illustrate with screenshots and **hyperlinks to your source code in your GitHub repository** how you implemented your design. The brief specifically requires hyperlinks to code files — not just a general GitHub link.

- Describe your architecture (MVC/layered) with a diagram
- Show and explain the 2D implementation with a screenshot + GitHub link to relevant file
- Show and explain the 3D implementation with a screenshot + GitHub link to relevant file
- Show scaling, colour change, shading with screenshots
- Show login and portfolio management with screenshots
- Explain your coding approach — what patterns you used and why
- Provide narrative so the reader understands what each screenshot shows

---

**Section 7 — Evaluation**

Present full details of both your formative and summative user studies:
- For each study: method used with justification for why you chose that specific method
- Participant demographics (no names, no identifiable information)
- How participants were recruited and invited
- Consent form process (blank form in appendix)
- How the study was set up and conducted
- Evidence of the study setting (photographs)
- Full details of the test plan
- Results and analysis (SUS scores, task completion rates, issues found)
- **Areas for further work and improvement** — the brief requires this phrase
- How user feedback was incorporated or would be incorporated (recommendations)

Participants' identity must not be disclosed. No children.

---

**Section 8 — Summary**

Briefly summarise your work and highlight the main points from each section. This is a genuine summary — not a repeat of content. One or two sentences per section pointing to the most important findings or outcomes.

---

**Section 9 — References**

Harvard referencing style. Every source cited in the body of the report must appear here.

Suggested sources to cite:
- Sharp, H., Rogers, Y. & Preece, J. — *Interaction Design: Beyond Human-Computer Interaction*
- Nielsen, J. — Usability Engineering or Nielsen Norman Group website articles
- ISO 9241-11 (definition of usability and context of use)
- Shneiderman, B. — *Designing the User Interface*
- Java API documentation
- Any external libraries or APIs used

**[WORD COUNT ENDS HERE]**

---

**LIMITATIONS TABLE** *(after word count — use this exact table from the official template):*

The brief says: *"Compare your project against the criteria set out in Appendix A and comment on % completion. Be fair and clear in completing this section."* Markers respect honest self-assessment. Do not inflate percentages — they will verify against your code and video.

| Objective | % Completion | Comments |
|---|---|---|
| Customer can provide the size, shape and colour scheme for the room | | |
| Customer can create a new design based on the room size, shape and colour scheme | | |
| Customer can visualise the design in 2D | | |
| Customer can visualise the design in 3D | | |
| Customer can scale the design to best fit the room | | |
| Customer can add shade to the design as a whole or selected parts | | |
| Customer can change the colour of the design as a whole or selected parts | | |
| Customer can edit/delete the design | | |
| Customer can save the design | | |

**REFERENCES** *(Harvard style — same as Section 9 but placed here if you put references at end)*

**APPENDIX** *(no word limit):*
- Blank consent form
- Full test plans (formative and summative)
- Interview/survey questions used for requirements gathering
- Raw anonymised user study data
- Any additional screenshots, diagrams, or data

---

### Phase 8 — Video (Week 7)

**Where to host:** The brief mentions "YouTube video" in one section and "university OneDrive" in the detailed video section. The detailed section is the authoritative one: *"A link to the video from your university OneDrive should be included in the main document. No other submission type will be accepted."* Host on OneDrive. The YouTube reference in the brief appears to be a legacy inconsistency.

**Length:** 7–12 minutes exactly. Marker stops at 12 minutes.

**Every group member must appear clearly on screen and explain their own specific contribution.** The brief underlines the word "their" — each member highlights their part.

**The software must be shown running with real, meaningful data — not placeholder content.**

**Required video content:**
- Demonstrate the functionality of the project (all 9 requirements working)
- Explain the design solution
- Go through the code and explain relevant blocks of your Java coding
- Demonstrate the program running with data

**Technical specifications — mandatory:**

| Setting | Required |
|---|---|
| File type | MP4 |
| Resolution | 720p or 1080p |
| Framerate | 30 fps |
| Video bitrate | 16 Mbps |
| Audio bitrate | Mono 128 kbps / Stereo 384 kbps |
| Compression | H.264 |
| Speed | Normal — no fast-forwarding |

**Suggested structure to hit everything in time:**
- 0:00–0:45 — Introduction: team names and what the app does
- 0:45–3:30 — Full live demo of all 9 features with real data (login → portfolio → room setup → 2D → 3D → scale → colour → shade → save → edit → delete)
- 3:30–8:30 — Each member explains and walks through their specific code contribution
- 8:30–10:30 — Design walkthrough: Figma screens, HCI principles applied, evaluation findings, what you changed
- 10:30–12:00 — Limitations, future work, and close

---

## Full Pre-Submission Checklist

### GitHub
- [ ] Repository is public — tested from a completely logged-out device on a different network
- [ ] Commits made at minimum once every week from Day 1 of the project
- [ ] All commit messages are descriptive and meaningful
- [ ] README includes: what the project is, how to run it, all external resources and libraries fully credited
- [ ] No `.zip` or compressed files of old versions in the repository
- [ ] Link tested independently by every single group member

### Video
- [ ] Between 7 and 12 minutes — timed precisely
- [ ] Every member appears on screen and explains their own contribution
- [ ] Software shown running with real data (not placeholder/demo data)
- [ ] MP4, H.264, 720p+, 30fps, correct audio bitrate
- [ ] Hosted on university OneDrive
- [ ] Link is publicly accessible — tested from a logged-out device by every group member
- [ ] Link included in the report in the Introduction and in the Project Links section

### Report / PDF
- [ ] Single PDF file
- [ ] Sections numbered 1, 2, 4, 5, 6, 7, 8, 9 — matching the brief exactly (no Section 3)
- [ ] ~2000 words of written narrative only — images and figures are not counted
- [ ] GitHub link in Section 1 Introduction
- [ ] Video link in Section 1 Introduction
- [ ] Both links in the Project Links section before the word count
- [ ] Roles and Responsibilities table completed for all members
- [ ] Context of use analysis in Section 2 (users, tasks, environment, equipment)
- [ ] Agile/Scrum methodology named, justified, and evidenced in Section 2
- [ ] Requirements gathering method named, justified, documented in Section 4
- [ ] Full requirements list combining brief requirements + gathered requirements, MoSCoW prioritised
- [ ] Personas (at least 2) tied to specific requirements
- [ ] User stories for all 9 functional requirements
- [ ] Storyboards included as labelled figures
- [ ] Low-fidelity prototype images (2–4 screens minimum) with figure captions
- [ ] High-fidelity Figma prototype screenshots with figure captions
- [ ] HCI principles named and applied with explanation in Section 5
- [ ] Formative evaluation: test plan, method named + justified, participant demographics, findings, specific design changes made
- [ ] How participants were invited and recruited — explicitly stated
- [ ] Blank consent form in appendix
- [ ] Summative evaluation: test plan, method, participant demographics, results
- [ ] At least 2 participants per study
- [ ] No children in any study — confirmed
- [ ] Participant identities never disclosed anywhere
- [ ] Areas for further work and improvement stated in Section 7
- [ ] How user feedback was incorporated back into the software (recommendations) in Section 7
- [ ] Architecture diagram in Section 6 (not monolithic, MVC or layered)
- [ ] Hyperlinks to specific code files in GitHub repo — not just the general repo link
- [ ] 2D implementation explained with screenshots + GitHub hyperlinks
- [ ] 3D implementation explained with screenshots + GitHub hyperlinks
- [ ] Computer graphics algorithms explained in the report (required by Approach rubric)
- [ ] Coding approach and design patterns outlined (required by Approach rubric)
- [ ] Limitations table completed honestly with real percentages
- [ ] Harvard references for all sources cited
- [ ] Document converted to PDF before uploading — not submitted as .docx

### Application
- [ ] All 9 functional requirements implemented and working
- [ ] Login system works
- [ ] Design portfolio dashboard (list of saved designs) works
- [ ] Room specification input and storage works
- [ ] 2D visualisation with furniture rendered to scale works
- [ ] 3D view works with depth/perspective
- [ ] Scaling works proportionally relative to room dimensions
- [ ] Shading works on whole design or selected furniture
- [ ] Colour change works on whole design or selected furniture
- [ ] Save works and data persists after closing/reopening
- [ ] Edit works
- [ ] Delete works
- [ ] Layered or MVC architecture — demonstrably not a monolith
- [ ] Error handling throughout (file save failures, invalid input, etc.)
- [ ] Input validation (negative dimensions, empty required fields, etc.)
- [ ] Code is commented throughout
- [ ] Named constants — no magic numbers
- [ ] Design patterns used and named in the report
- [ ] GitHub commits are consistent and weekly throughout — not dumped at the end

---

## The Difference Between 70% and 80%+

**Application:** Implement something beyond what was taught. Real ideas: drag-and-drop furniture placement with snap-to-grid, real-time 3D rotation with mouse controls, a furniture catalogue with images and dimensions, room shape templates (rectangular, L-shaped, open plan), an undo/redo stack, export room design as a PNG, multiple designer accounts with separate portfolios. Document each innovation in the report: what it is, why it adds value to the specific consultation scenario, how you implemented it. This is what "proactive development" means in the rubric.

**Design & Testing:** Use SUS — score it, chart it, interpret it against the 68 (average) and 80 (excellent) benchmarks. Show V&V explicitly: label what is Verification (unit tests, code review) and what is Validation (user testing against requirements). Show requirements traceability — a table where each test case links to a named requirement. This is what "expert testing suitable for commercial use" looks like.

**Approach:** Write like you're writing for a professional audience. Every design decision has a cited justification. Every HCI principle applied is named and referenced. Every evaluation method chosen has a reason. Your innovation ideas are not just listed — they are argued for with evidence. Sentences are tight; nothing is vague. This is what "peer-reviewed journal standard" means in the rubric.

**Visuals:** Every single figure has a figure number and a meaningful caption that describes what it shows and why it matters. Screenshots are high resolution. Diagrams are drawn cleanly (use draw.io, Lucidchart, or similar — not hand-drawn for architecture diagrams). Every diagram can be traced back to a requirement.

---

## All Resource Links from the Documents

| Resource | URL |
|---|---|
| Figma prototyping | https://www.figma.com/prototyping/ |
| University referencing guide | http://plymouth.libguides.com/referencing |
| Cite Them Right Online | https://www.citethemrightonline.com/ |
| Checking assignment references | https://aldinhe.ac.uk/product/learnhigher-resources/checking-your-assignments-references/ |
| Turnitin Draft Coach | https://ec.plymouth.ac.uk/turnitin-draft-coach/ |
| Turnitin for students (brief) | https://www.plymouth.ac.uk/about-us/teaching-and-learning/digital-education/turnitin-for-students |
| DLE submission portal | https://dle.plymouth.ac.uk/course/view.php?id=32227 |
| Plagiarism policy | https://www.plymouth.ac.uk/student-life/your-studies/essential-information/regulations/plagiarism |
| Examination offences | https://www.plymouth.ac.uk/student-life/your-studies/essential-information/exams/exam-rules-and-regulations/examination-offences |
| Extenuating circumstances policy | https://www.plymouth.ac.uk/uploads/production/document/path/22/22876/Extenuating_Circumstances_Policy_and_Procedures.pdf |
| Academic skills development | https://liveplymouthac.sharepoint.com/sites/x77/SitePages/Academic-Skills-Development.aspx |
