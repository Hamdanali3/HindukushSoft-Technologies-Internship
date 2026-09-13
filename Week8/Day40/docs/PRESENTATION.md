# TaskFlow — Project Presentation Script

**Purpose of this document:** a speaker-notes-style script for presenting TaskFlow as the internship's final capstone. Structured for roughly a 10–12 minute presentation plus Q&A. Timing markers are suggestions, not rules — adjust based on how much time is actually allotted.

---

## 1. Opening (30–45 seconds)

> "I built TaskFlow — a Laravel project and task management system, similar in spirit to a lightweight Trello or Jira. I designed it specifically to demonstrate the full backend skill set from this internship in one coherent product: database design, authentication, authorization, a REST API, automated testing, and deployment readiness — rather than four separate unrelated exercises."

**Why this framing matters:** it immediately tells the evaluator this wasn't four disconnected weekly tasks bolted together — it's one deliberately-scoped product built incrementally, which is a much stronger story than "I did the assigned tasks."

## 2. The problem, in one sentence (30 seconds)

> "Small teams often coordinate work across scattered tools — spreadsheets, chat threads — which causes tasks to get duplicated or forgotten. TaskFlow gives a team one place to see what needs doing, who owns it, and how close it is to done."

Keep this short. The evaluator cares far more about the engineering than the product pitch — this is just enough context to make the demo make sense.

## 3. Live demo (4–5 minutes) — the core of the presentation

Walk through this exact sequence. Each step is chosen to demonstrate a specific, named piece of engineering — say the name out loud as you do it.

| Demo step | What to say while doing it |
|---|---|
| Register a new account | "Passwords are hashed with bcrypt, and every new account defaults to the lowest-privilege role — nobody can register their way into admin access." |
| Log in, land on the dashboard | "This is a personal view — tasks assigned to me, across every project I belong to, sorted by due date, with overdue items flagged." |
| Create a project | "Creating a project automatically seats me as a manager-level member — not just as the owner field on the row — so the member list is always accurate." |
| Open the project, show the Kanban board | "Tasks are grouped by status live off a single constant on the Task model — adding a fifth status later is a one-line change, not a template rewrite." |
| Add a task, assign a priority | "Validation here mirrors the database's own ENUM constraint — an invalid status literally cannot reach either layer." |
| Add a comment on a task | "Comments are scoped to project members only — I'll show that access boundary in a moment." |
| Open a second (incognito) browser, try to view the project as a different, unrelated user | "This should be blocked." → show the 403. "This isn't a special check — this is the exact same `Project::hasAccess()` method that decides visibility everywhere in the app, web and API both." |
| Switch to Postman, hit the same project's API endpoint with a valid token | "Same data, same authorization rule, completely different interface — token-based instead of session-based." |
| Run `php artisan test` in the terminal | "16 tests, 47 assertions, all passing — covering auth, access control, cascading deletes, and business logic like overdue detection." |

## 4. Architecture, briefly (1–2 minutes)

Show the architecture diagram (`docs/architecture-diagram.svg` / the README).

> "There are two entry points — the browser and the API — but they converge on exactly one authorization and validation layer, and exactly one set of Eloquent models. I did this deliberately: the risk with building a web app and an API side-by-side is that access rules drift apart over time. Here, the web controller and the API controller both call into the same `hasAccess()` method and the same Policy classes — there's structurally nowhere for the two to disagree."

This is the single technical decision worth defending the hardest if asked — see the Q&A section below.

## 5. Testing & the bugs it actually caught (1–2 minutes)

> "I didn't just write tests that pass — I wrote tests first, against the real behavior the app should have, and let failures point me at actual bugs. Three of them only showed up once I ran the code against a real Laravel 12 installation, not while reading the source: Laravel 11 removed the `AuthorizesRequests` trait from the base controller by default, so every `$this->authorize()` call in my API silently didn't exist until I added it back. `JsonResource` wraps single responses in a `data` key by default, which broke every test asserting on a top-level field until I disabled that. And a PowerShell encoding quirk was silently inserting invisible BOM bytes into PHP files I wrote from the terminal, causing a genuinely confusing 'namespace must be the first statement' error."

Being open about real bugs — especially ones caused by tooling, not just code — reads as more credible than claiming a flawless build. See [`Day39/docs/BUGFIXES.md`](../../Day39/docs/BUGFIXES.md) for the full list.

## 6. Deployment readiness (30 seconds)

> "This isn't just running on my machine by accident — there's a `.env.example` covering every production variable, a GitHub Actions CI pipeline that runs the full test suite and a linter on every push, and a written deployment guide covering the Dev → Test → Staging → Production separation and a rollback plan using maintenance mode."

## 7. Closing (30 seconds)

> "The whole point of this capstone was to prove I can take a feature from a database design decision, through validation and authorization, to a tested and deployable API — end to end, without gaps. That's the kind of ownership I'd want to bring to a real engineering team."

End here. Don't over-talk the close — let the demo and the test run speak for the actual competence.

---

## Anticipated Questions & Answers

**Q: Why Laravel instead of a JS framework or something else?**
> "The internship track was Laravel/PHP specifically, and Laravel's batteries-included approach — Eloquent, Policies, Sanctum, Form Requests — let me demonstrate a lot of backend architecture decisions clearly in a short timeframe, rather than spending the time wiring up equivalent tooling by hand."

**Q: Why did you build both a web UI and an API instead of just one?**
> "Because the interesting authorization problem — keeping access rules consistent across every entry point — doesn't really show up with only one entry point. Building both was the only way to actually demonstrate that the rules don't drift."

**Q: What would you do differently with more time?**
> "Real-time updates — right now the Kanban board doesn't update live if another user moves a task, since there's no WebSocket layer. I scoped that out deliberately on the planning day to keep the capstone finishable, but Laravel Echo would be the natural next step."

**Q: How did you handle the case where the owner isn't automatically a project member?**
> "That was actually a real bug I found — Bug #2 in my bug log. My first draft only set `owner_id` on the project and never attached the owner to the membership pivot table. Access still worked because `hasAccess()` checks ownership separately from membership, but the member *list* looked incomplete. I fixed it by explicitly attaching the owner as a manager-role member at creation time."

**Q: Is this production-ready as-is?**
> "It's deployment-ready in the sense that the environment config, CI, and rollback plan all exist and are documented — but I'd want real-world load testing and the real-time layer before calling it production-ready for an actual team. I tried to be explicit about that boundary rather than overstating it."

**Q: Walk me through what happens if two people try to add the same person to a project twice.**
> "The `project_user` pivot table has a UNIQUE constraint on `(project_id, user_id)` at the database level — not just application-level validation — so a duplicate insert is rejected by the database itself even if the application logic somehow allowed it through."
