# TaskFlow — Bug Fixing & Hardening Log
**Internship Task — Week 8 / Day 39**

This log documents every bug found while writing the Day 39 feature test
suite against the Day 37/38 build, what was actually wrong, and the fix.
Writing tests first and letting them surface real issues — rather than
inspecting the code and guessing — is deliberate: it's the same workflow
used in the "Debug, Test, Deploy" article referenced at the end of this
document.

---

### Bug #1 — `end_date` validation accepted a date before `start_date`

**Found by:** manual review while writing `ProjectTest`, confirmed by adding
a regression test.

**Symptom:** The `StoreProjectRequest`/`UpdateProjectRequest` rules already
included `after_or_equal:start_date` on `end_date` — but only when
`start_date` was present in the *same* request. On an **update** where only
`end_date` was being changed and `start_date` already existed from a prior
save, Laravel's `after_or_equal` rule compares against the request's own
`start_date` input, which was empty, so the check silently passed.

**Fix:** Changed the validation to compare against the model's existing
value when the field isn't present in the request, by injecting the current
`start_date` as a fallback before validation runs in `UpdateProjectRequest`.

```php
protected function prepareForValidation(): void
{
    if (! $this->has('start_date') && $this->route('project')) {
        $this->merge(['start_date' => $this->route('project')->start_date]);
    }
}
```

**Status:** Fixed and covered by an updated `ProjectTest` case.

---

### Bug #2 — Project owner was not automatically added as a project member

**Found by:** `test_a_user_can_create_a_project_and_becomes_its_owner` in
`ProjectTest.php`, added on Day 39.

**Symptom:** An early draft of `ProjectController@store` only set
`owner_id` on the new project and never attached the owner to the
`project_user` pivot table. Functionally this didn't break access — the
`hasAccess()` check on the `Project` model already treats the owner as
having access regardless of pivot rows — but it meant `$project->members`
(used to render the team list in the UI, and returned by the API's
`ProjectResource`) came back **without the owner in it**, which looked like
a missing team member to anyone viewing the project.

**Fix:** `ProjectController@store` (both web and API versions) now attaches
the owner to `project_user` with `role: 'manager'` immediately after
creating the project, so the member list is always accurate from the
moment a project exists.

**Status:** Fixed in both `Web\ProjectController` and `Api\ProjectController`;
covered by a dedicated assertion in `ProjectTest`.

---

### Bug #3 — N+1 query on the project index page

**Found by:** Manually inspecting the query log (`DB::listen`) while
loading `/dashboard` and `/projects` with seeded demo data (12 projects).

**Symptom:** `ProjectController@index` loaded the base `projects` query,
but each project card in `projects/index.blade.php` accessed
`$project->tasks_count`, which — before this fix — was **not** eager-loaded,
producing one extra `COUNT` query per project (13 queries total for 12
projects instead of 2).

**Fix:** Added `->withCount('tasks')` to the index query in both the web
`ProjectController` and the API `ProjectController`, so the task count is
fetched in a single aggregate query alongside the project list.

**Status:** Fixed. Verified the query count dropped from 13 to 2 using
`DB::listen()` in a scratch test route (removed after verification).

---

### Bug #4 — API task update endpoint allowed changing `project_id`

**Found by:** Security review of every `Http\Requests\*` class before
deployment — asking "what happens if a malicious/curious client sends a
field I didn't expect?" for each one.

**Symptom:** `UpdateTaskRequest::rules()` did not exclude `project_id` from
mass assignment, and `Task::$fillable` included `project_id`. A client could
`PUT /api/tasks/{task}` with `{"project_id": 999}` and move a task into a
project they don't even have access to, bypassing the authorization check
that only runs against the task's *original* project.

**Fix:** Removed `project_id` from `UpdateTaskRequest`'s validated fields
entirely (it's not in the rules array, and `$request->validated()` only
returns what's listed there, so even a malicious extra field in the request
body is silently dropped before it reaches `$task->update()`). Moving a task
between projects is intentionally not a supported action in this version of
TaskFlow.

**Status:** Fixed. Confirmed the field is stripped by testing an update
request with an extra `project_id` key and asserting it has no effect.

---

### Bug #5 — Comment form allowed an empty (whitespace-only) body

**Found by:** Exploratory testing — submitting a comment of just spaces
through the UI.

**Symptom:** `StoreCommentRequest`'s `body` rule was `required|string|max:2000`.
Laravel's `required` rule considers a string of only spaces as "present," so
a whitespace-only comment passed validation and created a visually blank
comment in the thread.

**Fix:** Changed the rule to `['required', 'string', 'max:2000']` combined
with a `trim` cast via `prepareForValidation()` on the request, so the body
is trimmed *before* the `required` check runs — a whitespace-only submission
now correctly fails validation instead of being silently accepted.

**Status:** Fixed.

---

## Summary

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| 1 | Date-range validation bypassed on partial update | Medium | Fixed |
| 2 | Project owner missing from member list | Low (cosmetic/data-consistency) | Fixed |
| 3 | N+1 query on project index | Medium (performance) | Fixed |
| 4 | Task could be reassigned to an unauthorized project via API | High (security) | Fixed |
| 5 | Whitespace-only comments accepted | Low | Fixed |

Bug #4 was treated as the highest priority of the five, since it's the only
one with a real access-control impact rather than a data-quality or
performance impact — this reflects the general rule I followed throughout
this pass: **security and access-control bugs get fixed and re-tested before
anything else**, regardless of the order they were found in.
