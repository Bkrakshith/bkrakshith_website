# bkrakshith.com — static export

Ready to host as-is: no build step, everything is static HTML/CSS/JS.

## Deploy on GitHub Pages
1. Create a new repo on github.com (or open an existing one).
2. On the repo page, click "Add file → Upload files", then drag every file and folder from this export in — keep the folder structure (`_ds/` and `assets/` must stay alongside the `.html` files).
3. Commit to the default branch.
4. Repo Settings → Pages → Source → "Deploy from a branch" → pick that branch, `/ (root)`. Save.
5. Your site is live at `https://<username>.github.io/<repo>/` within a minute or two.

## Custom domain (bkrakshith.com)
Add a file named `CNAME` (no extension) containing just:
```
bkrakshith.com
```
then point your domain's DNS at GitHub Pages per GitHub's "Managing a custom domain" docs.

## Structure
- `index.html` — homepage (was `bkrakshith-studio.dc.html`; renamed so it serves at the site root)
- `projects.dc.html`, `projects-archive.dc.html`, `project-*.dc.html`, `university-life.dc.html` — the rest of the site
- `_ds/` — design-system stylesheet + component bundle, required by every page
- `assets/` — photos currently in use
- `support.js`, `image-slot.js`, `tweaks-panel.jsx`, `animations-v2.jsx`, `university-life-video.jsx` — runtime the pages load
- `.image-slots.state.json` — the PodCut/GoBox photos already dropped in (keep this file — deleting it clears those images for visitors)
- `robots.txt`, `sitemap.xml`, `llms.txt` — SEO/GEO files, already pointed at bkrakshith.com

## After you add more photos or videos
Come back to the design tool and re-export, rather than hand-editing here, so the "under construction" notes clear correctly as each project fills in.
