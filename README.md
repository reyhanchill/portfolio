# Reyhan's portfolio

React, React Router, Framer Motion, custom CSS and optional Firebase Firestore content. Use Node.js 22 or newer.

## Run and check

```sh
npm ci
npm start
npm run lint
CI=true npm test -- --watchAll=false --runInBand
node --test scripts/seed.test.js
npm run build
```

The build output is `build/`. Configure your static host to serve `index.html` for `/about`, `/projects`, `/contact` and other application routes. The application displays a not-found page for unknown paths. The repository does not assume a hosting provider.

## Content

Edit `src/data/portfolio.json`. It supplies the local fallback, shared profile, homepage cards, project gallery, skills and build-time metadata. `profile.website` is the canonical origin used in the footer, social metadata and sitemap. `npm start` and `npm run build` regenerate metadata automatically; do not hand-edit the generated HTML, robots file or sitemap.

Use a real public HTTPS CV URL in `profile.resume`; leave it empty to hide the button. Use exact repository URLs in each project's `link`, public URLs in `live`, and screenshots in `images` (HTTPS URLs or `/images/...` files in `public/`). Supplied screenshots take priority over live embeds. Projects with a live URL and no screenshots embed the actual site in a scaled preview; projects with neither show a branded cover. Sites must permit iframe embedding; the preview link remains usable if a site blocks embedding. The preview opens the live site and uses a pointer cursor, subtle hover lift/glow, a “Click to view site” overlay on hover or keyboard focus, and a keyboard-focus outline; source links remain in the project details. Verify project descriptions, technology lists and results against the underlying work before publishing; this repository cannot prove those projects' implementations.

## Optional Firestore content

Copy `.env.example` to `.env` and fill in the browser Firebase values to enable Firestore. Without them, the site uses local JSON. Browser configuration is public; access is protected by Firestore rules, not by hiding the API key.

The app loads fallback content immediately, then fetches each collection once per page load. Refresh to receive later database edits; there is no realtime subscription. Remote records are validated, use their Firestore document ID and require `schemaVersion: 2`. Old records cannot overwrite the revised content; a valid legacy profile CV is retained. Run the publishing script below to migrate existing content. Invalid or unavailable collections fall back to local content. Profile data is shared by the homepage, contact page and navigation. Metadata comes from the local profile at build time.

## Safe administrative publishing

`firestore.rules` permits public reads of the four portfolio collections and denies browser writes. The rules file is local until explicitly deployed. In a dedicated portfolio Firebase project, deploy it with an authenticated Firebase CLI:

```sh
firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
```

If this Firebase project is shared with other applications, merge the portfolio rules into the existing rules instead of replacing unrelated rules.

Publishing uses the Firebase Admin SDK and Application Default Credentials. Authenticate with an authorised local Google Cloud account (`gcloud auth application-default login`) or set `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON kept outside this repository. Set `FIREBASE_PROJECT_ID` to the intended project. Never put admin credentials in a `REACT_APP_` variable or enable public writes.

```sh
npm run seed -- --check   # Local data validation; no database access
npm run seed             # Read-only plan showing the target project and changes
npm run seed -- --apply  # Apply the reviewed plan in one atomic batch
```

Publishing mirrors the JSON into `projects`, `skills`, `stats`, and `profile`: records removed from those arrays are deleted from those four collections, and existing records are replaced. Other collections are untouched. Review the dry-run deletions and retain any desired console edits in the JSON before applying. Nothing is deployed or published by the build or tests.

## Contact

The form uses FormSubmit and the shared profile email. Activate that address with FormSubmit before relying on delivery. Native required/email checks and trimmed-field validation run before sending; success requires an affirmative service response. Automated tests mock the service and send no real messages.

## Design

Keep the existing neon palette, shared variables and CSS component classes. SVG icons live in `src/components/Icons.js`. Reduced motion disables decorative animation; keyboard focus and mobile navigation labels remain visible.
