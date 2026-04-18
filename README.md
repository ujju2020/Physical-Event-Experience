# Smart Venue Experience Hub 🏟️

Welcome to the **Smart Venue Experience Hub**! This project is a dual-interface software prototype designed to dramatically improve the physical event experience for attendees at large-scale sporting venues through wait-time visibility, crowd density mapping, and real-time operational coordination.

## 🎯 Chosen Vertical
**Physical Event Experience (Sporting Event Experiences)**
We chose this vertical to solve real-world friction points at massive venues, specifically tackling congestion management, concession wait times, and emergency administration-to-attendee communication.

## 🧠 Approach and Logic
Our approach was to build a dual-interface architecture (an Attendee App and an Admin Dashboard) that communicates in real-time. The logic centers around:
- **Spatial Awareness:** Using dynamic heatmaps to direct attendees away from heavily congested areas.
- **Time Optimization:** Calculating and displaying real-time wait times for concessions to distribute attendee load.
- **Instant Communication:** Implementing a global push-notification network via WebSockets to alert users instantly of incidents, rather than relying on PA systems or static signs.

## ⚙️ How the Solution Works
The project consists of two beautifully designed, fully synchronized front-end applications powered by Google Firebase Realtime Database for state synchronization:

**1. Attendee Mobile Web App (PWA)** (`index.html`)
- **Interactive Stadium Map:** Features dynamically expanding heat-maps indicating foot traffic.
- **Smart Concessions Search:** Skip the line! Features live wait-time estimates and an instant real-time search filter for various food vendors.
- **Push Notification Hub:** Receive live alerts straight from the stadium administration over the internet, complete with intelligent "unread" badging and sweeping functionality.
- **Progressive Web App:** Fully installable to your smartphone's home screen with offline caching and native iOS/Android safe-area layout tuning.

**2. Venue Management Dashboard** (`admin.html`)
- **Responsive Command Center:** Now strictly responsive! Functions flawlessly across massive monitor walls down to pocket-sized mobile screens using a scrollable horizontal tab array system.
- **Dynamic Floor Planning:** Visually toggle the master map between Level 1, Level 2, or All to instantly isolate heat zones and selectively display relevant operational callouts.
- **Incident Stream:** A data-tracker feeding in simulated friction points (such as medical needs or overflowing trash).
- **Global Broadcast Console:** A functional tabbed dispatch panel that allows administration to compose and push custom alerts to all connected attendees instantly.

## 🚀 Live Access

Both applications are successfully built and hosted on the public internet via **GitHub Pages**. No local servers or installation are required!

*   **Mobile Attendee App:** [https://ujju2020.github.io/Physical-Event-Experience/index.html](https://ujju2020.github.io/Physical-Event-Experience/index.html)
*   **Admin Dashboard:** [https://ujju2020.github.io/Physical-Event-Experience/admin.html](https://ujju2020.github.io/Physical-Event-Experience/admin.html)

*Tip: Open the Mobile App on your phone and the Admin Dashboard on your laptop to experience true cross-device synchronization.*

## ⚡ Cloud Infrastructure

This application uses a fully serverless, real-time cloud architecture:
*   The system utilizes **Google Firebase Realtime Database**.
*   When an Admin dispatches an alert, the payload is authenticated and routed through Google Cloud.
*   The Attendee mobile app maintains a persistent WebSocket `onValue()` listener that immediately binds the incoming payload to the screen, sliding down a custom notification toast in milliseconds.

## 🛠️ Built With

- **HTML5 & Vanilla JS ES Modules:** No complex compilation steps required.
- **CSS3:** Premium deep-space aesthetic, glassmorphism UI components, and hardware-accelerated animations.
- **Firebase v12 JS SDK:** Cloud routing and real-time data synchronization.
- **Service Workers:** Providing PWA offline-caching support.

## 🔮 Next Steps (Roadmap)

To elevate this prototype to a full production system:
- Implement hardware API bindings to pull live turnstile or heat-sensor data onto the map instead of randomized mock data.
- Integrate Firebase Authentication to secure the Admin Dashboard behind an admin-only login screen.

## 🤔 Assumptions Made
- We assume the venue provides reliable public Wi-Fi for attendees to maintain the WebSocket connection.
- We assume attendees will actively use their smartphones during intervals to navigate the venue.
- Security and authentication implementations for the Admin dashboard were stubbed out for the scope of this hackathon to focus on realtime state sync UI/UX.
- Randomized data generation simulates actual venue foot-traffic API outputs.

---
---
*Built to transform chaos into coordination.*

---
*Copyright Information*
*Developer - Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)*

