# FULLSTACK SUPERPOWER SYSTEM v2

## Files
```
ULTIMATE_GUIDE.md   → 12 stages, rules, verify gates, recovery protocol
stack.config        → all infra decisions — fill before S01, lock after S01
.architecture       → live project state — updated every stage
README.md           → this file
```

---

## To start any project

```
1. Copy all 4 files into project root
2. Read requirement
3. Fill stack.config completely — every service, every version, every env pattern
4. Fill .architecture top section: project.name, project.type, conventions
5. Generate PROJECT_GUIDE.md:
   - Map every requirement feature to S01–S12
   - Write each stage: PRE-CHECK / DO / VERIFY / RECORD
   - Add at top: "> Follows ULTIMATE_GUIDE.md v2. stack.config locked."
6. Execute S01 → S12 in order
```

---

## Rules that never break

- App works after S04 — if it doesn't, S04 is not done
- No stage starts until previous stage VERIFY fully passed
- .architecture updated within the same stage — never later
- stack.config never changes after S01 — if it must, re-verify all affected stages
- error_shape and response_shape locked in S02 — never deviate
- Every inter-service boundary recorded as a contract in .architecture before coding it

---

## When generating PROJECT_GUIDE.md

Each stage uses this shape exactly:
```
## S[XX] — [NAME]
> Runnable after: [what works]

### PRE-CHECK
### DO
### VERIFY
### RECORD
```

S04 must deliver the core feature end to end in the browser.
S02–S04 deliver a minimum viable working app.
S05–S12 improve and complete it.

---

## Recovery

Broke something:
1. Open .architecture — find contract — find deviation — fix deviation only
2. Re-run VERIFY for that stage
3. Update .architecture
4. Continue

Never rewrite. Never rearchitect. Fix the deviation.
