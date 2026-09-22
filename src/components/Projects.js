import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getProjects } from '../services/portfolio';
import fallback from '../data/portfolio.json';
import { IconCode, IconGithub } from './Icons';
import TechnologyIcon from './TechnologyIcon';

const ProjectCover = ({ project }) => (
  <div className="proj-media-placeholder">
    <IconCode size={48} />
    <span className="proj-cover-title">{project.title}</span>
    <span className="proj-cover-type">{project.type}</span>
  </div>
);

const MediaPanel = ({ project }) => {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const media = project.images.length ? (
    failed ? <ProjectCover project={project} /> : (
      <img src={project.images[index]} alt={`${project.title} screenshot ${index + 1}`} className="proj-media-img" onError={() => setFailed(true)} />
    )
  ) : project.live ? (
    <iframe
      src={project.live}
      title={`${project.title} live preview`}
      className="proj-media-iframe"
      sandbox="allow-scripts allow-same-origin"
      loading="eager"
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : <ProjectCover project={project} />;
  return (
    <div className="proj-media-inner">
      {project.live ? (
        <>
          {media}
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-preview-link" aria-label={`View ${project.title} live project (opens in a new tab)`}>
            <span className="proj-preview-overlay" aria-hidden="true">
              <span className="proj-preview-label">CLICK TO VIEW SITE</span>
            </span>
          </a>
        </>
      ) : media}
      {project.images.length > 1 && (
        <div className="proj-media-dots" role="group" aria-label={`${project.title} screenshots`}>
          {project.images.map((_, i) => (
            <button type="button" key={i} className="proj-media-dot" aria-label={`Show screenshot ${i + 1}`} aria-pressed={i === index}
              onClick={() => { setIndex(i); setFailed(false); }} />
          ))}
        </div>
      )}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState(fallback.projects);
  const [activeId, setActiveId] = useState(fallback.projects[0]?.id);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    let mounted = true;
    getProjects().then(data => {
      if (!mounted) return;
      setProjects(data);
      setActiveId(current => data.some(project => project.id === current) ? current : data[0]?.id);
    });
    return () => { mounted = false; };
  }, []);
  const active = projects.find(project => project.id === activeId) || projects[0];

  return (
    <section id="projects">
      <div className="section-header">
        <span className="section-num" aria-hidden="true">02</span>
        <h1 className="section-title">PROJECTS</h1>
        <div className="section-rule" />
      </div>
      <div className="bento-tabs" role="group" aria-label="Choose a project">
        {projects.map(project => (
          <button type="button" key={project.id} className={`bento-tab ${project.id === active?.id ? 'bento-tab--active' : ''}`}
            aria-pressed={project.id === active?.id} aria-controls="project-details" onClick={() => setActiveId(project.id)}>
            {project.title}
          </button>
        ))}
      </div>
      {active ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.id} id="project-details" className="proj-card" role="region" aria-label={`${active.title} details`}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
            <div className="proj-layout">
              <div className="proj-media-col">
                <div className={`proj-media-frame${active.live ? ' proj-media-frame--clickable' : ''}`}>
                  <MediaPanel key={`${active.id}:${active.images.join('|')}`} project={active} />
                </div>
                <div className="project-tech proj-tech-row">
                  {active.tech.map((tech, i) => {

                    return <span key={i} className="tech-tag proj-tech-tag"><TechnologyIcon technology={tech} className="project-tech-icon" /> {tech}</span>;
                  })}
                </div>
              </div>
              <div className="proj-info-col" tabIndex={0} role="region" aria-label={`${active.title} description`}>
                <div className="proj-tags">
                  <span className="proj-type-tag">{active.type}</span>
                  {active.status && <span className={`wip-status ${active.status === 'ACTIVE' ? 'wip-status--active' : 'wip-status--paused'}`}>{active.status}</span>}
                </div>
                <h2 className="proj-title">{active.title}</h2>
                <p className="proj-desc">{active.fullDescription || active.description}</p>
                {active.link && (
                  <div className="proj-links">
                    {active.link && <a href={active.link} target="_blank" rel="noopener noreferrer" className="proj-link">Source code <IconGithub /></a>}
                  </div>
                )}
                {active.keyFeatures.length > 0 && (
                  <div className="proj-features">
                    <h3 className="proj-subhead">PROJECT DETAILS</h3>
                    <ul className="proj-features-list">{active.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : <p>No projects are available yet.</p>}
    </section>
  );
};
export default Projects;
