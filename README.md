# Endri Susanto — Profile

Personal profile web app with two deployment targets.

## Architecture

```
src/main.js  →  fetch('/api/profile')     ← self-hosted (Docker + Cloudflare)
                     ↓ fails
             →  fetch('./profile.json')   ← static fallback (GitHub Pages)
```

## Deployment Targets

### 1. Self-Hosted via Cloudflare Tunnel

**URL:** https://profile.endrisusanto.my.id  
**Stack:** Docker → port 8767 → Cloudflare Tunnel → domain

```bash
# Build & run
npm run build
docker compose up -d
```

Features: full API (`/api/profile`, upload, delete files), admin panel with password auth.

### 2. GitHub Pages (Static)

**URL:** https://endrisusanto.github.io/profile  
**Auto-deploy:** push to `main` triggers GitHub Actions

```bash
# Local preview of GitHub Pages build
npm run build:pages
```

Static read-only — profile data loaded from `public/profile.json`, admin panel disabled (no backend).

## Development

```bash
npm install
npm run dev       # dev server with HMR
node server.js    # backend API (separate terminal)
```

## Config

| File | Purpose |
|------|---------|
| `.env` | `ADMIN_PASSWORD=...` (server-side only, not committed) |
| `public/profile.json` | Static profile data for GitHub Pages fallback |
| `docker-compose.yml` | Self-hosted production setup |

## Build Scripts

| Command | Base path | Use for |
|---------|-----------|---------|
| `npm run build` | `/` | Docker / Cloudflare Tunnel |
| `npm run build:pages` | `/profile/` | GitHub Pages |
