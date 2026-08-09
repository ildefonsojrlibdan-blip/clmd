# CLMD Website — Curriculum & Learning Management Division
### Department of Education — Regional Office XII (SOCCSKSARGEN)

A modern, premium-quality, responsive HTML5 + CSS + JavaScript (Bootstrap 5) web portal
styled as a government executive dashboard combined with an education management portal.

---

## Quick Start

Serve the folder with any static web server (fetch of JSON data is used, so do **not**
open files directly via `file://`).

```bash
cd clmd-website
python3 -m http.server 8000
# open http://localhost:8000
```

---

## File Structure

```
clmd-website/
├── index.html                    # Home / landing page
├── about.html                    # Vision, Mission, Core Values, Leadership, Contact, Map
├── programs.html                 # Flagship & special programs
├── downloads.html                # Download center (search + category filters)
├── memoranda.html                # Regional Memoranda repository
├── advisories.html               # Regional Advisories repository
├── gallery.html                  # Photo gallery with filters + lightbox
├── contact.html                  # Inquiry/feedback forms + FAQ + map
│
├── learning-areas/               # 12 dedicated learning-area pages (data-driven)
│   ├── english.html  math.html  science.html  filipino.html
│   ├── ap.html  values.html  mapeh.html  tle.html
│   ├── scp.html  inclusive.html  sshs.html  lrmds.html
│
├── analytics/
│   ├── performance.html          # Regional performance dashboard
│   ├── aral.html                 # Aral Program dashboard (8 SDOs)
│   ├── assessment.html           # CRLA / RMA / ECD dashboard
│   └── visitors.html             # Visitor analytics module
│
├── assets/
│   ├── css/style.css             # Full theme (violet/gold/silver, glass, dark mode, responsive)
│   ├── js/
│   │   ├── main.js               # Header/footer injection, dark mode, search, visitor counter, etc.
│   │   ├── common.js             # Count-up, export PDF/Excel/CSV, lightbox, JSON loader
│   │   ├── area-page.js          # Renders each learning-area page from JSON
│   │   └── generate_placeholders.py  # (dev) regenerates the SVG placeholders
│   ├── images/                   # SVG logos, banners, profile/EPS placeholders
│   ├── data/                     # ALL dynamic content (JSON)
│   └── pdf/sample.pdf            # Sample document for preview/download
```

---

## Data Management

All dashboard, content, and document data live in **external JSON files** under
`assets/data/`, so content can be updated without editing HTML:

| File | Contents |
|------|----------|
| `site.json` | Site info, contact, social, core values, executive leadership |
| `learning-areas.json` | All 12 learning areas + EPS profiles + resources |
| `performance.json` | Regional performance events, stats, awardees, charts |
| `aral.json` | Aral Program gains across the 8 divisions (all chart datasets) |
| `assessment.json` | CRLA / RMA / Philippine ECD Checklist results |
| `memoranda.json` | Regional memoranda repository |
| `advisories.json` | Regional advisories repository |
| `downloads.json` | Download center catalogue |
| `gallery.json` | Photo gallery entries |
| `visitors.json` | Visitor analytics defaults |

### Visitor Counter (demo → backend)

The visitor module runs in **demo mode using browser LocalStorage**. To go live,
edit the `initVisitor()` function in `assets/js/main.js` to `fetch()` from your API
or database endpoint instead of reading/writing LocalStorage. All stat elements use
`data-visitor` attributes and update automatically.

---

## Libraries (CDN)

- **Bootstrap 5.3** — layout, components, dropdowns, modals, accordions, toasts
- **Bootstrap Icons** & **Font Awesome** — iconography
- **AOS** — scroll animations
- **Chart.js 4** — interactive charts
- **CountUp.js** — animated counters
- **Particles.js** — hero particle field
- **SweetAlert2** — dialogs/toasts

---

## Features

- Royal violet / metallic gold / silver-gray executive theme
- Glassmorphism cards, gradient sections, soft shadows, hover effects
- Animated hero slideshow + particles + animated counters
- Full interactive navigation with dropdowns, active states, mobile menu
- Dark mode toggle, high contrast + large text accessibility, language toggle
- Global AI-like search (learning areas, programs, memos, advisories, downloads, gallery)
- Notifications panel, back-to-top, floating quick menu, print page
- Export PDF / Excel / CSV from dashboards
- Chart.js dashboards: bar, line, pie/doughnut, radar, heat maps, auto-generated interpretations
- Searchable memoranda & advisories repositories with PDF viewer, download, print, share
- Download center with search + category filters + preview/download
- Photo gallery with program/year/division/event filters + lightbox
- Visitor analytics (total, today, week, month, online, returning, by country & region)
- Responsive from mobile → ultra-wide, SEO-ready, WCAG-friendly, lazy-loaded images
