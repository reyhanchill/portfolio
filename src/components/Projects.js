import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects } from '../services/portfolio';
import fallback from '../data/portfolio.json';

// Live site preview — iframe with fallback
const LivePreview = ({ url, title }) => {
  const [blocked, setBlocked] = useState(false);

  return (
    <div className="bento-preview-wrap">
      {!blocked ? (
        <>
          <iframe
            src={url}
            title={`${title} live preview`}
            className="bento-iframe"
            sandbox="allow-scripts allow-same-origin"
            onError={() => setBlocked(true)}
          />
          {/* Overlay — click opens site */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-iframe-overlay"
            title={`Open ${title} ↗`}
          >
            <span className="bento-iframe-hint">CLICK TO OPEN SITE ↗</span>
          </a>
        </>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="bento-blocked">
          <span className="bento-blocked-icon">◻</span>
          <span className="bento-blocked-text">PREVIEW BLOCKED</span>
          <span className="bento-blocked-link">CLICK TO OPEN SITE ↗</span>
        </a>
      )}
    </div>
  );
};

// Image carousel
const ImageCarousel = ({ images, title }) => {
  const [idx, setIdx] = useState(0);
  return (
    <div className="bento-img-wrap">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`${title} screenshot ${idx + 1}`}
          className="bento-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="bento-img-nav">
          {images.map((_, i) => (
            <button key={i} className={`bento-img-dot ${i === idx ? 'bento-img-dot--active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

// Placeholder
const Placeholder = () => (
  <div className="bento-img-placeholder">
    <div className="bento-img-placeholder-inner">
      <span className="bento-no-img-icon">◻</span>
      <span className="bento-no-img-text">SCREENSHOT COMING SOON</span>
    </div>
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

      {/* Tab selector — ABOVE the bento */}
      <div className="bento-tabs">
        {projects.map(p => (
          <button
            key={p.id}
            className={`bento-tab ${p.id === activeId ? 'bento-tab--active' : ''}`}
            onClick={() => setActiveId(p.id)}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Bento display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="bento-layout"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left — live preview or screenshots */}
          <div className="bento-left">
            <MediaPanel project={active} />
          </div>

          {/* Top right — title + description */}
          <div className="bento-info">
            <div className="wip-header" style={{ marginBottom: 14 }}>
              <span className={`wip-status ${active.status === 'ACTIVE' ? 'wip-status--active' : 'wip-status--paused'}`}>
                {active.status === 'ACTIVE' ? '●' : '✓'} {active.status}
              </span>
              <span className="wip-tag">{active.type}</span>
            </div>
            <h3 className="bento-title">{active.title}</h3>
            <p className="bento-desc">{active.fullDescription || active.description}</p>
          </div>

          {/* Bottom right — stack + links */}
          <div className="bento-meta">
            <div>
              <div className="bento-meta-label">STACK</div>
              <div className="project-tech" style={{ marginTop: 8 }}>
                {active.tech.map((t, i) => <span key={i} className="tech-tag">{t}</span>)}
              </div>
            </div>

            {active.keyFeatures && (
              <div>
                <div className="bento-meta-label">KEY FEATURES</div>
                <ul className="bento-features">
                  {active.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            <div className="bento-links">
              {active.live && active.live !== '#' && active.live !== '' && (
                <a href={active.live} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  LIVE DEMO ↗
                </a>
              )}
              {active.link && active.link !== '#' && active.link !== '' && (
                <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  [ SOURCE ]
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Projects;
