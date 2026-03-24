# GitHub Collaboration Guide

> For Reza and the team — no engineering background needed.

---

## What is GitHub?

GitHub is where all the code for Patient Health lives. Think of it like **Google Drive for code** — it tracks every change ever made, who made it, and when. You can always go back to any previous version.

---

## The Golden Rule

**Never work directly on `main`.** The `main` branch is live/production code. All work happens on a separate branch and gets reviewed before it goes into `main`.

---

## The Two Main Branches

| Branch | What it is |
|---|---|
| `main` | The stable, production version of the code |
| `develop` | The working integration branch — all features merge here first |

---

## How Work Flows (Step by Step)

```
Your feature branch  →  develop  →  main
      (work here)       (staging)   (production)
```

1. Start a new branch from `develop` for your piece of work
2. Do the work on that branch
3. Open a Pull Request (PR) into `develop`
4. The other person reviews and approves it
5. Merge it — the code is now in `develop`
6. When ready for production, `develop` gets merged into `main`

---

## Daily Workflow — What You Actually Do

### Before starting any new work

Always make sure your local code is up to date:

```bash
git checkout develop
git pull
```

### Starting a new feature or change

```bash
git checkout develop
git pull
git checkout -b feature/your-feature-name
```

Examples of good branch names:
- `feature/patient-search`
- `feature/login-page`
- `fix/broken-button`

### Saving your work (committing)

```bash
git add .
git commit -m "Brief description of what you did"
```

Good commit messages:
- `"Add patient search to EMR homepage"`
- `"Fix broken logout button"`
- `"Update patient form validation"`

### Pushing your work to GitHub

```bash
git push -u origin feature/your-feature-name
```

After the first push, subsequent pushes on the same branch are just:

```bash
git push
```

---

## Opening a Pull Request (PR)

A Pull Request is how you ask the other person to review your work before it goes into `develop`.

1. Go to [github.com/RezaIsmail/patient-health](https://github.com/RezaIsmail/patient-health)
2. You'll see a banner: **"Compare & pull request"** — click it
3. Make sure the base branch is `develop` (not `main`)
4. Write a short title and description of what you changed
5. Click **"Create pull request"**
6. The other person will get a notification to review it

---

## Reviewing a Pull Request

When someone opens a PR, you'll get an email notification.

1. Go to the repo on GitHub
2. Click **"Pull requests"** at the top
3. Click the PR to open it
4. Click **"Files changed"** to see what changed
5. Click **"Review changes"** → **"Approve"** if it looks good
6. Click **"Merge pull request"**

---

## If You're Unsure

- **Don't force anything** — if a command fails, stop and ask
- **Never run `git reset --hard`** or `git push --force` without checking first — these can delete work
- When in doubt: `git status` shows you exactly where you are

```bash
git status
```

---

## Quick Reference Card

| Task | Command |
|---|---|
| Check what's happening | `git status` |
| Get latest code | `git pull` |
| Create a new branch | `git checkout -b feature/name` |
| Switch to a branch | `git checkout branch-name` |
| Save changes | `git add . && git commit -m "message"` |
| Push to GitHub | `git push` |
| See all branches | `git branch -a` |

---

## Glossary

| Term | Plain English |
|---|---|
| **Repository (repo)** | The project folder on GitHub — contains all code and history |
| **Branch** | A separate copy of the code where you work without affecting the main version |
| **Commit** | A saved snapshot of your changes with a message describing what you did |
| **Push** | Uploading your local commits to GitHub |
| **Pull** | Downloading the latest changes from GitHub to your computer |
| **Pull Request (PR)** | A request to merge your branch into another — triggers a review |
| **Merge** | Combining one branch's changes into another |
| **main** | The production branch — only stable, reviewed code lives here |
| **develop** | The integration branch — where features land before going to production |
