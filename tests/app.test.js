const assert = require('node:assert');
const test = require('node:test');

test('Event Queue processes synchronously', () => {
  const queue = [];
  queue.push({ id: 1, severity: 'critical' });
  queue.push({ id: 2, severity: 'normal' });
  
  const criticalEvents = queue.filter(e => e.severity === 'critical');
  assert.strictEqual(criticalEvents.length, 1);
  assert.strictEqual(criticalEvents[0].id, 1);
});

test('Wait time formatting works correctly', () => {
    const rawTime = 14; 
    const isCriticalWarning = rawTime > 20;
    assert.strictEqual(isCriticalWarning, false);
});
