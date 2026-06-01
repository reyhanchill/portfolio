/**
 * Seed script — run anytime you add/update content in portfolio.json
 * Usage: node scripts/seed.js
 *
 * To add a new project:  add to "projects" array in portfolio.json, then run this
 * To add a new skill:    add to "skills" array in portfolio.json, then run this
 * To update a stat card: edit "stats" array in portfolio.json, then run this
 */
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, setDoc, doc, collection } = require('firebase/firestore');
const data = require('../src/data/portfolio.json');

const app = initializeApp({
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
});

const db = getFirestore(app);

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Projects
  for (const project of data.projects) {
    await setDoc(doc(collection(db, 'projects'), project.id), project);
    console.log(`  ✓ Project: ${project.title}`);
  }

  // Skills
  for (const skill of data.skills) {
    await setDoc(doc(collection(db, 'skills'), skill.id), skill);
    console.log(`  ✓ Skill:   ${skill.category}`);
  }

  // Stats
  for (const stat of data.stats) {
    await setDoc(doc(collection(db, 'stats'), stat.id), stat);
    console.log(`  ✓ Stat:    ${stat.label}`);
  }

  // Profile
  await setDoc(doc(collection(db, 'profile'), 'main'), data.profile);
  console.log(`  ✓ Profile: ${data.profile.name}`);

  console.log('\n✅ Done. Firebase is up to date.');
  console.log('\nTo add more in future:');
  console.log('  • New project  → add to portfolio.json "projects" array with a new id (e.g. "p5")');
  console.log('  • New skill    → add to portfolio.json "skills" array with a new id (e.g. "sk5")');
  console.log('  • Then run:      node scripts/seed.js\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  console.error('   Make sure Firestore rules allow writes (temporarily set allow write: if true)');
  process.exit(1);
});
