import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '../services/portfolio';
import fallback from '../data/portfolio.json';

// ── Generic stroke icons (16px grid) — not brand logos, just legible category glyphs ──
const IconCode = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3.5 1.5 8 5 12.5M11 3.5 14.5 8 11 12.5" /></svg>
);
const IconOrbit = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /><ellipse cx="8" cy="8" rx="6.5" ry="2.6" /><ellipse cx="8" cy="8" rx="6.5" ry="2.6" transform="rotate(60 8 8)" /><ellipse cx="8" cy="8" rx="6.5" ry="2.6" transform="rotate(120 8 8)" /></svg>
);
const IconHex = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M8 1.3 14 4.8v6.4L8 14.7 2 11.2V4.8z" /></svg>
);
const IconDb = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="8" cy="3.4" rx="5.5" ry="2" /><path d="M2.5 3.4v9.2c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2V3.4" /><path d="M2.5 8c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2" /></svg>
);
const IconTool = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.6 2.9a3 3 0 0 0-3.9 3.9L2 11.5V14h2.5l4.7-4.7a3 3 0 0 0 3.9-3.9l-2.1 2.1-1.9-.5-.5-1.9 2-2z" /></svg>
);
const IconShield = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1.5 13.5 3.5V7.5C13.5 11 11.2 13.3 8 14.5C4.8 13.3 2.5 11 2.5 7.5V3.5z" /><path d="M5.7 8 7.3 9.6 10.4 6.3" /></svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M8 1.8 14 5 8 8.2 2 5z" /><path d="m2 8 6 3.2L14 8" /><path d="m2 11 6 3.2L14 11" /></svg>
);

const ICON_RULES = [
  [/react|next\.?js|framer|router/i, IconOrbit],
  [/mongo|postgres|mysql|redis|firebase|prisma|sql/i, IconDb],
  [/git|docker|aws|cloud|ci\/?cd/i, IconTool],
  [/auth|jwt|bcrypt|zod|security/i, IconShield],
  [/node|express|django|python|webpack|jest|api/i, IconHex],
  [/css|tailwind|html|design/i, IconLayers],
];
const iconFor = (tech) => {
  const hit = ICON_RULES.find(([re]) => re.test(tech));
  return hit ? hit[1] : IconCode;
};

const IconGithub = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12 24 5.37 18.63 0 12 0z" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 3.5h6v6M12.5 3.5 3.5 12.5" /></svg>
);

// Live site preview — scaled iframe with fallback
const LivePreview = ({ url, title }) => {
  const [blocked, setBlocked] = useState(false);
  if (blocked) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="proj-media-blocked">
        <span className="proj-media-blocked-icon">◻</span>
        <span className="proj-media-blocked-text">PREVIEW BLOCKED</span>
        <span className="proj-media-blocked-link">OPEN SITE <IconExternal /></span>
      </a>
    );
  }
  return (
    <div className="proj-media-inner">
      <iframe
        src={url}
        title={`${title} live preview`}
        className="proj-media-iframe"
        sandbox="allow-scripts allow-same-origin"
        onError={() => setBlocked(true)}
      />
      <a href={url} target="_blank" rel="noopener noreferrer" className="proj-media-hover" title={`Open ${title}`}>
        <span className="proj-media-hover-text">CLICK TO OPEN SITE <IconExternal /></span>
      </a>
    </div>
  );
};

// Image carousel
const ImageCarousel = ({ images, title }) => {
  const [idx, setIdx] = useState(0);
  return (
    <div className="proj-media-inner">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`${title} screenshot ${idx + 1}`}
          className="proj-media-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="proj-media-dots">
          {images.map((_, i) => (
            <button key={i} className={`proj-media-dot ${i === idx ? 'proj-media-dot--active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

// Placeholder
const Placeholder = () => (
  <div className="proj-media-placeholder">
    <span className="proj-media-blocked-icon">◻</span>
    <span className="proj-media-blocked-text">SCREENSHOT COMING SOON</span>
  </div>
);

const MediaPanel = ({ project }) => {
  if (project.live && project.live !== '#' && project.live !== '') {
    return <LivePreview url={project.live} title={project.title} />;
  }
  if (project.images && project.images.length > 0) {
    return <ImageCarousel images={project.images} title={project.title} />;
  }
  return <Placeholder />;
};

const Projects = () => {
  const [projects, setProjects] = useState(fallback.projects);
  const [activeId, setActiveId] = useState(fallback.projects[0]?.id);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setActiveId(data[0]?.id);
    });
  }, []);

  const active = projects.find(p => p.id === activeId) || projects[0];

  return (
    <section id="projects">
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">PROJECTS</h2>
        <div className="section-rule" />
      </div>

      {/* Tab selector */}
      <div className="bento-tabs">
        {projects.map(p => (
          <button
            key={p.id}
            className={`bento-tab ${p.id === activeId ? 'bento-tab--active' : ''}`}
            onClick={() => setActiveId(p.id)}
          >
            <h3 className="bento-tab-title">{p.title}</h3>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="proj-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="proj-layout">
            {/* Left — media, fixed in place: never scrolls */}
            <div className="proj-media-col">
              <div className="proj-media-frame">
                <MediaPanel project={active} />
              </div>

              <div className="project-tech proj-tech-row">
                {active.tech.map((t, i) => {
                  const Icon = iconFor(t);
                  return (
                    <span key={i} className="tech-tag proj-tech-tag">
                      <Icon /> {t}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right — the only part that scrolls, independently of the media */}
            <div className="proj-info-col">
              <div className="proj-tags">
                <div className="proj-tags-left">
                  <span className="proj-type-tag">{active.type}</span>
                  {/* Live Site is already the clickable preview above — this is just the source link */}
                  {active.link && active.link !== '#' && active.link !== '' && (
                    <a href={active.link} target="_blank" rel="noopener noreferrer" className="proj-link">
                      View Code <IconGithub />
                    </a>
                  )}
                </div>
                <span className={`wip-status ${active.status === 'ACTIVE' ? 'wip-status--active' : 'wip-status--paused'}`}>
                  {active.status === 'ACTIVE' ? '●' : '✓'} {active.status}
                </span>
              </div>

              <h3 className="proj-title">{active.title}</h3>

              <p className="proj-desc">{active.fullDescription || active.description}</p>

              {active.keyFeatures && (
                <div className="proj-features">
                  <div className="proj-subhead">KEY FEATURES</div>
                  <ul className="proj-features-list">
                    {active.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Projects;
