# Smart Venue Experience Hub 🏟️

Welcome to the **Smart Venue Experience Hub**! This project is a dual-interface software ecosystem engineered to transform the physical event experience at large-scale venues through real-time wait-time visibility, dynamic crowd density mapping, and cloud-synchronized operations.

## 🎯 Chosen Vertical
**Physical Event Experience (Sporting Event Experiences)**  
Solving real-world friction points—specifically congestion management, concession wait times, and instant administration-to-attendee communication.

## 🧠 Approach and Logic
Our architecture bridges the "information gap" between venue operators and visitors using a dual-app system synchronized via Google Cloud:
- **Asymmetric Design:** A lightweight, glassmorphic Mobile PWA for attendees and a data-dense Bento Grid command center for admins.
- **Fail-Safe Robustness:** All cloud integrations are non-blocking; the app loads instantly with local defaults and seamlessly "upgrades" when Firebase data arrives.
- **Interactive UI:** Premium "hardware-accelerated" GLSL-style CSS glare effects and scaling transitions provide a high-end, futuristic feel.

## ⚙️ How the Solution Works
The project consists of two beautifully polished, fully synchronized applications powered by **5 Google Firebase** services:

**1. Attendee Mobile Web App (PWA)** (`index.html`)
- **Interactive Stadium Map:** Features animated heat-map zones and category-based Point of Interest (POI) filters (Food / Restrooms / Merch).
- **Smart Concessions Search:** Live wait-time estimates with color-coded badges (Green ⚡ / Orange 🕐 / Red ⚠️) and keyword search.
- **Instant Alerts:** Real-time push notifications from stadium admin with in-app toasts and notification badges.
- **Offline Resilience:** PWA manifest and Service Worker support for spotty stadium Wi-Fi.

**2. Venue Management Dashboard** (`admin.html`)
- **Bento-Grid Dashboard:** A responsive desktop command center that collapses to an elegant mobile tab-view.
- **Floor-Level Mapping:** Toggle between Level 1/2 to isolate heat-zones and critical bottlenecks.
- **Global Broadcast Console:** Dispatch instant, multi-device alerts via Firebase Realtime Database with captured performance traces.

## 🚀 Live Access

Both applications are hosted on the public internet via **GitHub Pages**:

*   **Mobile Attendee App:** [https://ujju2020.github.io/Physical-Event-Experience/index.html](https://ujju2020.github.io/Physical-Event-Experience/index.html)
*   **Admin Dashboard:** [https://ujju2020.github.io/Physical-Event-Experience/admin.html](https://ujju2020.github.io/Physical-Event-Experience/admin.html)

## ⚡ Unified Cloud Infrastructure

Powered by a multi-service **Google Firebase** implementation:

| Service | Contribution |
|---|---|
| **Realtime Database** | Sub-millisecond WebSocket synchronization for global alert dispatching. |
| **Analytics** | Tracks 9 specific user interaction events for deep behavioral visibility. |
| **Authentication** | Anonymous Sign-In established on load for verified session attribution. |
| **Performance Monitoring** | Custom traces (`tab_render`, `broadcast_dispatch`) with metadata attributes. |
| **Remote Config** | Dynamic control of `venue_name`, `capacity`, and `wait_thresholds` from the cloud. |

## 🔒 Security & Accessibility
- **CSP Hardening:** Strict Content Security Policy whitelisting only trusted Google/Firebase origins.
- **XSS Sanitization:** All dynamic data is processed through `escapeHTML()` before DOM injection.
- **WCAG Compliance:** Semantic HTML5, ARIA labels, and full keyboard navigation support.

## 🧪 Testing Results: 30/30 PASS

```bash
npm test        # Runs the Node.js native test runner
```

| Test Group | Tests | Coverage |
|---|---|---|
| 🛡️ XSS Sanitization | 5 | Neutralizes script tags, quotes, and malicious ampersands. |
| ⏱️ Wait Time Boundaries | 6 | Accurate mapping of badges (Green/Orange/Red) at boundary minutes. |
| 🔍 Filtering Edge Cases | 6 | Validates search query matching and category isolation. |
| 📊 Data Integrity | 3 | Verifies array immutability and sort ordering. |
| 🔔 Alert Deduplication | 4 | Ensures real-time data streams don't create duplicate UI nodes. |
| 📡 Payload Validation | 6 | Validates admin broadcast structures before cloud push. |

---
*Copyright Information*  
*Developer - Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)*
