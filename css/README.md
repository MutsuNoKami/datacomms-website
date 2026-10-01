# Jr Data Comms — Website

Static website for Jr Data Comms (jrdatacomms.co.uk).

## Files

- `index.html` — Homepage
- `services.html` — Services
- `about.html` — About
- `contact.html` — Contact + enquiry form
- `privacy.html` — Privacy Policy (UK GDPR)
- `terms.html` — Terms & Conditions
- `css/style.css` — All styles
- `js/main.js` — Navigation, animations, form validation
- `robots.txt`, `sitemap.xml`, `.htaccess`, `site.webmanifest`

## Setup Checklist

1. **Contact form** — Sign up free at https://formspree.io, create a form, then replace
   `your-form-id` in `contact.html` with your form ID. Submissions will be emailed to
   jrakem58@gmail.com.
2. **Images** — Add your OG images to `/images/` (1200×630 px):
   `og-image.jpg`, `og-services.jpg`, `og-about.jpg`, `og-contact.jpg`.
3. **Favicon** — Add `/favicon.svg`, `/apple-touch-icon.png`,
   `/android-chrome-192x192.png`, `/android-chrome-512x512.png`.
4. **Upload** — Upload all files to your hosting root (public_html or equivalent).
5. **HTTPS** — Ensure your SSL certificate is installed. `.htaccess` will force HTTPS
   and strip `www.`.
6. **Google Search Console** — Add `https://jrdatacomms.co.uk`, verify, and submit
   `sitemap.xml`.

## Notes

- Contact form validation runs client-side; server-side is handled by Formspree.
- Legal pages (Privacy, Terms) are templates. Have a solicitor review before publishing.
- No testimonials, statistics or certification claims are used on the site.