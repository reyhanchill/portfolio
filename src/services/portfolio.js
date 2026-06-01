import fallback from '../data/portfolio.json';

const FIREBASE_READY = !!(
  process.env.REACT_APP_FIREBASE_PROJECT_ID &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID !== 'your_project_id'
);

const fetchCollection = async (name) => {
  if (!FIREBASE_READY) return null;
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');
    const snap = await getDocs(collection(db, name));
    if (snap.empty) return null;
    return snap.docs
      .map(d => d.data())
      .sort((a, b) => (a.pos ?? 0) - (b.pos ?? 0));
  } catch {
    return null;
  }
};

export const getProjects = () => fetchCollection('projects').then(d => d ?? fallback.projects);
export const getSkills   = () => fetchCollection('skills').then(d => d ?? fallback.skills);
export const getStats    = () => fetchCollection('stats').then(d => d ?? fallback.stats);
export const getProfile  = () => fetchCollection('profile').then(d => d?.[0] ?? fallback.profile);
