
## Goal

Drive the real `/admin/*` surface (not `/demo/admin/*`) from an empty first-time-user state through a fully populated state as the signed-in coach, fix any regression found along the way, and hand back a PASS/FAIL report per step plus a summary of defects and fixes.

## Precondition (blocker)

The sandbox currently reports `LOVABLE_BROWSER_AUTH_STATUS=signed_out`. Real `/admin/*` routes are gated by `ProtectedRoute` → `/sign-in`. Playwright cannot reach them until a managed Supabase session is injected.

Two ways forward — pick one before I execute:

- **A. You sign in once via the Lovable preview** (Google on `/sign-in`). On your next message the session auto-injects, Playwright restores it, and the run below executes against the real coach account. Recommended — this is what "end-to-end" implies.
- **B. Run the same script against `/demo/admin/*`** (SeedDataProvider, in-memory). Exercises the same UI code but does not touch RLS, `handle_new_user`, Supabase mutations, or persistence across reload. Useful as a UI smoke test, not a real E2E.

I'll assume **A** unless you say B.

## Test script (real `/admin/*`, executed as the signed-in coach)

Every step: PASS/FAIL, screenshot, fix-on-failure, re-run failing step before continuing.

### Phase 0 — FTUX / provisioning
1. Restore session, navigate to `/admin/bookings`. Expect: route resolves, no redirect to `/sign-in`.
2. Confirm `handle_new_user` provisioned a `public.profiles` row for the signed-in user (SQL check via `supabase--read_query`).
3. `get_owner_coach_id()` returns that user's id (SQL check). This is what anon booking/contact submissions bind to.
4. All four admin pages render an empty state, not a crash: `/admin/bookings` (BookingsBlankslate, links to `/admin/availability`), `/admin/messages` (MessagesBlankslate), `/admin/availability` (weekly grid with defaults + buffer 24h), `/admin/programs` (ProgramsBlankslate with "Add program" CTA).

### Phase 1 — Availability (populate first, because the public /book calendar depends on it)
5. Set Mon–Fri available 9:00 AM–5:00 PM, Sat/Sun off. Save. Toast success. Reload → values persisted.
6. Buffer: change to 48h, save, reload → persisted; profile.booking_buffer_hours = 48.
7. Validation: end ≤ start → toast error, no save. Invalid time string → toast error.
8. Date override: add tomorrow's date as blocked. Reload → persists. Remove it → persists.
9. Cross-check on public `/book`: Sat/Sun disabled; today+ within buffer disabled; a valid weekday in-range shows expected slots.

### Phase 2 — Programs (add / edit / reorder / deactivate)
10. Add program #1 with all 4 required fields; multi-line "what we cover". Modal closes, row appears.
11. Add programs #2 and #3.
12. Edit #2 (change name + duration). Row reflects update.
13. Field validation: submit with empty name → inline error, no create.
14. Drag-reorder #3 above #1. Reload → `display_order` persisted in that order.
15. Toggle #2 inactive. Public `/programs` no longer shows it; `/` teaser hides it; `/programs` still renders (no empty gap regression — the D-3 fix).
16. Deactivate all three → `/programs` bands section returns null, teaser hides, page still renders header + FAQ.

### Phase 3 — Anon booking + contact happy paths (now unblocked by Phase 1+2)
17. As anon, open `/book`, pick a valid slot, submit goals form. Expect: insert succeeds, no RLS 401, confirmation screen shown, no `.select().single()` read-back error.
18. As anon, submit `/contact`. Same expectation.
19. Row visible in DB (SQL check) with `coach_id = get_owner_coach_id()`.

### Phase 4 — Bookings admin (populated)
20. Back as coach on `/admin/bookings`. New booking appears under Upcoming.
21. Open detail sheet: name, email, goals, program (if any), booked datetime all render.
22. Confirm / cancel / reschedule actions (whichever the sheet exposes) — verify state transition + tab move (Upcoming ↔ Cancelled, Past for dates ≤ now).
23. Tab counts and empty copies correct for Past / Cancelled when empty vs populated.

### Phase 5 — Messages admin (populated)
24. `/admin/messages` shows the new contact message under All + New.
25. Open it → auto-marks read, moves from New tab to Read tab.
26. Archive → disappears from all three tabs; DB row soft-deleted (status/archived flag set).
27. Sort: newest first across All/New/Read.

### Phase 6 — Chrome + regressions
28. Sidebar/offcanvas at 375/768/1024/1440 across all four admin pages — no clipping, trigger reachable on mobile.
29. Sign out from the account menu → redirects, `/admin/*` now redirects to `/sign-in`.
30. Sign back in → lands back on last admin route (or `/admin/bookings` fallback).

## Fix-on-failure policy

- Sacred folders (`components/ui/`, `components/ai-elements/`): leave alone per your standing instruction; the tsconfig excludes stay in place.
- Any other regression (RLS, data-provider hook, admin page, layout): patch in source, re-run the failing step, continue.
- Every fix noted in the final report with file + one-line rationale.

## Deliverable

A single findings report with:
- PASS/FAIL/BLOCKED per numbered step, with screenshot filename.
- Defects found with root cause + fix applied (or "not fixed — needs decision").
- Confirmation that `vite build` and `tsc --noEmit` still pass at the end (sacred-folder exclusions unchanged).
- Any residual BLOCKED items and why.

## What I need from you before I start

Confirm **A vs B** above. If A, sign in once in the preview (any provider) and send any short message — the session injects and I execute the full script in the next turn.
