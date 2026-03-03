# ZAVN COUTURÉ Website (Static)

## What you have
- index.html
- styles.css
- script.js
- /assets (logo + favicon)

## Quick edits
1) Open `index.html` and update:
   - product names/prices
   - social links
   - email address (search for hello@norova.host)

2) Open `script.js` and change:
   - `const to = "hello@norova.host";` to your real email (so forms send to you)

## Deploy to Norova.host
Most hosting panels work like this:

### Option A — File Manager (cPanel style)
1) Log in to your hosting dashboard
2) Open **File Manager**
3) Go to `public_html/` (or the domain root)
4) Upload everything from this folder:
   - index.html, styles.css, script.js, assets/
5) Visit your domain — you should see the site.

### Option B — FTP
1) Use FileZilla (or similar)
2) Host: your FTP host (from Norova)
3) User/Pass: your FTP credentials
4) Upload the same files to `public_html/`

## Optional upgrades
- Add real checkout: link buttons to Shopify/Squarespace product pages
- Add analytics: paste your tracking script in <head>
- Add form backend: Formspree / Netlify Forms / a PHP mail script
