============================================================
  EVALASTING EVENTS — WEBSITE PACKAGE
  Static multi-page site (HTML / CSS / JS) — SEO optimized
============================================================

WHAT'S INSIDE
-------------
  index.html .......... Home / landing page (includes the "About Us" section)
  services.html ....... Event Planning, Decorations, Rentals (anchored sections)
  portfolio.html ...... Gallery of your real events (with click-to-zoom lightbox)
  contact.html ........ Custom inquiry form (routes to Go High Level) + FAQ
  assets/css/styles.css  All styling
  assets/js/config.js ... ★ EDIT ME: phone, email, area, hours, socials
  assets/js/main.js ..... Menu, scroll effects, lightbox, inquiry-form handler
  assets/images/ ........ Your logo, optimized photos, and favicons
  sitemap.xml, robots.txt, site.webmanifest ... SEO / browser files

  The "About" link in the menu is a deep link that jumps to the
  About Us section on the home page (there is no separate About page).


------------------------------------------------------------
1) HOW TO PUT IT ONLINE (your own domain)
------------------------------------------------------------
Keep every file in the SAME folder structure as this package
(the pages expect the "assets" folder to sit beside them).

  • Upload the entire contents of this folder to your web host's
    root/public directory (often called public_html, www, or htdocs)
    via your host's File Manager or an FTP app (e.g. FileZilla).
  • index.html must be at the top level so it loads as the homepage.
  • Point your domain to the host if you haven't already.

The page-to-page menu links only work once all files are hosted
together — that's normal for previews shown one page at a time.


------------------------------------------------------------
2) CONNECT THE FORM TO GO HIGH LEVEL + YOUR EMAIL (important)
------------------------------------------------------------
The Contact page uses a CUSTOM form (built to match the site). It sends
each submission to a Go High Level "Inbound Webhook." A GHL Workflow then
(a) creates/updates the contact in your CRM and (b) emails the inquiry to
your inbox. Nothing else is needed — no GHL form builder.

IMPORTANT: until you complete step 2 below, the form is in DEMO mode —
it shows the "Thank you" message but does NOT send anything.

STEP 1 — Create the webhook in GHL
  a. Go to:  Automation → Workflows → + Create Workflow → Start from Scratch.
  b. Click "Add New Trigger" → choose "Inbound Webhook".
  c. Copy the Webhook URL it shows you. (Leave this tab open.)

STEP 2 — Paste the URL into the site
  a. Open contact.html and find this line near the form:
         window.EVALASTING_WEBHOOK_URL = "";
  b. Paste your URL between the quotes, e.g.
         window.EVALASTING_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/XXXX";
  c. Save and re-upload contact.html.

STEP 3 — Capture the fields
  a. Go to your live Contact page and submit one TEST inquiry.
  b. Back in the GHL workflow trigger, it will capture the sample so GHL
     "learns" the fields. The form sends these keys:
         name, email, phone, event_type, event_date, guest_count,
         message, consent, source, page, submitted_at

STEP 4 — Route it to your CRM and your email
  a. Add action "Create/Update Contact" → map name, email, phone, and
     (optional) create Custom Fields for event_type, event_date,
     guest_count, message; map them too.
  b. Add action "Send Email":
        • To: YOUR business email (the notification)
        • Subject: New inquiry from {{contact.name}}
        • Body: include the fields above so you see the full request.
  c. (Optional) Add a second "Send Email" as an auto-reply to the
     person who inquired (To: {{contact.email}}).
  d. (Optional) Add "Create Opportunity" to drop them into a pipeline.
  e. Click "Publish" (top right). Toggle the workflow ON.

STEP 5 — Test end to end
  Submit the form again and confirm: a contact appears in GHL AND the
  notification email lands in your inbox.

FALLBACK (only if needed): if your GHL plan has no Workflows, or the
browser blocks the direct post, route the form through a free relay such
as Web3Forms (web3forms.com) or Zapier/Make — both can email you AND
forward to the GHL webhook. The form is endpoint-agnostic: just put that
relay's URL in window.EVALASTING_WEBHOOK_URL instead.


------------------------------------------------------------
3) EASY EDITS — contact info, hours, service area, socials
------------------------------------------------------------
Phone, email, service area, hours, and social links are ALL
controlled from ONE file:   assets/js/config.js

Open it, change the value between the quotes, save, and re-upload
that one file. It updates everywhere automatically — the footer on
every page, the Contact page, and the inline text.

  phone / phoneDisplay ... your number (the call link + how it shows)
  email .................. your contact email
  area .................. your city / main service area
  hoursShort / hoursFull  footer hours / Contact-page hours
  instagram/facebook/tiktok ... your social links

(No HTML knowledge needed — just don't delete the quotes or commas.)

------------------------------------------------------------
4) SET-ONCE ITEMS (edit directly in the .html files, one time)
------------------------------------------------------------
A few things live in each page's code and rarely change. Use
find & replace across the .html files to set them once:

  www.evalastingevents.com .. your real domain (canonical, Open
                              Graph, sitemap.xml, robots.txt, schema)
  [Your City] ............... also appears in page TITLES, meta
                              descriptions, and schema (SEO text only)
  SEO schema in index.html (JSON-LD) — set phone/email to match config

Also review:
  • The sample testimonial on the home page — replace with a real review.
  • The FAQ answers on the Contact page — confirm they match your policies.


------------------------------------------------------------
5) PHOTOS
------------------------------------------------------------
Your four photos were optimized for the web and one was rotated upright.
Each has a full-size and a "-thumb" version in assets/images/.

To add more portfolio photos later:
  • Drop new images into assets/images/ (aim for ~1600px wide, JPG).
  • Copy one of the <figure class="shot">...</figure> blocks in
    portfolio.html, then update the file names, alt text, and caption.


------------------------------------------------------------
6) SEO NOTES (already built in)
------------------------------------------------------------
  • Unique titles + meta descriptions per page
  • Open Graph + Twitter cards for nice link previews
  • JSON-LD structured data (LocalBusiness, Service, FAQ, Breadcrumbs,
    ImageGallery)
  • sitemap.xml + robots.txt + canonical tags
  • Descriptive image alt text, semantic headings, mobile-friendly, fast

After replacing the domain placeholder, submit your sitemap in
Google Search Console: https://search.google.com/search-console
and create a Google Business Profile for local search.

Questions or tweaks? Just ask — happy to adjust anything.
============================================================
