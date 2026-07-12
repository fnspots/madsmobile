# MADS Mobile

Meta · Arsenal · Data · Shooters — a fact-checked, multi-language database for mobile shooters: Call of Duty Mobile, Free Fire, PUBG Mobile, Delta Force Mobile, and Arena Breakout.

## How this is built (and why it's free)

No framework, no npm, no database, no server. `build.py` (pure Python standard library — nothing to `pip install`) reads the JSON files in `data/` and generates a fully static `site/` folder: plain HTML, one stylesheet, one small JS file for search/sort. Static files can be hosted for $0 forever on any of these:

- **Cloudflare Pages** (recommended) — free, generous bandwidth, custom domains, instant global CDN.
- **GitHub Pages** — free with a GitHub repo, good for a personal/community project.
- **Netlify** — free tier, drag-and-drop deploys.

No Node.js, no build step, no paid tier required at any point in this stack.

## Editing content

Everything content-related lives in `data/`, as JSON you can hand-edit:

- `data/site.json` — site name, tagline, language list.
- `data/games.json` — one entry per game: name translations, "about" history blurb (update yearly), meta overview paragraph (update each patch), and source links for fact-checking.
- `data/weapons/<game>.json` — one row per weapon: class, tier (S/A/B/C), effective range, and a short note on why it's meta or what changed. Tiers are deliberately qualitative/editorial (backed by the cited sources) rather than invented precise numeric stats, since exact ballistics aren't publicly documented for these games.
- `data/characters/<game>.json` — operator/character skins.
- `data/blog/<game>.json` — announcement posts, each with a `sources` list (always cite where the info came from).
- `data/i18n/<lang>.json` — UI strings (buttons, labels) for each of the 7 languages.

After editing any file, regenerate the site:

```bash
python3 build.py
```

Then re-deploy the `site/` folder (if using Cloudflare Pages/Netlify connected to a Git repo, just commit and push — the build runs automatically if you wire `python3 build.py` as the build command, or you can pre-build locally and push the `site/` folder itself as the deploy target).

## Current state — what's real vs. placeholder

- **Call of Duty: Mobile** is fully populated with real, sourced data (Season 6 "Take Your Heart" × Persona 5 Royal meta, weapon tier list, operator skins, two blog posts) — every fact links back to its source at the bottom of the relevant page.
- **Free Fire, PUBG Mobile, Delta Force Mobile, Arena Breakout** are scaffolded with the same page structure (about / meta / weapons / characters / blog, in all 7 languages) but contain clearly-labeled **sample placeholder data**. Replace the corresponding JSON files with verified data before treating those sections as public-ready.
- **Translations**: UI chrome (nav, search box, table headers, etc.) is translated into all 7 languages. For Call of Duty Mobile, the "about" and "meta overview" paragraphs are also translated into all 7. Non-English translations were done by Claude and should be reviewed by a native speaker before a public launch, especially Chinese and Hindi.
- **Images**: every weapon/character card has a placeholder image slot (a plain box) rather than actual game art. Guns, operator, and skin artwork belong to the game publishers (Activision, Garena, Krafton, Tencent) — swap in your own screenshots or licensed assets rather than hosting scraped copyrighted art, to avoid takedown risk.

## SEO / AI-crawler optimization already in place

- Per-page `<title>`, meta description, canonical URL, Open Graph tags.
- `hreflang` alternate-language links on every page (7 languages + x-default).
- `JSON-LD` structured data: `WebSite` on the homepage, `ItemList` of weapons on each game page, `BlogPosting` on each article.
- `sitemap.xml` covering every language × game × page.
- `robots.txt` explicitly allowing AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) alongside normal search engines.
- `llms.txt` — a plain-language summary of the site for AI assistants/crawlers to use as context.

## Maintenance cadence

Mobile shooter metas shift with every seasonal patch. The scheduled task set up alongside this project will check for new patch notes/meta changes monthly and flag what needs updating in `data/`. Update the JSON, re-run `python3 build.py`, redeploy.

## Deploying on Cloudflare Pages (step-by-step)

1. Push this folder to a GitHub repository.
2. In Cloudflare dashboard → Pages → Create a project → Connect to Git → pick the repo.
3. Build command: `python3 build.py`
4. Build output directory: `site`
5. Deploy. You get a free `*.pages.dev` URL immediately; a custom domain can be attached for free (you only pay if you buy the domain name itself).
