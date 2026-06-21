# Md Tahammul Noor — Portfolio Site

A static portfolio (plain HTML/CSS/JS) built to position you as a research-minded
ML/AI engineer who ships production systems. No build step, no framework —
deploy as-is to GitHub Pages, Vercel, or any static host.

## File structure

```
portfolio/
├── index.html        all page content and structure
├── css/
│   └── style.css      design tokens, layout, components, responsive rules
├── js/
│   └── main.js         mobile nav, GSAP scroll reveals, count-up stats, contact form
└── assets/
    └── resume.pdf       your actual resume (copied from your upload — swap in new versions as needed)
```

Single CSS file and single JS file by design — easy to scan, easy to hand off,
nothing to bundle.

---

## Run it locally

There's no build step and no `npm install` — it's plain HTML/CSS/JS — but **don't just
double-click `index.html`**. Opening a file directly as `file://...` makes the browser
block the contact form's `fetch()` call to Formspree (and some browsers restrict
`file://` requests generally), so test through a real local server instead. Pick whichever
of these you already have installed:

**Option A — Python (built into macOS/Linux, easy install on Windows)**
```bash
cd portfolio
python3 -m http.server 8000
```
Open **http://localhost:8000** in your browser.

**Option B — Node.js**
```bash
cd portfolio
npx serve
```
It'll print the local URL to open (usually **http://localhost:3000**).

**Option C — VS Code**
Install the **Live Server** extension, open the `portfolio` folder in VS Code,
right-click `index.html` → **Open with Live Server**.

Stop the server with `Ctrl+C` (Options A/B) whenever you're done.

> The contact form will still show "not connected yet" locally until you complete the
> Formspree setup below — that's expected, not a bug.

---

## Placeholder you still need to fill in

Everything is wired up — project links, GitHub/demo URLs, and the contact form
(connected to Formspree form ID `mvzjpbvp`). One thing left to double-check:

| What | Where | Why |
|---|---|---|
| Resume version | `assets/resume.pdf` | Confirm it's your current version before deploying — it's a direct copy of what you uploaded |

> **First message through the contact form:** Formspree requires you to confirm the very
> first submission via a verification email they send to `noorali99307@gmail.com` — click
> the link in that email once, and every submission after is automatic.

## Contact form setup

✅ Already connected to [Formspree](https://formspree.io) form ID `mvzjpbvp`, with the
destination set to `noorali99307@gmail.com` in the Formspree dashboard. It works for
every visitor — including people with no default mail app configured — and needs no
server of your own.

If you ever need to change the destination email or check submission history, log into
your Formspree dashboard. If you ever need a fresh form (e.g. starting over with a new
account), swap the ID in the `action` attribute of `<form id="contactForm">` in
`index.html`.

The "Prefer email directly?" link + Copy button below the form always work as a manual
fallback regardless. A hidden honeypot field (`_gotcha`) also silently drops bot
submissions without using up your monthly quota.

---

## Push to GitHub

Skip this if the code is already in a repo. Otherwise, from inside the `portfolio` folder:

1. **Create the repo on GitHub** — go to [github.com/new](https://github.com/new), give it
   a name (e.g. `portfolio`, or `thanos07.github.io` if you specifically want GitHub Pages'
   free root-domain hosting later), leave it **empty** (no README/license — you already
   have files), click **Create repository**.
2. **Initialize and push** from your terminal:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME/YOUR_REPO` with the path GitHub showed you after step 1.
3. Refresh the GitHub repo page — your files should now be there.

> Already have the repo and just made changes? You only need:
> `git add . && git commit -m "your message" && git push`

---

## Deploy on Vercel

**Easiest: import from GitHub (no CLI needed)**

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is simplest).
2. Click **Add New… → Project**.
3. Select the GitHub repo you just pushed (authorize Vercel to access it if prompted).
4. Framework Preset: leave it as **Other** — there's nothing to build.
5. Leave Build Command / Output Directory blank.
6. Click **Deploy**. Vercel gives you a live `*.vercel.app` URL in under a minute.

From now on, every `git push` to `main` auto-redeploys the live site — no extra steps.

**Alternative: Vercel CLI**
```bash
npm i -g vercel    # one-time install
cd portfolio
vercel             # follow the prompts; choose defaults for a static site
vercel --prod      # promote to your production URL
```

**Custom domain (optional):** Project → Settings → Domains → add your domain and follow
Vercel's DNS instructions.

---

## Design notes

- **Palette**: deep navy (`#0A1628`) for high-impact sections, royal blue (`#2856E0`) for
  accents/CTAs/links, a steel-blue tint (`#EEF3FB`) for subtle section backgrounds, white base.
- **Type**: Fraunces (display, headlines/titles) + IBM Plex Sans (body) + IBM Plex Mono
  (labels, stats, stack tags) — loaded from Google Fonts via `<link>` in `index.html`.
- **Signature motif**: the small tick-marked "trace line" next to each section eyebrow
  and the mono status tags on project cards echo the audit-trail/log language from
  TriageIQ itself — engineering identity drawn from your own project, not decoration.
- **Motion**: GSAP + ScrollTrigger (loaded via CDN) drives scroll-in fades and the
  proof-strip count-up. Everything respects `prefers-reduced-motion`, and if the CDN
  is ever blocked or slow, `js/main.js` detects it and reveals all content immediately
  instead of leaving the page stuck invisible.

## Before you deploy — checklist

- [x] Formspree form ID connected (`mvzjpbvp`).
- [ ] Confirm `assets/resume.pdf` is your latest version.
- [ ] Skim `index.html` for any wording you'd tweak — all copy is rephrased from your
      resume content, nothing invented.
- [ ] Confirm the Formspree verification email (sent on your first real test submission).
- [ ] Test the contact form on the live Vercel URL once deployed — send yourself a real
      test message to confirm delivery end-to-end.
