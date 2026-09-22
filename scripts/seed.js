/** Publish only the four public portfolio collections. Never loosen client rules. */
const data = require('../src/data/portfolio.json');
const collectionNames = ['projects', 'skills', 'stats', 'profile'];

function desiredCollections(content) {
  if (!Number.isInteger(content.schemaVersion) || !content.profile?.name) throw new Error('Invalid portfolio schema or profile.');
  const result = { profile: [{ ...content.profile, id: 'main' }] };
  for (const name of collectionNames.filter(name => name !== 'profile')) {
    if (!Array.isArray(content[name]) || !content[name].length) throw new Error(`${name} must be a non-empty array.`);
    const ids = new Set();
    result[name] = content[name].map(record => {
      if (!record.id || typeof record.id !== 'string' || record.id.includes('/') || ids.has(record.id)) throw new Error(`Invalid or duplicate ID in ${name}.`);
      ids.add(record.id);
      if (name === 'projects' && (!record.title || !record.description || !Array.isArray(record.tech) || !record.tech.length)) throw new Error(`Incomplete project: ${record.id}`);
      if (name === 'skills' && (!record.category || !Array.isArray(record.items) || !record.items.length)) throw new Error(`Incomplete skills: ${record.id}`);
      if (name === 'stats' && (!record.label || !record.sub || !['database', 'code', 'graduation', 'briefcase'].includes(record.icon))) throw new Error(`Incomplete card: ${record.id}`);
      return record;
    });
  }
  return Object.fromEntries(collectionNames.map(name => [name, result[name].map(record => ({ ...record, schemaVersion: content.schemaVersion }))]));
}

function buildPlan(content, existing = {}) {
  const collections = desiredCollections(content);
  const operations = [];
  for (const name of collectionNames) {
    const ids = new Set(collections[name].map(record => record.id));
    for (const record of collections[name]) operations.push({ type: 'set', path: `${name}/${record.id}`, data: record });
    for (const id of existing[name] || []) if (!ids.has(id)) operations.push({ type: 'delete', path: `${name}/${id}` });
  }
  if (operations.length > 500) throw new Error('Too many operations for one atomic publication; nothing was written.');
  return operations;
}

async function seed() {
  require('dotenv').config({ quiet: true });
  const args = process.argv.slice(2);
  if (args.some(arg => !['--apply', '--check'].includes(arg))) throw new Error('Usage: node scripts/seed.js [--check | --apply]');
  if (args.includes('--check')) {
    console.log(`Content validated: ${buildPlan(data).length} records. No database connection or writes.`);
    return;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID;
  if (!projectId || /^your_/i.test(projectId)) throw new Error('Set FIREBASE_PROJECT_ID to the intended project.');
  const { initializeApp, applicationDefault, deleteApp } = require('firebase-admin/app');
  const { getFirestore } = require('firebase-admin/firestore');
  const credential = applicationDefault();
  // Fail before starting Firestore requests when administrative sign-in is missing.
  await credential.getAccessToken();
  const app = initializeApp({ credential, projectId });
  const db = getFirestore(app);
  try {
    const snapshots = await Promise.all(collectionNames.map(name => db.collection(name).get()));
    const existing = Object.fromEntries(snapshots.map((snapshot, i) => [collectionNames[i], snapshot.docs.map(doc => doc.id)]));
    const plan = buildPlan(data, existing);
    console.log(`Project: ${projectId}`);
    for (const operation of plan) console.log(`${operation.type.toUpperCase()} ${operation.path}`);
    if (!args.includes('--apply')) {
      console.log('Dry run only. Review the project and removals, then run npm run seed -- --apply to publish.');
      return;
    }
    const batch = db.batch();
    for (const operation of plan) {
      const ref = db.doc(operation.path);
      if (operation.type === 'delete') batch.delete(ref);
      else batch.set(ref, operation.data);
    }
    await batch.commit();
    console.log('Portfolio content published atomically. Refresh the site to load it.');
  } finally {
    await db.terminate();
    await deleteApp(app);
  }
}

if (require.main === module) seed().catch(error => {
  console.error(`Publish failed: ${error.message}`);
  console.error('Use authorised Application Default Credentials; keep browser writes denied. See README.md.');
  process.exitCode = 1;
});
module.exports = { buildPlan };
