# Gaddam Madhukanth, Cloud & DevOps portfolio

A static, dependency-free portfolio (HTML, CSS and vanilla JavaScript). No build step.

## Run locally

Sections are loaded with `fetch()`, so the site must be served over http (opening `index.html` by double-click will not work).

```bash
python -m http.server 8000      # then open http://localhost:8000
# or: VS Code > Live Server
```

## Project layout

| Path | What it does |
| --- | --- |
| `index.html` | Page shell, SEO / social tags, loader markup |
| `components/*.html` | One file per section (hero, about, skills, projects, workflow, contact, footer) |
| `js/projects.js` | **Your project data.** The Status window, tool pop-ups, palette and assistant all read from it |
| `js/status.js` | Identity lines for the About "Engineer Status" window (`PROFILE`) |
| `js/hero-terminal.js` | Commands for the interactive terminal |
| `js/assistant.js` | Gama Bot: welcomes visitors, small talk, jokes, quiz, intro-email drafter. Answers come from the page content, never invented. Jokes / facts / quiz are plain arrays at the top |
| `js/pitch.js` | The portfolio "talks" to visitors: rotating hero line + section speech bubbles. Edit `HERO_LINES` / `SECTION_LINES` at the top |
| `js/palette.js` | Command palette (Ctrl/Cmd + K, or `/`) |
| `js/extras.js` | Tool pop-ups, "Run the pipeline", resume handling, shared helpers |
| `css/comic.css`, `css/extras.css` | Theme and feature styles. Colours are variables at the top of `comic.css` |

## Before you publish (checklist)

- [x] Email set to `builtbygama@gmail.com` in `components/contact.html`
- [ ] Add your LinkedIn URL in `components/contact.html` (it is `#` for now)
- [ ] Put your resume at `assets/resume.pdf` (the Download CV button checks for it)
- [ ] Add screenshots / architecture diagrams to `assets/projects/` and reference them in `js/projects.js`
- [ ] After you know your domain: set `<link rel="canonical">`, and make `og:image` / `twitter:image` absolute URLs in `index.html`
- [ ] Mark projects `Completed` in `js/projects.js` as you finish them. The Status window updates itself
- [ ] Pin the Devicon CDN version in `index.html` (currently `@latest`) once you have confirmed which icons you need

## Deploy

**GitHub Pages (included):** make this folder the root of a repo, enable *Settings > Pages > Source: GitHub Actions*, and push to `main`. `.github/workflows/deploy.yml` validates and publishes it.

**S3 + CloudFront / Netlify / Cloudflare Pages:** upload the folder as-is. `_headers` adds security and cache headers on Netlify and Cloudflare Pages.

## Keyboard and interaction

| Action | How |
| --- | --- |
| Quick navigation | `Ctrl/Cmd + K` or `/` |
| Skip the loader | `Esc` / `Enter` / click Skip |
| Terminal | click the hero terminal, type `help` |
| Assistant | the ghost button, bottom-right (try the "Why hire Gama?" chip) |
| Speech bubbles | appear once per section; "Hush these tips" turns them off for good |
| Easter egg | Konami code, or `party` in the terminal |

Animations and the sparkle trail respect `prefers-reduced-motion`.

## Accessibility and quality notes

- Landmarks (`main`, `nav`, headings), skip link, visible focus rings, labelled controls, `aria-live` regions
- Open Graph / Twitter / JSON-LD metadata, favicon, `robots.txt`, custom `404.html`
- Print stylesheet hides decorative layers
- Run Lighthouse (Chrome DevTools) after deploying and aim for 90+ in each category

## Assistant: what it is and what it stores

- A **scripted** assistant (no AI model, no network calls). It says so in its first messages.
- It never opens by itself. Visitors open it from the ghost button.
- Optional first name and role are kept in `sessionStorage` for the visit only. A "returning visitor" flag is kept in `localStorage`. Nothing is sent anywhere.
- Speech-bubble tips can be turned off for good ("Hush these tips", or type "hush" to the bot).
