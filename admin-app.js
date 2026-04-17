/* 
 * Copyright Information
 * Developer - Ujjwal Kumar Bhowmick (ujjwalkumarbhowmick30@gmail.com)
 */
// Admin Dashboard Logic
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrtwJM1x92S98RNudD_KYjmP__I_oyaVI",
    authDomain: "integral-hybrid-493515-b6.firebaseapp.com",
    databaseURL: "https://integral-hybrid-493515-b6-default-rtdb.firebaseio.com",
    projectId: "integral-hybrid-493515-b6",
    storageBucket: "integral-hybrid-493515-b6.firebasestorage.app",
    messagingSenderId: "370112329381",
    appId: "1:370112329381:web:3b17f71093236f8001ff4c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ADMIN_DATA = {
    metrics: [
        { id: 1, name: "Avg Restroom Wait", value: "3.2m", icon: "refresh-cw", color: "text-blue" },
        { id: 2, name: "Avg Food Wait", value: "12m", icon: "clock", color: "text-orange" },
        { id: 3, name: "Active Staff", value: "244", icon: "shield-check", color: "text-primary" }
    ],
    incidents: [
        { id: 101, title: "Bottleneck at South Gate", desc: "Density exceeding recommended limits. Dispatched Team Alpha for rerouting.", time: "15:22:04", severity: "critical" },
        { id: 102, title: "Restroom C supplies low", desc: "Maintenance requested for resupply.", time: "15:10:14", severity: "normal" },
        { id: 103, title: "East Concourse Flow Heavy", desc: "Traffic moving slow but steady. Monitoring closely.", time: "14:45:00", severity: "warning" },
        { id: 104, title: "Gate D Scanner Error", desc: "Scanner 4 offline, tech deployed.", time: "14:12:00", severity: "normal" }
    ]
};

function initIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) { }
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Render Metrics
    const metricsContainer = document.getElementById('metrics-container');
    ADMIN_DATA.metrics.forEach(metric => {
        metricsContainer.innerHTML += `
            <div class="metric-row">
                <div class="metric-info">
                    <div class="metric-icon">
                        <i data-lucide="${metric.icon}" class="${metric.color}"></i>
                    </div>
                    <span class="metric-name">${metric.name}</span>
                </div>
                <span class="metric-num">${metric.value}</span>
            </div>
        `;
    });

    // Render Incidents
    const incidentsContainer = document.getElementById('incidents-container');
    ADMIN_DATA.incidents.forEach(inc => {
        let sc = '';
        if (inc.severity === 'critical') sc = 'critical';

        incidentsContainer.innerHTML += `
            <div class="incident-card ${sc}">
                <div class="inc-header">
                    <span class="inc-title">${inc.title}</span>
                    <span class="inc-time">${inc.time}</span>
                </div>
                <p class="inc-desc">${inc.desc}</p>
            </div>
        `;
    });

    // Sidebar Interactivity
    const overviewPanels = ['.main-map', '.live-metrics', '.incident-stream'];
    const broadcastPanel = document.querySelector('.broadcast-panel');
    
    // Hide Broadcast initially
    broadcastPanel.classList.add('tab-hidden');

    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sidebar-nav .nav-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const title = e.currentTarget.innerText.trim();
            const pageTitle = document.querySelector('.page-title');

            if (title === 'Broadcast') {
                // Hide Overview Panels
                overviewPanels.forEach(selector => document.querySelector(selector).classList.add('tab-hidden'));
                
                // Show Broadcast Panel
                broadcastPanel.classList.remove('tab-hidden');
                broadcastPanel.style.gridColumn = '1 / -1'; // stretch across full width
                pageTitle.innerText = 'Broadcast Operations';

                document.querySelector('.broadcast-form .form-input').focus();
            } else if (title === 'Overview') {
                // Show Overview Panels
                overviewPanels.forEach(selector => document.querySelector(selector).classList.remove('tab-hidden'));
                
                // Hide Broadcast Panel
                broadcastPanel.classList.add('tab-hidden');
                pageTitle.innerText = 'Live Overview';
            } else if (title === 'Crowd Flow' || title === 'Staff Dispatch') {
                alert(`${title} module is coming soon in the next update!`);
                
                // Revert to overview (simulate a bounce-back)
                setTimeout(() => {
                    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(b => b.classList.remove('active'));
                    document.querySelector('.sidebar-nav .nav-btn:first-child').classList.add('active');
                }, 100);
            }
        });
    });

    lucide.createIcons(); // re-init icons

    // Venue Map Controls
    const mapControls = document.querySelectorAll('.main-map .ctrl-btn');
    const zones = document.querySelectorAll('.stadium-graphic .zone');
    const callouts = document.querySelectorAll('.stadium-graphic .map-callout');
    
    mapControls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            mapControls.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const level = e.currentTarget.innerText.trim();
            
            zones.forEach(zone => {
                if (level === 'All') {
                    zone.classList.remove('hidden-zone');
                } else if (level === 'Level 1') {
                    // Mock: Level 1 shows only East/West concourse
                    if (zone.classList.contains('zone-n') || zone.classList.contains('zone-s')) {
                        zone.classList.add('hidden-zone');
                    } else {
                        zone.classList.remove('hidden-zone');
                    }
                } else if (level === 'Level 2') {
                    // Mock: Level 2 shows only North/South gates
                    if (zone.classList.contains('zone-e') || zone.classList.contains('zone-w')) {
                        zone.classList.add('hidden-zone');
                    } else {
                        zone.classList.remove('hidden-zone');
                    }
                }
            });

            callouts.forEach(callout => {
                // The current mock callout is for the South Gate (Level 2), so hide on Level 1
                if (level === 'Level 1') {
                    callout.classList.add('hidden-zone');
                    callout.style.transition = 'opacity 0.3s ease';
                } else {
                    callout.classList.remove('hidden-zone');
                }
            });
        });
    });

    // Simulate map pulsing
    setInterval(() => {
        const zoneS = document.getElementById('zone-s-admin');
        if (zoneS) {
            const currentOpacity = parseFloat(window.getComputedStyle(zoneS).opacity);
            const change = (Math.random() - 0.5) * 0.1;
            let newOpacity = currentOpacity + change;
            newOpacity = Math.max(0.6, Math.min(newOpacity, 0.9)); // South gate stays hot
            zoneS.style.opacity = newOpacity;
        }
    }, 1500);
});

// Toast functionality for the broadcast form
window.showBroadcastSuccess = async function () {
    // 1. Capture Form Data
    const titleInput = document.querySelector('.broadcast-form input[type="text"]');
    const descInput = document.querySelector('.broadcast-form textarea');

    const newAlert = {
        id: Date.now(),
        type: "danger", // Emphasize admin broadcasts
        title: titleInput.value,
        desc: descInput.value,
        time: "Just now",
        unread: true
    };

    // 2. Save to Firebase Realtime Database
    try {
        const alertsRef = ref(db, 'venue_alerts');
        const newAlertRef = push(alertsRef);
        await set(newAlertRef, newAlert);
    } catch (e) {
        console.error('Firebase push failed. Check Database Rules.', e);
    }

    // 3. Show Success Toast locally
    const container = document.getElementById('toast-container');
    const toastHtml = document.createElement('div');
    toastHtml.className = 'toast';
    toastHtml.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Alert broadcasted successfully to attendee mobile devices.</span>
    `;

    container.appendChild(toastHtml);

    // Reset form
    document.getElementById('broadcast-form').reset();

    // Remove toast after 4 seconds
    setTimeout(() => {
        toastHtml.style.opacity = '0';
        toastHtml.style.transform = 'translateX(100%)';
        toastHtml.style.transition = 'all 0.3s ease';
        setTimeout(() => toastHtml.remove(), 300);
    }, 4000);
}
