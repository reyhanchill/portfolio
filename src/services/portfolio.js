import fallback from '../data/portfolio.json';
import { normalizeCollection, normalizeProfile } from './content';

const FIREBASE_READY = [
  process.env.REACT_APP_FIREBASE_API_KEY,
  process.env.REACT_APP_FIREBASE_PROJECT_ID,
  process.env.REACT_APP_FIREBASE_APP_ID,
].every(value => value && !/^your_/i.test(value));
const requests = new Map();

const fetchCollection = name => {
  if (!FIREBASE_READY) return Promise.resolve(null);
  if (!requests.has(name)) {
    requests.set(name, (async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        const snap = await getDocs(collection(db, name));
        const records = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        if (process.env.NODE_ENV === 'development' && records.some(record => record.schemaVersion !== fallback.schemaVersion)) {
          console.warn(`Portfolio: ${name} contains older content; publish schema version ${fallback.schemaVersion} to update it.`);
        }
        return records;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.warn(`Portfolio: using local ${name}.`, error.code || error.message);
        return null;
      }
    })());
  }
  return requests.get(name);
};

export const getProjects = () => fetchCollection('projects').then(data => normalizeCollection('projects', data));
export const getSkills = () => fetchCollection('skills').then(data => normalizeCollection('skills', data));
export const getStats = () => fetchCollection('stats').then(data => normalizeCollection('stats', data));
export const getProfile = () => fetchCollection('profile').then(data => normalizeProfile(data?.find(record => record.id === 'main')));
