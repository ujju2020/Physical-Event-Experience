// Mock Data
const MOCK_DATA = {
    vendors: [
        { id: 1, name: "Stadium Grill", category: "Hot Dogs & Burgers", waitTime: 3, distance: "120ft", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", status: "fast" },
        { id: 2, name: "Pizza Paradiso", category: "Featured", waitTime: 12, distance: "300ft", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", status: "med" },
        { id: 3, name: "Craft Bev Co.", category: "Drinks", waitTime: 25, distance: "150ft", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", status: "slow" },
        { id: 4, name: "Nacho Nation", category: "Snacks", waitTime: 5, distance: "400ft", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", status: "fast" }
    ],
    alerts: [
        { id: 1, type: "danger", title: "Heavy Crowd at South Gate", desc: "Please use the East Gate for faster exiting post-game.", time: "Just now", unread: true },
        { id: 2, type: "promo", title: "Flash Sale - 25% Off Merch", desc: "Present this notification at the main store in the next 30 minutes.", time: "15 mins ago", unread: true },
        { id: 3, type: "info", title: "Game starting in 15 minutes", desc: "Make your way to your seats shortly. Enjoy the game!", time: "1 hr ago", unread: false }
    ]
};

// Safe LocalStorage wrapper to prevent crashes on strict file:// browsers
function getSafeLocalAlerts() {
    try {
        return JSON.parse(localStorage.getItem('venue_alerts') || '[]');
    } catch(e) {
        console.warn("LocalStorage blocked by browser for local files.");
        return [];
    }
}

// Sync alerts from localStorage before initializing
let localAlerts = getSafeLocalAlerts();
MOCK_DATA.alerts = [...localAlerts, ...MOCK_DATA.alerts];
let knownAlertsCount = localAlerts.length;

function initIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch(e) {}
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    initIcons();

    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-item');

    // Rendering functions
    const renderMapTab = () => {
        const template = document.getElementById('map-view-template');
        mainContent.innerHTML = '';
        mainContent.appendChild(template.content.cloneNode(true));
        
        // Setup Map Interactions after render
        initIcons();
    };

    const renderFoodTab = () => {
        const template = document.getElementById('food-view-template');
        mainContent.innerHTML = '';
        mainContent.appendChild(template.content.cloneNode(true));
        
        const container = mainContent.querySelector('.concession-list');
        
        MOCK_DATA.vendors.forEach(vendor => {
            if (!vendor) return;
            let badgeClass = '';
            let badgeIcon = 'zap';
            if (vendor.waitTime > 10) { badgeClass = 'long'; badgeIcon = 'clock'; }
            if (vendor.waitTime > 20) { badgeClass = 'critical'; badgeIcon = 'alert-triangle'; }

            const cardHtml = `
                <div class="vendor-card glass-panel">
                    <img src="${vendor.image}" alt="${vendor.name}" class="vendor-img">
                    <div class="vendor-info">
                        <h3 class="vendor-name">${vendor.name}</h3>
                        <div class="vendor-meta">
                            <span><i data-lucide="map-pin" style="width:12px"></i> ${vendor.distance}</span>
                            <div class="wait-badge ${badgeClass}">
                                <i data-lucide="${badgeIcon}" style="width:12px"></i> ${vendor.waitTime}m wait
                            </div>
                        </div>
                        <button class="order-btn" onclick="alert('Mock Order Placed for ${vendor.name}!')">Order for Pickup</button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

        initIcons();
    };

    const renderAlertsTab = () => {
        const template = document.getElementById('alerts-view-template');
        mainContent.innerHTML = '';
        mainContent.appendChild(template.content.cloneNode(true));
        
        const container = mainContent.querySelector('.alerts-list');
        
        MOCK_DATA.alerts.forEach(alert => {
            if (!alert) return;
            let iconText = 'info';
            if (alert.type === 'danger') iconText = 'alert-circle';
            if (alert.type === 'promo') iconText = 'tag';

            const cardHtml = `
                <div class="alert-card glass-panel">
                    ${alert.unread ? '<div class="unread-dot"></div>' : ''}
                    <div class="alert-icon ${alert.type}">
                        <i data-lucide="${iconText}"></i>
                    </div>
                    <div class="alert-content">
                        <h4>${alert.title}</h4>
                        <p>${alert.desc}</p>
                        <span class="alert-time">${alert.time}</span>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

        initIcons();
    };

    const renderEmptyTab = (name) => {
        mainContent.innerHTML = `
            <div class="view-section animate-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding: 40px 20px;">
                <i data-lucide="calendar" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                <h2 style="margin-bottom: 8px;">${name}</h2>
                <p style="color: var(--text-secondary);">This feature is coming soon.</p>
            </div>
        `;
        initIcons();
    }

    // Navigation logic
    const switchTab = (tabId) => {
        // Update nav UI
        navButtons.forEach(btn => {
            if(btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Render content
        switch(tabId) {
            case 'map': renderMapTab(); break;
            case 'food': renderFoodTab(); break;
            case 'alerts': renderAlertsTab(); break;
            default: renderEmptyTab(tabId.charAt(0).toUpperCase() + tabId.slice(1));
        }
    };

    // Attach click listeners to nav buttons
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Default load
    switchTab('map');
    
    // Polling LocalStorage for updates (Bypasses file:// protocol 'storage' event restrictions!)
    setInterval(() => {
        try {
            const currentAlertsRaw = localStorage.getItem('venue_alerts');
            if (currentAlertsRaw) {
                const currentAlerts = JSON.parse(currentAlertsRaw);
                if (currentAlerts.length > knownAlertsCount) {
                    const newCount = currentAlerts.length - knownAlertsCount;
                    
                    // Process the newly added alerts
                    for (let i = newCount - 1; i >= 0; i--) {
                        const newestAlert = currentAlerts[i];
                        
                        if (!MOCK_DATA.alerts.find(a => a.id === newestAlert.id)) {
                            MOCK_DATA.alerts.unshift(newestAlert);
                        }
                        
                        showPushNotification(newestAlert);
                    }
                    
                    knownAlertsCount = currentAlerts.length;

                    // Update notification badge
                    const badge = document.querySelector('.notification-badge');
                    if (badge) { badge.innerText = parseInt(badge.innerText) + newCount; }
                    
                    // Refresh alerts tab if it's currently open
                    const activeTab = document.querySelector('.nav-item.active').dataset.tab;
                    if (activeTab === 'alerts') {
                        renderAlertsTab();
                    }
                } else if (currentAlerts.length < knownAlertsCount) {
                    knownAlertsCount = currentAlerts.length; // Handle clears
                }
            }
        } catch(e) {
            // Silently fail if localStorage is blocked
        }
    }, 1000); // Check every 1 second


    function showPushNotification(alert) {
        // Prevent stacking too many toasts visually, simple replace
        const existing = document.getElementById('attendee-push-toast');
        if(existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'attendee-push-toast';
        toast.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.95);
            color: white;
            padding: 16px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 1000;
            backdrop-filter: blur(10px);
            display: flex;
            gap: 12px;
            align-items: center;
            animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            cursor: pointer;
        `;
        toast.innerHTML = `
            <i data-lucide="alert-triangle" style="width: 24px; height: 24px;"></i>
            <div>
                <strong style="display:block; font-size:1rem;">ADMIN ALERT</strong>
                <span style="font-size:0.85rem;">${alert.title}</span>
            </div>
        `;
        
        // Let user tap to jump to alerts
        toast.addEventListener('click', () => {
            switchTab('alerts');
            toast.remove();
        });

        document.querySelector('.app-container').appendChild(toast);
        initIcons();

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if(toast.parentElement) {
                toast.style.animation = 'none'; // reset
                toast.style.transform = 'translateY(-20px)';
                toast.style.opacity = '0';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    // Include the slideDown keyframe globally on first inject
    if (!document.getElementById('push-anim')) {
        const style = document.createElement('style');
        style.id = 'push-anim';
        style.innerHTML = `
            @keyframes slideDownFade {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Animate map zones slightly to give a "live" feel
    setInterval(() => {
        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
           const currentOpacity = parseFloat(window.getComputedStyle(zone).opacity);
           const change = (Math.random() - 0.5) * 0.2;
           let newOpacity = currentOpacity + change;
           newOpacity = Math.max(0.3, Math.min(newOpacity, 0.8)); // constrain between 0.3 and 0.8
           zone.style.opacity = newOpacity;
        });
    }, 2000);
});
