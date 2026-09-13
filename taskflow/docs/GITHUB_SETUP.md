# Submitting TaskFlow to GitHub

This walks through taking the working `taskflow` Laravel project (already running locally after Days 36–39) and publishing it as a real, presentable GitHub repository — the actual deliverable Day 40 asks for.

Run these from inside your **`taskflow` project folder** (not the `Week8` planning folder), in PowerShell.

---

## 1. Bring in the Day 40 documentation files

Copy this folder's polished README, license, and `.gitignore` into the actual project root, so they're what GitHub displays.

```powershell
Copy-Item "..\Week8\Day40\README.md" "." -Force
Copy-Item "..\Week8\Day40\LICENSE" "." -Force
Copy-Item "..\Week8\Day40\.gitignore" "." -Force
Copy-Item "..\Week8\Day40\docs" "." -Recurse -Force
Copy-Item "..\Week8\Day40\postman" "." -Recurse -Force
```

## 2. Initialize Git (skip if already a git repo)

```powershell
git init
git branch -M main
```

## 3. Confirm `.gitignore` is actually working before the first commit

This matters — `vendor/`, `node_modules/`, and `.env` must never be committed. Check what git *would* add:

```powershell
git status
```

You should **not** see `vendor/`, `node_modules/`, `.env`, or `database/database.sqlite` listed. If any of those appear, the `.gitignore` copied in Step 1 either didn't land correctly or one of those paths was already tracked from an earlier `git add`. If they were already tracked, untrack them without deleting the actual files:

```powershell
git rm -r --cached vendor node_modules .env database/database.sqlite 2>$null
```

## 4. Stage and make the first commit

```powershell
git add .
git commit -m "Initial commit: TaskFlow capstone - Laravel 12 project & task management system"
```

## 5. Create the GitHub repository

**Option A — using GitHub CLI** (if installed — check with `gh --version`):
```powershell
gh repo create taskflow --public --source=. --remote=origin --push
```
This creates the repo on GitHub *and* pushes in one step — skip to Step 7 if you use this.

**Option B — via the website** (no CLI needed):
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `taskflow`
3. **Do not** initialize with a README, `.gitignore`, or license — this repo already has all three, and letting GitHub create its own would conflict with the first push
4. Click **Create repository**

## 6. Connect your local repo to GitHub and push

(Only needed if you used Option B above.)

```powershell
git remote add origin https://github.com/YOUR-USERNAME/taskflow.git
git push -u origin main
```

## 7. Tag this as the capstone submission

A tagged release makes it obvious to an evaluator exactly which commit represents the finished internship submission, even if you keep committing after today.

```powershell
git tag -a v1.0.0-capstone -m "Week 8 internship capstone submission"
git push origin v1.0.0-capstone
```

## 8. Final verification checklist

Before sending the link to anyone, open the repo on GitHub itself and confirm:

- [ ] README renders correctly with the architecture diagram visible
- [ ] `vendor/`, `node_modules/`, and `.env` are **not** present in the file list
- [ ] `.env.example` **is** present
- [ ] The commit history shows a real message, not "initial commit" with no context
- [ ] The repository description (top of the GitHub page, editable via the ⚙️ gear icon) is filled in — e.g. *"Laravel 12 project & task management system — backend internship capstone"*
- [ ] Repository visibility is set correctly (Public, unless your internship specifically requires Private + inviting the reviewer as a collaborator)

## 9. If the repository must be Private

Add your reviewer/evaluator as a collaborator so they can actually open it:

```powershell
gh repo edit --add-collaborator THEIR-GITHUB-USERNAME
```
Or via the website: **Settings → Collaborators → Add people**.

---

## Common issues

**`fatal: remote origin already exists`**
You already have a remote configured (maybe from an earlier attempt). Check what it currently points to, then remove and re-add if needed:
```powershell
git remote -v
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/taskflow.git
```

**Large push / push seems to hang**
This almost always means `vendor/` or `node_modules/` got committed despite `.gitignore` — go back to Step 3 and untrack them properly, then commit and push again.

**`Support for password authentication was removed`**
GitHub no longer accepts your account password for `git push` over HTTPS. Use a Personal Access Token instead of your password when prompted (GitHub → Settings → Developer settings → Personal access tokens), or switch to `gh auth login` if using the CLI.
