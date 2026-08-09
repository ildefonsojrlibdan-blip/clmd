# CLMD Region XII Digital Portal

A responsive, JSON-driven Bootstrap 5 website for the Curriculum and Learning Management Division, DepEd Regional Office XII – SOCCSKSARGEN.

## Run locally
Because browsers restrict `fetch()` on `file://` URLs, use a local web server for live JSON updates:

```bash
cd clmd-region-xii-portal
python -m http.server 8000
```
Then open `http://localhost:8000`. An external JavaScript fallback is included so core demo data also displays when pages are opened directly.

## Deploy to Netlify
Use `clmd-region-xii-netlify-deploy.zip`, extract it, and drag the **entire extracted folder** into Netlify Drop. Do not upload `index.html` by itself: the site requires the sibling `assets/` folder and all page directories. See `DEPLOY-NETLIFY.txt` for exact steps.

For a Git deployment, keep these files at the repository root, leave the build command blank, and set the publish directory to `.`.

## Update content
Edit JSON files in `assets/data/`. Replace demonstration PDFs in `assets/pdf/` and placeholder profile SVGs in `assets/images/` before official publication.

## Important
- Analytics and repository records are demonstration data.
- Leadership names are based on the supplied project brief.
- Program-holder names, assignments, professional designations, and photographs were updated from the supplied `Name Attachments etc.pdf` document. Confirm final spelling, credentials, and image-use approval before official publication.
- Landing-page and gallery photographs were selected, enhanced, and organized from the supplied `CLMD Events for the Landing Page.pdf`. Confirm event dates, final captions, and image-use approval before official publication.
- Contact address, regional email, and telephone use published DepEd Region XII directory information; verify before deployment.
- The custom CLMD mark is a portal identity placeholder, not an official seal.
