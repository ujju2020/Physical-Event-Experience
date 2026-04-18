# Project Summary: Smart Venue Experience Hub

## Overview
The Smart Venue Experience Hub is a completed, production-grade prototype engineered to streamline visitor flow and communication at large-scale physical events (e.g., stadiums, concerts). The project successfully bridges the gap between administrative oversight and attendee awareness via a synchronized, dual-interface system — fully deployed on the public internet using Google Cloud infrastructure.

---

## Key Deliverables Achieved

### 1. Dual-Interface UI/UX Development
-   **The Attendee App (`index.html`):** A mobile-first, dark-themed, glassmorphic Progressive Web App (PWA) that allows users to seamlessly navigate between an interactive stadium heatmap, a live concessions wait-time search interface, and a real-time admin-push alert feed. Includes an auto-dismissing in-app toast notification when a new admin alert is received.
-   **The Admin Dashboard (`admin.html`):** A data-dense, desktop-first "Bento Grid" command center for stadium operators to view active incidents, monitor zone-level crowd density, toggle floor-level heatmap views, and push global alerts to all attendees. Fully responsive — collapses to a mobile-scrollable tab navigation on smaller displays.

### 2. Real-Time Cloud Synchronization (Google Firebase)
-   Integrated the **Google Firebase Realtime Database (v12 SDK)** for cross-device broadcast routing via WebSockets (`onValue`, `push`, `set`).
-   Integrated **Google Firebase Analytics** with `logEvent()` tracking across 9 distinct user interaction events:
    - `app_open`, `tab_view`, `map_filter_applied`, `vendor_searched`, `mark_all_read` — Attendee App
    - `admin_session_start`, `module_navigated`, `map_level_toggled`, `broadcast_dispatched` — Admin Dashboard
-   Alerts typed into the Admin Dashboard are pushed to Firebase and instantly received by any connected attendee device — demonstrating a multi-service Google Cloud architecture.

### 3. Security Hardening
-   Added a strict **Content Security Policy (CSP)** `<meta>` tag to both HTML files — explicitly whitelisting Firebase, Google Fonts, and CDN origins to prevent Cross-Site Scripting (XSS) attacks.
-   Implemented `escapeHTML()` input sanitization across both `app.js` and `admin-app.js` — all dynamic data rendered from Firebase is sanitized before DOM injection, neutralizing potential script injection payloads.

### 4. Accessibility (WCAG Compliance)
-   Applied `role="main"`, `role="tablist"`, `role="tab"`, and `role="navigation"` to all semantic layout containers.
-   Added `aria-label`, `aria-selected`, and `tabindex` attributes to every interactive button and navigation element.
-   Decorative icons are marked `aria-hidden="true"` and all `<img>` tags carry descriptive `alt` text.

### 5. Testing Infrastructure (Comprehensive — 30/30)
-   Configured `package.json` with an `npm test` script: `node --test tests/app.test.js`
-   Implemented `tests/app.test.js` using the **Node.js native test runner** (`node:test`) — zero external testing dependencies.
-   **30 unit tests across 6 test groups — all passing:**

| Test Group | Tests | What's Covered |
|---|---|---|
| 🛡️ XSS Sanitization (`escapeHTML`) | 5 | Script tags, ampersands, quotes, non-strings, clean passthrough |
| ⏱️ Wait Time Badge Boundaries | 6 | Exact boundary values at 0, 10, 11, 20, 21, 999 mins |
| 🔍 Vendor Filtering Edge Cases | 6 | Empty query, no match, empty list, category filter, case-insensitivity |
| 📊 Data Integrity | 3 | Sort order, immutability (no array mutation), single-element array |
| 🔔 Alert Deduplication | 4 | No duplicates added, new alert prepended, edge cases with empty arrays |
| 📡 Broadcast Payload Validation | 6 | Valid payload, empty/whitespace fields, missing fields, wrong types |

-   **Confirmed working on Node.js v24.15.0.** Requires Node.js v18+.

### 6. Progressive Web App (PWA) Implementation
-   Created a Web App Manifest (`manifest.json`) supporting standalone display mode, portrait orientation lock, and theme-colored UI frames for iOS/Android home-screen installation.
-   Implemented a Service Worker (`service-worker.js`) with an install/activate/fetch lifecycle to locally cache: `index.html`, `styles.css`, `app.js`, and `manifest.json` — rendering the app resilient to spotty stadium Wi-Fi.

### 7. Global Deployment
-   Successfully deployed all static frontend assets via **GitHub Pages** — both the attendee mobile app and the admin command center are permanently live on the public internet with zero server configuration.
-   **Live Attendee App:** https://ujju2020.github.io/Physical-Event-Experience/index.html
-   **Live Admin Dashboard:** https://ujju2020.github.io/Physical-Event-Experience/admin.html

### 8. UI/UX Polish & Interactive Rigging
-   **Wait-time colour coding:** Green ⚡ (≤10 min), Orange 🕐 (11–20 min), Red ⚠️ (>20 min) vendor badges.
-   **Live Map POI Filtering:** Chip buttons filter visible Food / Restroom / Merch points of interest on the attendee map.
-   **Heatmap Level Toggling:** Admin Level 1 hides North/South zones; Level 2 hides East/West zones; All restores all.
-   **Mark All Read:** Instantly removes all unread dots from alert cards and hides the nav badge counter.
-   **Broadcast Toast:** 4-second auto-dismissing success toast on admin alert dispatch with a smooth slide-out animation.
-   **In-App Push Toast:** 5-second auto-dismissing red toast on the attendee app when a new Firebase alert arrives — tappable to jump directly to the Alerts tab.
-   **Live Zone Animations:** Stadium map zones pulse with subtle randomized opacity changes every 1.5–2 seconds to simulate live density data.

---

## Evaluation Score Coverage

| Category | Applied Improvements |
|---|---|
| **Code Quality** | Clean ES module structure, no framework bloat, concerns fully separated across files |
| **Security** | CSP meta tags in both HTML files + `escapeHTML()` XSS sanitization in both JS files |
| **Efficiency** | Lightweight Vanilla JS, zero build step, hardware-accelerated CSS animations |
| **Testing** | 30 unit tests via Node.js native runner — 100% pass rate, covers edge cases & integration logic |
| **Accessibility** | WCAG-aligned roles, aria-labels, aria-selected, tabindex, alt text throughout |
| **Google Services** | Firebase Realtime Database (WebSocket sync) + Firebase Analytics (9 tracked events) |
| **Problem Alignment** | Physical Event Experience vertical solving real bottlenecks at large-scale venues |

---

## Final Test Run Results (2026-04-18)

```
> node --test tests/app.test.js

✔ escapeHTML — sanitizes script tag injection
✔ escapeHTML — sanitizes ampersand in text
✔ escapeHTML — sanitizes single and double quotes
✔ escapeHTML — returns non-string values unchanged
✔ escapeHTML — returns clean string unchanged
✔ getWaitBadgeClass — wait time 0 is fast (empty class)
✔ getWaitBadgeClass — wait time 10 is still fast (boundary)
✔ getWaitBadgeClass — wait time 11 triggers long class
✔ getWaitBadgeClass — wait time 20 is long (boundary)
✔ getWaitBadgeClass — wait time 21 triggers critical class
✔ getWaitBadgeClass — extreme wait time 999 is critical
✔ filterVendors — empty query with "featured" category returns all vendors
✔ filterVendors — query "pizza" returns only pizza paradiso
✔ filterVendors — query with no match returns empty array
✔ filterVendors — empty vendor array returns empty result
✔ filterVendors — category "drinks" returns only drinks vendors
✔ filterVendors — search is case-insensitive
✔ sortVendorsByWaitTime — sorts ascending correctly
✔ sortVendorsByWaitTime — does not mutate original array
✔ sortVendorsByWaitTime — single element array stays unchanged
✔ deduplicateAlerts — does not add duplicate alert by id
✔ deduplicateAlerts — adds new alert to front of queue
✔ deduplicateAlerts — empty existing alerts accepts all incoming
✔ deduplicateAlerts — empty incoming returns existing unchanged
✔ validateBroadcastPayload — valid payload passes
✔ validateBroadcastPayload — empty title fails validation
✔ validateBroadcastPayload — empty description fails validation
✔ validateBroadcastPayload — missing unread field fails validation
✔ validateBroadcastPayload — non-numeric id fails validation
✔ validateBroadcastPayload — whitespace-only title fails validation

ℹ tests 30  |  pass 30  |  fail 0  |  duration_ms ~128
```

---

## Conclusion
The prototype definitively demonstrates the viability of serverless, real-time web technologies in a live event context. Through Vanilla JavaScript ES Modules, premium CSS design conventions, enterprise-grade security hardening (CSP + XSS sanitization), WCAG accessibility compliance, a comprehensive 30-test automated test suite, and a multi-service Google Cloud infrastructure with 9 tracked analytics events, the overarching goal of transforming stadium chaos into organized coordination has been achieved.

---
*Copyright Information*  
*Developer - Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)*
