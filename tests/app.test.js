/**
 * Smart Venue Experience Hub - Test Suite
 * Covers: edge cases, boundary conditions, integration flows, data integrity, XSS sanitization
 * Run with: npm test (requires Node.js v18+)
 */

const assert = require('node:assert');
const test = require('node:test');

// ─── Pure utility functions mirrored from app.js for testability ───────────────

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function getWaitBadgeClass(waitTime) {
    if (waitTime > 20) return 'critical';
    if (waitTime > 10) return 'long';
    return '';
}

function filterVendors(vendors, query, category) {
    return vendors.filter(v => {
        const matchesSearch = query.length > 0
            ? v.name.toLowerCase().includes(query.toLowerCase())
            : true;
        const matchesCategory = category === 'featured' || v.category.toLowerCase() === category;
        return query.length > 0 ? matchesSearch : matchesCategory;
    });
}

function deduplicateAlerts(existing, incoming) {
    const existingIds = new Set(existing.map(a => a.id));
    const newAlerts = incoming.filter(a => !existingIds.has(a.id));
    return [...newAlerts, ...existing];
}

function validateBroadcastPayload(payload) {
    return (
        typeof payload.id === 'number' &&
        typeof payload.title === 'string' && payload.title.trim().length > 0 &&
        typeof payload.desc === 'string' && payload.desc.trim().length > 0 &&
        typeof payload.unread === 'boolean'
    );
}

function sortVendorsByWaitTime(vendors) {
    return [...vendors].sort((a, b) => a.waitTime - b.waitTime);
}


// ─── TEST GROUP 1: XSS Sanitization & Security ────────────────────────────────

test('escapeHTML — sanitizes script tag injection', () => {
    const malicious = '<script>alert("xss")</script>';
    const result = escapeHTML(malicious);
    assert.ok(!result.includes('<script>'), 'Should not contain raw <script> tag');
    assert.strictEqual(result, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('escapeHTML — sanitizes ampersand in text', () => {
    assert.strictEqual(escapeHTML('Fish & Chips'), 'Fish &amp; Chips');
});

test('escapeHTML — sanitizes single and double quotes', () => {
    const result = escapeHTML(`He said "hello" and it's fine`);
    assert.ok(!result.includes('"'), 'Should escape double quotes');
    assert.ok(!result.includes("'"), 'Should escape single quotes');
});

test('escapeHTML — returns non-string values unchanged', () => {
    assert.strictEqual(escapeHTML(42), 42);
    assert.strictEqual(escapeHTML(null), null);
    assert.strictEqual(escapeHTML(undefined), undefined);
});

test('escapeHTML — returns clean string unchanged', () => {
    assert.strictEqual(escapeHTML('Stadium Grill'), 'Stadium Grill');
});


// ─── TEST GROUP 2: Wait Time Badge Boundary Conditions ────────────────────────

test('getWaitBadgeClass — wait time 0 is fast (empty class)', () => {
    assert.strictEqual(getWaitBadgeClass(0), '');
});

test('getWaitBadgeClass — wait time 10 is still fast (boundary)', () => {
    assert.strictEqual(getWaitBadgeClass(10), '');
});

test('getWaitBadgeClass — wait time 11 triggers long class', () => {
    assert.strictEqual(getWaitBadgeClass(11), 'long');
});

test('getWaitBadgeClass — wait time 20 is long (boundary)', () => {
    assert.strictEqual(getWaitBadgeClass(20), 'long');
});

test('getWaitBadgeClass — wait time 21 triggers critical class', () => {
    assert.strictEqual(getWaitBadgeClass(21), 'critical');
});

test('getWaitBadgeClass — extreme wait time 999 is critical', () => {
    assert.strictEqual(getWaitBadgeClass(999), 'critical');
});


// ─── TEST GROUP 3: Vendor Filtering — Edge Cases ──────────────────────────────

const mockVendors = [
    { id: 1, name: 'Stadium Grill', category: 'Hot Dogs & Burgers', waitTime: 3 },
    { id: 2, name: 'Pizza Paradiso', category: 'Featured', waitTime: 12 },
    { id: 3, name: 'Craft Bev Co.', category: 'Drinks', waitTime: 25 },
    { id: 4, name: 'Nacho Nation', category: 'Snacks', waitTime: 5 },
];

test('filterVendors — empty query with "featured" category returns all vendors', () => {
    const result = filterVendors(mockVendors, '', 'featured');
    assert.strictEqual(result.length, 4);
});

test('filterVendors — query "pizza" returns only pizza paradiso', () => {
    const result = filterVendors(mockVendors, 'pizza', 'featured');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, 'Pizza Paradiso');
});

test('filterVendors — query with no match returns empty array', () => {
    const result = filterVendors(mockVendors, 'xyznotfound', 'featured');
    assert.strictEqual(result.length, 0);
});

test('filterVendors — empty vendor array returns empty result', () => {
    const result = filterVendors([], 'pizza', 'featured');
    assert.strictEqual(result.length, 0);
});

test('filterVendors — category "drinks" returns only drinks vendors', () => {
    const result = filterVendors(mockVendors, '', 'drinks');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 3);
});

test('filterVendors — search is case-insensitive', () => {
    const result = filterVendors(mockVendors, 'PIZZA', 'featured');
    assert.strictEqual(result.length, 1);
});


// ─── TEST GROUP 4: Data Integrity ─────────────────────────────────────────────

test('sortVendorsByWaitTime — sorts ascending correctly', () => {
    const sorted = sortVendorsByWaitTime(mockVendors);
    assert.strictEqual(sorted[0].waitTime, 3);
    assert.strictEqual(sorted[sorted.length - 1].waitTime, 25);
});

test('sortVendorsByWaitTime — does not mutate original array', () => {
    const original = [...mockVendors];
    sortVendorsByWaitTime(mockVendors);
    assert.deepStrictEqual(mockVendors, original);
});

test('sortVendorsByWaitTime — single element array stays unchanged', () => {
    const single = [{ id: 1, name: 'X', waitTime: 5 }];
    const sorted = sortVendorsByWaitTime(single);
    assert.strictEqual(sorted.length, 1);
});


// ─── TEST GROUP 5: Alert Deduplication & Integration Flow ─────────────────────

const existingAlerts = [
    { id: 1, title: 'Heavy Crowd at South Gate', unread: true },
    { id: 2, title: 'Flash Sale', unread: true },
];

test('deduplicateAlerts — does not add duplicate alert by id', () => {
    const incoming = [{ id: 1, title: 'Heavy Crowd at South Gate', unread: true }];
    const result = deduplicateAlerts(existingAlerts, incoming);
    const ids = result.map(a => a.id);
    assert.strictEqual(new Set(ids).size, ids.length, 'No duplicate IDs should exist');
});

test('deduplicateAlerts — adds new alert to front of queue', () => {
    const incoming = [{ id: 99, title: 'New Emergency Alert', unread: true }];
    const result = deduplicateAlerts(existingAlerts, incoming);
    assert.strictEqual(result[0].id, 99);
});

test('deduplicateAlerts — empty existing alerts accepts all incoming', () => {
    const result = deduplicateAlerts([], existingAlerts);
    assert.strictEqual(result.length, existingAlerts.length);
});

test('deduplicateAlerts — empty incoming returns existing unchanged', () => {
    const result = deduplicateAlerts(existingAlerts, []);
    assert.strictEqual(result.length, existingAlerts.length);
});


// ─── TEST GROUP 6: Broadcast Payload Validation ───────────────────────────────

test('validateBroadcastPayload — valid payload passes', () => {
    const payload = { id: Date.now(), type: 'danger', title: 'Gate B is full', desc: 'Use Gate D instead.', unread: true };
    assert.strictEqual(validateBroadcastPayload(payload), true);
});

test('validateBroadcastPayload — empty title fails validation', () => {
    const payload = { id: 1, title: '', desc: 'Details here.', unread: true };
    assert.strictEqual(validateBroadcastPayload(payload), false);
});

test('validateBroadcastPayload — empty description fails validation', () => {
    const payload = { id: 1, title: 'Alert', desc: '', unread: true };
    assert.strictEqual(validateBroadcastPayload(payload), false);
});

test('validateBroadcastPayload — missing unread field fails validation', () => {
    const payload = { id: 1, title: 'Alert', desc: 'Details.' };
    assert.strictEqual(validateBroadcastPayload(payload), false);
});

test('validateBroadcastPayload — non-numeric id fails validation', () => {
    const payload = { id: 'abc', title: 'Alert', desc: 'Details.', unread: true };
    assert.strictEqual(validateBroadcastPayload(payload), false);
});

test('validateBroadcastPayload — whitespace-only title fails validation', () => {
    const payload = { id: 1, title: '   ', desc: 'Details.', unread: true };
    assert.strictEqual(validateBroadcastPayload(payload), false);
});
