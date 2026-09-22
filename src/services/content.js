import fallback from '../data/portfolio.json';

const text = value => typeof value === 'string' ? value.trim() : '';
const strings = value => Array.isArray(value) ? value.map(text).filter(Boolean) : [];
const email = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value)) ? text(value) : '';

export function safeUrl(value, local = false) {
  const candidate = text(value);
  if (!candidate || /YOUR_|PLACEHOLDER/i.test(candidate)) return '';
  if (local && /^\/(?!\/)[^\\]*$/.test(candidate)) return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

function sourceUrl(value) {
  const url = safeUrl(value);
  if (!url) return '';
  const parsed = new URL(url);
  if (parsed.hostname === 'github.com' && parsed.pathname.split('/').filter(Boolean).length < 2) return '';
  return url;
}

export function normalizeProfile(record) {
  const base = fallback.profile;
  if (!record || typeof record !== 'object') return base;
  // Legacy profiles can retain a valid CV, but cannot restore retired positioning.
  if (record.schemaVersion !== fallback.schemaVersion) {
    return { ...base, resume: safeUrl(record.resume) || base.resume };
  }
  return {
    name: text(record.name) || base.name,
    role: text(record.role) || base.role,
    bio: text(record.bio) || base.bio,
    location: text(record.location) || base.location,
    availability: text(record.availability) || base.availability,
    email: email(record.email) || base.email,
    github: safeUrl(record.github) || base.github,
    linkedin: safeUrl(record.linkedin) || base.linkedin,
    resume: safeUrl(record.resume),
    // The deployed origin belongs to the build, not editable database content.
    website: base.website,
  };
}

export function normalizeCollection(name, records) {
  const defaults = fallback[name] || [];
  if (!Array.isArray(records) || records.length === 0) return defaults;
  const seen = new Set();
  const normalized = records.flatMap(record => {
    if (!record || record.schemaVersion !== fallback.schemaVersion) return [];
    const id = text(record.id);
    if (!id || seen.has(id)) return [];
    const common = { id, pos: Number.isFinite(record.pos) ? record.pos : 0 };
    let item;
    if (name === 'projects') {
      const title = text(record.title);
      const description = text(record.description) || text(record.fullDescription);
      const tech = strings(record.tech);
      if (!title || !description || !tech.length) return [];
      item = { ...common, title, description, tech,
        fullDescription: text(record.fullDescription),
        type: text(record.type) || 'PROJECT',
        status: ['ACTIVE', 'SHIPPED', 'PAUSED'].includes(record.status) ? record.status : '',
        images: strings(record.images).map(url => safeUrl(url, true)).filter(Boolean),
        link: sourceUrl(record.link), live: safeUrl(record.live),
        keyFeatures: strings(record.keyFeatures),
      };
    } else if (name === 'skills') {
      const category = text(record.category);
      const items = strings(record.items);
      if (!category || !items.length) return [];
      item = { ...common, category, items };
    } else if (name === 'stats') {
      if (!['database', 'code', 'graduation', 'briefcase'].includes(record.icon) || !text(record.label) || !text(record.sub)) return [];
      item = { ...common, icon: record.icon, label: text(record.label), sub: text(record.sub), highlight: record.highlight === true };
    }
    if (!item) return [];
    seen.add(id);
    return [item];
  });
  return normalized.length ? normalized.sort((a, b) => a.pos - b.pos || a.id.localeCompare(b.id)) : defaults;
}
