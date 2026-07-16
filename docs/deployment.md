# Deploying the Tekton website

The site is a Next.js app that **writes to its own disk** — the CMS saves
`data/content.json`, keeps snapshots in `data/backups/`, and replaces images in
`public/media/` and `public/brand/`. That means it must run on a **persistent
server** (VPS, dedicated box, or a container with mounted volumes). Serverless
hosts (Vercel/Netlify functions) will lose CMS edits and are not supported.

## Requirements

- Node.js 20+ and npm
- ~2GB RAM for the build step

## Environment

Create `.env.local` in the project root (see `env.example`):

```
ADMIN_PASSWORD=<strong password for /admin>      # editor stays locked without it
NEXT_PUBLIC_SITE_URL=https://your-domain.com     # used for canonical URLs, sitemap, OG tags
```

## First deploy

```bash
git clone https://github.com/nasifsajjad/tekton.git
cd tekton
npm ci
npm run build
npm start          # serves on port 3000
```

Run `npm start` under a process manager (pm2, systemd) and put nginx/Caddy in
front of port 3000 for TLS.

## Updating the code (important)

CMS edits live **outside git** on the server: `data/content.json`,
`data/backups/`, and any images replaced via the editor in `public/media/` and
`public/brand/`. When pulling new code, never wipe the working directory.
`git pull` is safe for `data/backups/` (git-ignored) and replaced images
(same filenames, content untracked changes stay); if `data/content.json` has
server-side edits, either commit them on the server first or keep `data/` as
a symlink to a directory outside the repo.

Recommended update flow:

```bash
git stash          # protects server-side content.json edits
git pull
git stash pop      # restores them
npm ci && npm run build
# restart the process (pm2 restart tekton / systemctl restart tekton)
```

## Backups

- The CMS keeps the last 20 published versions in `data/backups/` with
  one-click restore in `/admin`.
- Include `data/` and `public/media/` in the server's regular backup job —
  that covers everything the CMS can change.
- The editor's **Export content file** button downloads all site text as JSON
  for an off-server copy.

## Caching notes

- `public/media/industrial-sequence/*` is served immutable (1 year) — those
  frames never change via the CMS.
- Other `/media` images are cache-busted automatically when replaced through
  the CMS (versioned URLs), so visitors see new images immediately.
- `/brand` (the logo) is cached for 1 hour — a replaced logo is visible
  site-wide within the hour.
