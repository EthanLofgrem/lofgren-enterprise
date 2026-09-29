# Public website audit

Date: 2026-09-29. Branch `le/website-audit-seo` (on top of `le/003-owner-console`). Scope: the 11 public pages, the 404 page, and search/sharing metadata. Pre-launch: the site is protected on Vercel and marked `noindex`.

## Summary

The member-model site is complete and consistent. The core lines appear where intended ("Bring what you do. Build what comes next." as the home headline; "Make. Create. Operate. Collaborate." above it, in the footer, and in the sign-up band; the seven stages as the How it works headline and step names). Automated accessibility scans pass on every page in light and dark mode at desktop and phone sizes. Wording no longer claims things that don't exist yet. SEO is built and switched off until launch.

## What was checked, and how

| Check | Method | Result |
|---|---|---|
| Accessibility | axe-core (WCAG 2.1 A/AA + best practices) on 11 pages × light/dark × desktop/phone = 44 scans | Pass after one fix (below) |
| Contrast | Same scans, plus a token check of all 60 text/background pairs | Pass (all ≥ 4.5:1) |
| Headings | One `h1` per page; FAQ questions are `h2` inside their toggles | Pass |
| Keyboard | Skip link is the first tab stop; join form steps move focus to the step heading | Pass |
| Mobile | No horizontal scrolling on any page; menu opens and navigates | Pass |
| Links | Every internal link on every public page requested | All resolve (none 4xx/5xx) |
| Wording | Automated scan for banned claims; manual read of every page | Pass after fixes (below) |
| Metadata | Unique title and description (50 to 170 characters) and canonical URL on every page; share card tags | Pass |
| Pre-launch privacy | Every page `noindex`; `robots.txt` blocks all crawling; sitemap empty | Pass |
| Visual | 48 screenshots (12 pages × desktop/phone × light/dark), full page and first screen, reviewed | No layout defects found |
| Join flow | Four steps, browser validation, review screen, locked submit while intake is off | Pass |
| Redirects | `/apply`, `/producers`, `/partners` go to their member-model pages | Pass |

## Found and fixed

1. **Accessibility:** the pre-launch banner sat outside any page landmark (screen readers couldn't place it). Now an `aside` labeled "Site status".
2. **Unsupported claims:**
   - "our attorneys" (6 places) implied counsel already retained. Now "an attorney".
   - "we email you to confirm your account and set up your sign-in": member sign-in doesn't exist yet. Now "we email you about next steps".
   - "your share is real and protected" is a legal-sounding promise. Now "every member's share written into its agreement".
3. **Home description** was too long for search results. Rewritten to 133 characters.
4. **No custom 404:** unknown addresses showed a bare default page. Now "We couldn't find that page." with links home, to the steps, and to sign-up.

## Added

- Per-page titles, descriptions, and canonical URLs (`pageMetadata` in `src/lib/site.ts`).
- Share card (`/opengraph-image`, 1200×630): tagline, headline, seven stages. Site icon (`/icon.svg`).
- Structured data: `Organization` on the home page (name, URL, description, slogan only) and `FAQPage` on the FAQ, mirroring the visible answers exactly.
- `robots.txt` and `sitemap.xml`, both closed until launch.

## Turning search on at launch (owner)

Set `SITE_INDEXING=true` and `NEXT_PUBLIC_APP_URL=https://<your domain>` on the **Production** environment in Vercel, then redeploy. Previews can never be indexed, whatever the variable says. `/console`, `/join/received`, and `/api` stay excluded from `robots.txt` and always send `noindex`.

## Still open (needs a person)

- **Attorney review before launch:** Capital partners page, FAQ answers on money and privacy ("We never sell your information"), Fees wording, and the draft Privacy and Terms pages.
- **Contact:** the contact form is a labeled preview; a real contact address or working form is needed before launch.
- **Real accounts:** "Create your account" currently files a profile for review; member sign-in arrives with the pilot's `member_profiles` work.
- **Analytics:** none installed. Add only after a privacy review.
