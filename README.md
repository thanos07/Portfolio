# Md Tahammul Noor — Portfolio Site

> A static portfolio built to position me as a research-minded ML/AI engineer who ships
> production systems — not just a student with notebooks. This README documents the full
> journey: why I built it, how it's structured, every issue I ran into, and exactly how
> each one was fixed.

**Live site:** https://portfolio-rosy-psi-74.vercel.app/  
**GitHub repo:** https://github.com/thanos07/Portfolio  
**Stack:** Plain HTML · CSS · Vanilla JavaScript · GSAP · Formspree

---

## Table of Contents

1. [What I Was Trying to Build](#1-what-i-was-trying-to-build)
2. [How I Chose This Design](#2-how-i-chose-this-design)
3. [Project Structure](#3-project-structure)
4. [Issues Faced While Building](#4-issues-faced-while-building)
5. [Post-Build Issues — Contact Form](#5-post-build-issues--contact-form)
6. [Security Audit](#6-security-audit)
7. [Deployment Journey](#7-deployment-journey)
8. [Final State of the Project](#8-final-state-of-the-project)
9. [Lessons Learned](#9-lessons-learned)

---

## 1. What I Was Trying to Build

I'm an M.Tech CSE student at NIT Jalandhar (2024–2026) building AI/ML systems — from
LLM evaluation to deployed RAG pipelines and agentic triage tools. I also have an
IEEE-accepted publication (IEEE AIEI 2026) and real freelance experience evaluating
LLM outputs at Outlier/Remotask.

The problem: a standard resume doesn't communicate *how* any of this was built, what
problems it was solving, or what the outcomes actually were. Hiring managers and
recruiters in ML/AI roles increasingly want to see judgment, not just a list of tools.

So the goal was a **personal portfolio site** that:
- Presents each project as a mini case study (Problem → Build → Outcome), not just a
  title and a tech stack
- Leads with the most ML/AI-relevant work, ordered by relevance to target roles, not
  by date
- Includes a working contact form that actually delivers messages (see section 5)
- Is fully static — no backend, no framework, no build step — so it can be deployed
  anywhere (GitHub Pages, Vercel, Netlify) without any server costs or maintenance
- Loads fast and works for everyone, including people with JavaScript disabled or slow
  connections

---

## 2. How I Chose This Design

The design language was built around a specific idea: **the portfolio should feel like
the systems it describes.** Most ML/AI portfolios use generic Bootstrap cards or a
plain white developer blog template. The visual identity here is drawn directly from the
kind of tooling I build — audit trails, structured logs, confidence-scored decisions.

Specific choices and their reasoning:

**Colour palette — deep navy + royal blue**  
`#0A1628` (dark navy) for high-impact sections (hero, research, contact), `#2856E0`
(royal blue) for accents, CTAs, and links, and a steel-blue tint (`#EEF3FB`) for
subtle section backgrounds. This is a technical-professional palette — not the bright
startup green or generic developer grey that most portfolio templates default to.

**Typography — three fonts, each with a distinct role**  
- *Fraunces* (serif, display weight): headlines and section titles — adds editorial
  weight without feeling corporate
- *IBM Plex Sans* (humanist sans): body text — extremely readable, technical without
  being cold
- *IBM Plex Mono* (monospace): labels, stats, stack tags, section eyebrows — echoes
  terminals and log output, which is the right register for an ML/AI engineer's work

**Section eyebrows with trace-tick motifs**  
The small tick-marked line that precedes each section label (e.g. `SECTION 01 —
FEATURED PROJECTS`) references the kind of structured, numbered, auditable output that
TriageIQ (one of the featured projects) itself produces. The design language is
borrowed from the work, not applied on top of it.

**STATUS: SHIPPED tags on project cards**  
Every project card has a mono-font status tag in the top-right corner — `STATUS:
SHIPPED` or `STATUS: CODE COMPLETE`. These mirror the kind of structured status fields
you'd see in an incident management or deployment system. Small detail, but it makes
the card feel like documentation, not marketing.

**Three-column case structure (Problem / Build / Outcome)**  
Every major project is broken into exactly these three columns. This is deliberate:
it forces each project description to answer the question a technical interviewer would
actually ask — "what was the actual problem, what did you build to solve it, and what
did it actually produce?"

---

## 3. Project Structure

```
portfolio/
├── index.html        all page content and structure (single-page)
├── css/
│   └── style.css     design tokens, layout, components, responsive rules
├── js/
│   └── main.js       mobile nav, GSAP scroll reveals, count-up stats, contact form
└── assets/
    └── resume.pdf    downloadable resume, wired to both "Download résumé" buttons
```

No build step. No `npm install`. No framework. The JS file imports GSAP and
ScrollTrigger from a CDN; if the CDN is blocked or slow, `main.js` detects it and
reveals all content immediately rather than leaving the page stuck hidden. Everything
degrades gracefully.

---

## 4. Issues Faced While Building

### 4.1 — The contact form did nothing for webmail users

**The problem:**  
The original contact form used a `mailto:` approach — on submit, it built a
`mailto:noorali99307@gmail.com?subject=...&body=...` URL and redirected the visitor
there. This works only if the visitor has a native mail client (Outlook, Apple Mail,
Thunderbird) configured as their default. For the majority of people who use Gmail,
Yahoo, or any webmail-only setup, clicking submit silently opened a broken "no app
found" dialog, or worse, just did nothing at all. The visitor would have no idea their
message never went anywhere.

**The fix:**  
Replaced `mailto:` entirely with [Formspree](https://formspree.io), a hosted form
backend that accepts a plain HTML `<form>` POST and forwards submissions to a
configured email address — no backend code required. The contact form now:
- Has a real `action="https://formspree.io/f/mvzjpbvp"` attribute, so it even works
  as a pure HTML fallback if JavaScript is disabled (the browser POSTs directly and
  Formspree shows their default "thanks" page)
- Is intercepted by `fetch()` in `main.js` when JS is available, to show an inline
  status message ("Sending…" → "Thanks, your message is sent") without leaving the page
- Shows a clear error message if the request fails, with a "Prefer email directly?"
  link and a one-click **Copy** button as a permanent manual fallback — so there is
  always a way to reach me even if something breaks server-side

### 4.2 — No clear status feedback to the visitor

**The problem:**  
The original form gave no visual feedback during or after submission — you clicked
Send, nothing visually changed, and you were left unsure if it worked.

**The fix:**  
Added a `<p id="contactFormNote">` element below the submit button, wired in JS to
show distinct states:
- `"Sending…"` — appears immediately on submit while the request is in flight
- Success (mint green): `"Thanks — your message is sent. I'll reply by email soon."`
- Error (soft coral): `"Couldn't send that — please email me directly below instead."`

The submit button is also disabled during the request (`.disabled` attribute) so
double-submitting isn't possible.

---

## 5. Post-Build Issues — Contact Form

### 5.1 — Added a honeypot for spam protection

After wiring up Formspree, I added a "honeypot" hidden field as a standard spam
protection measure. The idea: add a hidden `<input name="_gotcha">` to the form that
real visitors never see or fill, but automated bots (which blindly fill every field
they find) would fill. If the field has any value on submission, Formspree silently
discards the message as spam, and my JS also short-circuits client-side before even
making the network request.

The field was hidden using `position: absolute; left: -9999px` — placed off-screen but
not `display:none`, based on the rationale that bots check for `display:none` and skip
those fields. This turned out to be the exact wrong choice.

### 5.2 — Honeypot caused real messages to be silently dropped

**The problem:**  
After deploying, visitors who submitted the form were seeing a success message on their
end — `"Thanks — your message is sent."` — but those messages were never arriving in
my inbox. The form appeared to work for me when I tested it myself, but not for anyone
else.

The cause: most modern browsers' autofill and password managers (Chrome, Samsung
Browser, Gboard, Bitwarden, LastPass, and others) do not respect `position: absolute;
left: -9999px` as "invisible." They check computed visibility, and an off-screen field
is still technically a rendered form field. When a friend's browser auto-filled the
contact form — name, email, anything — it sometimes also placed a stray value in the
hidden honeypot field. My JS saw that field was non-empty, assumed "bot," and returned
a fake success message without ever contacting Formspree. The visitor saw a normal
confirmation. I never received the message. Total silent failure.

**The attempted fix — didn't fully work:**  
Switched the honeypot CSS from `position: absolute; left: -9999px` to `display: none`.
The rationale: browser autofill specifically skips `display:none` fields, since the
browser knows those aren't real inputs. However, this only addresses the client-side
JS check — Formspree itself *also* checks the `_gotcha` field server-side and silently
discards submissions where it's non-empty, even if it's `display:none`. The underlying
risk remained.

**The correct fix:**  
Removed the honeypot entirely. Per Formspree's own documentation, all Formspree forms
include reCAPTCHA-based spam filtering automatically — a manual honeypot is redundant
for a personal contact form and actively harmful when it causes real visitor messages
to be dropped. For a low-traffic portfolio contact form, occasional spam landing in
the inbox is a far smaller cost than silently losing genuine messages from recruiters,
collaborators, or interviewers.

**What was removed:**
- The `<div class="hp-field">` and `<input name="_gotcha">` from `index.html`
- The `.hp-field` CSS rule from `style.css`
- The honeypot pre-check block from the form's submit handler in `main.js`

After this fix, the form delivered messages from all test visitors correctly.

### 5.3 — Formspree requires a one-time email confirmation

A less obvious issue: Formspree requires you to confirm the destination email address
the first time a submission is received. They send a verification email to the
configured address (`noorali99307@gmail.com`) and hold submissions until the link is
clicked. Until that confirmation is done, Formspree accepts the POST (returns HTTP 200)
but doesn't actually forward anything — so JS shows a success message, but no email
arrives. The fix is simply to check the Formspree dashboard after your first test
submission and click the confirmation link in the verification email they send.

---

## 6. Security Audit

Before publishing, I audited the site for the most common vulnerabilities in static
portfolio sites:

| Concern | Finding | Status |
|---|---|---|
| Hardcoded secrets or API keys in source | None — no private credentials anywhere in `index.html` or `main.js` | ✅ Safe |
| XSS via `innerHTML` reflecting user input | All dynamic writes use `textContent`, never `innerHTML` | ✅ Safe |
| Email address exposure | Address is intentionally visible (you want people to email you), but the Formspree endpoint hides it from legacy scrapers | ✅ Acceptable |
| Formspree endpoint in public source | It's a write-only public endpoint — anyone who finds it can only *submit* to it; they can't read past submissions or access your inbox | ✅ Safe |
| Contact form spam | Covered by Formspree's built-in reCAPTCHA-based spam filtering | ✅ Covered |

**Note on the Formspree endpoint being public:**  
The form ID (`mvzjpbvp`) is visible in the page's HTML source — this is expected and
fine. It's functionally equivalent to a public webhook URL. It cannot be used to read
your emails, impersonate you, or access your Formspree account. The only realistic
misuse is spamming the form endpoint directly (bypassing the frontend UI), which
Formspree's server-side spam filtering handles.

---

## 7. Deployment Journey

### Local testing
Before pushing anywhere, the site was tested locally using Python's built-in HTTP
server:
```bash
python3 -m http.server 8000
```
Opening `index.html` directly as a `file://` URL would have blocked the Formspree
`fetch()` call (browsers restrict cross-origin requests from `file://`), so a real
local server was necessary to test the contact form end-to-end.

### Pushing to GitHub (Windows cmd)
The repo was initialized from a Windows machine. A common Windows-specific warning
appeared during `git add`:
```
warning: in the working copy of 'index.html', LF will be replaced by CRLF
```
This is harmless — just Windows git normalizing Unix-style line endings (LF) to
Windows-style (CRLF) for local files. It does not affect the deployed site or any
collaborators on Mac/Linux, since the original line endings are preserved in git's
object store.

The push sequence:
```cmd
git init
git add .
git commit -m "Portfolio site with working Formspree contact form"
git branch -M main
git remote add origin https://github.com/thanos07/Portfolio.git
git push -u origin main
```

For subsequent changes, only three commands are needed:
```cmd
git add .
git commit -m "describe the change"
git push
```

### Deploying on Vercel
Deployed via Vercel's GitHub integration (no CLI required):
- Framework Preset: **Other** — nothing to build, it's static HTML
- Build Command / Output Directory: left blank
- Every `git push` to `main` triggers an automatic redeploy — no manual steps

Live URL: https://portfolio-rosy-psi-74.vercel.app/

---

## 8. Final State of the Project

**What's fully working:**
- All project cards link to real GitHub repos and live demos
- Contact form submits via Formspree (form ID `mvzjpbvp`), delivers to
  `noorali99307@gmail.com`
- Inline success/error feedback on the form — visitor always knows what happened
- "Prefer email directly?" link + one-click Copy button as a permanent manual fallback
- GSAP scroll animations with `prefers-reduced-motion` support
- Mobile-responsive layout with hamburger nav
- Download résumé buttons linked to `assets/resume.pdf`
- IEEE publication linked to the real DOI on IEEE Xplore

**What the visitor sees if something goes wrong:**
- If Formspree is unreachable: a clear coral-coloured error with a direct email link
- If JS is completely disabled: the form still POSTs as a plain HTML form to Formspree,
  and Formspree shows their default "thanks" page
- If the GSAP CDN is slow or blocked: `main.js` detects it and reveals all content
  immediately, so nothing stays hidden

---

## 9. Lessons Learned

**1. Test with people who aren't you.**  
The honeypot bug was completely invisible when I tested the form myself — it only showed
up when someone else (with different browser autofill settings) used it. Always test
with a second person on a different device before calling something "working."

**2. Silent failures are worse than loud ones.**  
The honeypot and the original `mailto:` approach both failed silently — the visitor
thought it worked, I thought it worked, and messages just disappeared. Every user-facing
action that can fail should produce an explicit, visible outcome either way.

**3. Standard solutions exist for common problems — don't reinvent them.**  
Using `mailto:` for a static site contact form, then trying to fix it with a custom
honeypot, then debugging the honeypot — all of this was solvable by just reading what
Formspree already provides (reCAPTCHA spam filtering) and letting it do its job. The
lesson: before adding custom logic on top of a third-party tool, check what the tool
already handles natively.

**4. Security is about the actual threat model, not the appearance of security.**  
The honeypot added visible complexity (a hidden field, a CSS rule, a JS check) without
adding real security — and actively made things worse. Formspree's built-in spam
filtering is based on machine learning across millions of form submissions; a simple
`_gotcha` field doesn't come close to that. Matching your security measures to your
actual threat model (personal portfolio form ≠ bank login) means less code and better
outcomes.

---

*Built with HTML, CSS, GSAP, and a lot of debugging. Deployed on Vercel via GitHub.*  
*Contact: noorali99307@gmail.com*
