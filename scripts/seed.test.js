const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPlan } = require('./seed');
const content = require('../src/data/portfolio.json');

test('publishing removes stale records only from portfolio collections', () => {
  const plan = buildPlan(content, { projects: ['p1', 'removed'], profile: ['main', 'old'], private: ['untouched'] });
  assert.deepEqual(plan.filter(op => op.type === 'delete').map(op => op.path), ['projects/removed', 'profile/old']);
  assert.ok(plan.every(op => !op.path.startsWith('private/')));
  assert.ok(plan.filter(op => op.type === 'set').every(op => op.data.schemaVersion === 2));
});
test('duplicate IDs stop publication before any write', () => {
  assert.throws(() => buildPlan({ ...content, projects: [content.projects[0], content.projects[0]] }), /duplicate/);
});
test('invalid content stops publication', () => {
  assert.throws(() => buildPlan({ ...content, skills: [] }), /non-empty/);
  assert.throws(() => buildPlan({ ...content, stats: [{ id: 's1', icon: 'unknown' }] }), /Incomplete card/);
});
test('oversized plans cannot result in partial multi-batch publication', () => {
  assert.throws(() => buildPlan(content, { projects: Array.from({ length: 500 }, (_, i) => `old-${i}`) }), /atomic/);
});
