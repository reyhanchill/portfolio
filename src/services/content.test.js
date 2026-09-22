/* eslint-disable no-script-url -- These malicious URLs are deliberate validation fixtures. */
import fallback from '../data/portfolio.json';
import { normalizeCollection, normalizeProfile, safeUrl } from './content';

const remote = (record, changes = {}) => ({ ...record, schemaVersion: fallback.schemaVersion, ...changes });

test('failed, empty, legacy and malformed content retain usable fallback data', () => {
  for (const name of ['projects', 'skills', 'stats']) {
    for (const input of [null, [], [null], fallback[name], [{ id: 'bad', schemaVersion: 2 }]]) {
      expect(normalizeCollection(name, input)).toEqual(fallback[name]);
    }
  }
});

test('malformed optional fields and unsafe project links cannot reach rendering', () => {
  const input = remote(fallback.projects[0], { images: ['javascript:alert(1)', '/images/site.png'], keyFeatures: null, link: 'https://github.com/reyhanchill', live: 'javascript:alert(1)' });
  const [project] = normalizeCollection('projects', [input]);
  expect(project.images).toEqual(['/images/site.png']);
  expect(project.keyFeatures).toEqual([]);
  expect(project.link).toBe('');
  expect(project.live).toBe('');
});

test('valid remote records are sorted, deduplicated, and kept while broken records are excluded', () => {
  const second = remote(fallback.projects[1], { pos: 9 });
  const first = remote(fallback.projects[0], { pos: 1 });
  const result = normalizeCollection('projects', [second, null, first, first, { id: 'bad', schemaVersion: 2 }]);
  expect(result.map(project => project.id)).toEqual([first.id, second.id]);
});

test('invalid array fields cannot crash project or skills rendering', () => {
  expect(normalizeCollection('projects', [remote(fallback.projects[0], { tech: {} })])).toEqual(fallback.projects);
  expect(normalizeCollection('skills', [remote(fallback.skills[0], { items: 'not an array' })])).toEqual(fallback.skills);
});

test('legacy profiles cannot restore old positioning, but keep a real CV link', () => {
  const profile = normalizeProfile({ role: 'Full Stack Developer', resume: 'https://example.com/cv.pdf' });
  expect(profile.role).toBe('Software Engineer');
  expect(profile.resume).toBe('https://example.com/cv.pdf');
});

test('profile fields fall back individually and the canonical origin stays local', () => {
  const profile = normalizeProfile(remote(fallback.profile, { name: {}, email: 'invalid', github: 'javascript:alert(1)', website: 'https://wrong.example', resume: 'https://drive.google.com/file/d/YOUR_CV_FILE_ID/view', bio: 'Updated bio' }));
  expect(profile.name).toBe(fallback.profile.name);
  expect(profile.email).toBe(fallback.profile.email);
  expect(profile.github).toBe(fallback.profile.github);
  expect(profile.website).toBe(fallback.profile.website);
  expect(profile.resume).toBe('');
  expect(profile.bio).toBe('Updated bio');
});

test('only explicit HTTPS and allowed local image URLs are accepted', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//example.com', 'https://user:password@example.com', 'http://example.com', '/\\example.com', {}]) {
    expect(safeUrl(value, true)).toBe('');
  }
  expect(safeUrl('/images/project.png', true)).toBe('/images/project.png');
  expect(safeUrl('https://example.com/repo')).toBe('https://example.com/repo');
});
