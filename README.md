# Kilimani Garage website

A static, no-build website using HTML, CSS and vanilla JavaScript. No packages or server are required.

## Open the site

Open `index.html` directly in a browser. The page works from a `file://` URL. Google Fonts need an internet connection; local system fallbacks are defined.

## Project files

- `index.html`: semantic page markup, business metadata and JSON-LD.
- `assets/css/styles.css`: theme, responsive layout, modal and print styles.
- `assets/js/app.js`: filtering, sorting, cards, carousel, forms, dialog, gallery, calculator and navigation.
- `assets/js/images.js`: inline SVG fallback for unavailable photos.
- `data/cars.js`: editable used-car inventory. Update a record here when stock or prices change.
- `data/services.js`: editable services, starting prices and estimated durations.
- `scripts/check.mjs`: dependency-free checks for inventory data and key site wiring.
- `package.json`: one optional npm script; there are no runtime dependencies or build step.
- `vercel.json`: static Vercel output and response headers.
- `images/`: add the real vehicle and garage photography using the exact names in `PHOTOS.md`.

The script tags at the bottom of `index.html` must retain this order: car data, service data, image helpers, application logic.

## Business details to verify before publishing

The opening hours currently use the supplied example: Monday-Friday 7:30am-6pm, Saturday 8am-4pm, Sunday closed. Update the contact section, appointment note, footer, and structured data in `index.html` if actual hours differ. Inventory prices and vehicle specifications are illustrative estimates; confirm all details before publishing.

## Features

Responsive dark/light themes, keyboard-operable navigation, car search and combined filters, sort and reset, featured stock carousel, details dialog, photo gallery lightbox, WhatsApp appointment/contact/trade-in actions and a live finance estimate.

## Check the project

With Node.js installed, run `npm run check`. The website itself does not require Node.js and still opens by double-clicking `index.html`.

## Deploy to Vercel

Import this repository into Vercel and use the repository root as the project root. Select **Other** as the framework preset, leave the build command empty, and set the output directory to `.`. `vercel.json` declares the static output and headers. Before deploying, run `npm run check`. After deployment, inspect the live site on desktop/mobile and test the WhatsApp, phone, email, and Maps links. Static hosting serves the page and assets; it does not create an order database or guarantee capacity without a load test.

## WhatsApp orders

The inventory is currently empty so the site does not present sample cars or estimated sale prices as real stock. Visitors can ask for current stock and confirmed prices on WhatsApp. When confirmed vehicles are added to `data/cars.js`, their order buttons open WhatsApp with the selected vehicle and price. The customer sends the message and the garage confirms availability and payment/delivery arrangements directly. This front-end does not reserve stock, collect payment, or store orders.

## Real photos

The `images/` directory is currently empty, so there are no real vehicle photos in this checkout. Add real, approved photos of each confirmed vehicle using the instructions in `PHOTOS.md`; use a clear front/three-quarter vehicle shot, consistent crop, and compressed JPEGs or update the data extension and fallback paths together. Optional per-car gallery photos use the same filename with `-2.jpg` and `-3.jpg`. Do not publish a vehicle image unless it depicts that actual listing.

Vehicle images load in this order: local file, Pexels search result, then inline SVG silhouette. To enable Pexels search, replace `PASTE_YOUR_KEY_HERE` in `assets/js/images.js` with a Pexels API key. Browser JavaScript is public, so visitors can inspect that key. Use a key restricted to the intended domain where Pexels supports that control, monitor its usage, and rotate it if exposed. For production-grade secret handling, proxy Pexels requests through a backend. Pexels photo results are cached in session storage for the current browser session. The page shows a Pexels link in the footer and sets each result image title to its photographer. Check Pexels API terms and ensure the result is appropriate before presenting it as a specific car; search results are illustrative and are not guaranteed to depict the exact year, trim, or vehicle for sale.

## Hosting and traffic

This is a static site and can be deployed to a CDN-backed static host. A static page can serve many visitors, but this repository has not had a 10,000-user load test and cannot guarantee a particular concurrent-user level. WhatsApp is a separate third-party service with its own availability and messaging limits. For reliable stock reservation, order records, payment, availability synchronization, abuse controls, analytics, and measured 10,000-user capacity, add a secured backend/database and load-test the chosen hosting and APIs before promising that capacity.
