# Smart Venue Experience Hub 🏟️

Welcome to the **Smart Venue Experience Hub**! This project is a dual-interface software prototype designed to dramatically improve the physical event experience for attendees at large-scale sporting venues through wait-time visibility, crowd density mapping, and real-time operational coordination.

## 🎯 Chosen Vertical
**Physical Event Experience (Sporting Event Experiences)**
We chose this vertical to solve real-world friction points at massive venues — specifically tackling congestion management, concession wait times, and emergency administration-to-attendee communication.

## 🧠 Approach and Logic
Our approach was to build a dual-interface architecture (an Attendee App and an Admin Dashboard) that communicates in real-time over Google Cloud. The logic centers around three pillars:
- **Spatial Awareness:** Dynamic heatmaps direct attendees away from heavily congested areas to reduce bottlenecks.
- **Time Optimization:** Real-time wait-time estimates for concession stands help distribute attendee footfall across vendors.
- **Instant Communication:** A global push-notification system over WebSockets alerts all connected users instantly of incidents, bypassing unreliable PA systems or static signs.

## ⚙️ How the Solution Works
The project consists of two beautifully designed, fully synchronized front-end applications powered by **Google Firebase** for state synchronization and usage analytics:

**1. Attendee Mobile Web App (PWA)** (`index.html`)
- **Interactive Stadium Map:** Features dynamically expanding heat-maps indicating real-time foot traffic density with filter chips for Food, Restrooms, and Merch.
- **Smart Concessions Search:** Skip the line! Features live wait-time estimates and an instant real-time search/filter for all food vendors.
- **Push Notification Hub:** Receive live alerts straight from stadium administration, complete with intelligent "unread" badging, badge counters, and a "Mark All Read" sweep.
- **Progressive Web App:** Fully installable to your smartphone's home screen with offline caching via Service Workers and native iOS/Android safe-area layout tuning.

**2. Venue Management Dashboard** (`admin.html`)
- **Responsive Command Center:** Fully responsive across massive monitor walls down to pocket-sized mobile screens using a scrollable tab navigation system.
- **Dynamic Floor Planning:** Visually toggle the master map between Level 1, Level 2, or All to instantly isolate heat zones and selectively display relevant operational callouts.
- **Live Incident Stream:** A real-time data tracker feeding in simulated friction points (medical needs, crowd bottlenecks, equipment faults).
- **Global Broadcast Console:** A functional dispatch panel that allows administration to compose and push custom alerts to all connected attendee devices instantly via Firebase.

## 🚀 Live Access

Both applications are hosted on the public internet via **GitHub Pages** — no local servers or installation required!

*   **Mobile Attendee App:** [https://ujju2020.github.io/Physical-Event-Experience/index.html](https://ujju2020.github.io/Physical-Event-Experience/index.html)
*   **Admin Dashboard:** [https://ujju2020.github.io/Physical-Event-Experience/admin.html](https://ujju2020.github.io/Physical-Event-Experience/admin.html)

*Tip: Open the Mobile App on your phone and the Admin Dashboard on your laptop to experience true cross-device synchronization.*

## ⚡ Cloud Infrastructure

This application uses a fully serverless, real-time cloud architecture powered by multiple **Google Firebase** services:
- **Firebase Realtime Database:** When an admin dispatches an alert, it is pushed to the cloud database in real-time.
- **Firebase Analytics:** User engagement events and page interactions are tracked to understand attendee behaviour patterns.
- The Attendee mobile app maintains a persistent WebSocket `onValue()` listener that immediately binds the incoming payload to the screen, sliding down a custom notification toast in milliseconds.

## 🔒 Security
- **Content Security Policy (CSP):** Both HTML files enforce a strict Content-Security-Policy via meta tags, explicitly whitelisting only trusted origins (Firebase, Google Fonts, Lucide CDN) to mitigate XSS injection attacks.
- **Input Sanitization:** An `escapeHTML()` function sanitizes all dynamic data rendered from Firebase before it is written to the DOM, preventing malicious script injection via database payloads.

## ♿ Accessibility
- Semantic HTML5 `role` attributes (`role="main"`, `role="tablist"`, `role="tab"`) are applied to all key layout elements.
- All interactive buttons have `aria-label` descriptions and `aria-selected` state management.
- Decorative icons are marked with `aria-hidden="true"` and all images include descriptive `alt` text.
- Full keyboard `tabindex` navigation flow is supported across both applications.

## 🧪 Testing
- A `tests/app.test.js` file implements unit tests using the Node.js native test runner.
- Tests validate core business logic, including event severity filtering and wait time processing.
- Run tests locally with `npm test` (requires Node.js v18+).

## 🛠️ Built With

- **HTML5 & Vanilla JS ES Modules:** No complex compilation steps required.
- **CSS3:** Premium deep-space aesthetic, glassmorphism UI components, and hardware-accelerated animations.
- **Firebase v12 JS SDK:** Realtime Database (cross-device synchronization) + Analytics (event tracking).
- **Service Workers:** PWA offline-caching support for stadium Wi-Fi resilience.
- **GitHub Pages:** Free, public, zero-config static deployment.

## 🔮 Next Steps (Roadmap)

To elevate this prototype to a full production system:
- Implement hardware API bindings to pull live turnstile or heat-sensor data onto the map instead of randomized mock data.
- Integrate **Firebase Authentication** to secure the Admin Dashboard behind an admin-only login screen.
- Expand the test suite to cover integration flows and edge cases.

## 🤔 Assumptions Made
- We assume the venue provides reliable public Wi-Fi for attendees to maintain the WebSocket connection.
- We assume attendees will actively use their smartphones during intervals to navigate the venue.
- Firebase Authentication and full access control for the Admin dashboard were deferred to focus on real-time synchronization UX for the hackathon scope.
- Randomized data generation simulates actual venue foot-traffic API outputs that would be sourced from real-world sensor hardware in production.

---
*Built to transform chaos into coordination.*

---
*Copyright Information*
*Developer - Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)*
