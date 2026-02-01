# Portfolio

This repository contains my **portfolio hub**: a clean README for quick navigation and a **GitHub Pages** website with project cards.

**Live site:** https://alnvoloha.github.io/portfolio/

---

## Featured work

- **CalcDash** — full‑stack mental math trainer (frontend + backend, JWT, PostgreSQL) (in progress).  
  Repo: https://github.com/alnvoloha/CalcDash

- **React Projects** — practical React apps (routing, async, state management).  
  Live: https://alnvoloha.github.io/react-projects/  
  Repo: https://github.com/alnvoloha/react-projects

- **JS Mini Apps** — small vanilla JS apps (games + UI logic).  
  Live: https://alnvoloha.github.io/js-mini-apps/  
  Repo: https://github.com/alnvoloha/js-mini-apps

- **Web Design Projects** — HTML/CSS layout + UI polish.  
  Repo: https://github.com/alnvoloha/web-design

---

## Other directions

- **SQL / MS SQL Server (T‑SQL)** — scripts and a mini‑project with temporal tables.  
  Repo: https://github.com/alnvoloha/sql-mssql

- **Java Practice Projects** — Java fundamentals: structure, logging, tests, exceptions.  
  Repo: https://github.com/alnvoloha/java-practice-projects

- **Linux / Bash** — scripts and notes.  
  Repo: https://github.com/alnvoloha/linux-bash

---

## How this repo is organized

- `index.html`, `styles.css`, `script.js` — the portfolio website
- `projects.json` — the data source for the project cards (add new projects here)
- `assets/` — images (optional previews, icons)

---
## Run locally

Because the site loads `projects.json`, you need a small local server:

```bash
# Python
python -m http.server 5173
# then open http://localhost:5173

# or Node
npx serve .
```

