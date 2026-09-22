import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/portfolio';
import fallback from '../data/portfolio.json';
import { IconDb, IconCode, IconGraduation, IconBriefcase } from './Icons';

const CARD_ICONS = { database: IconDb, code: IconCode, graduation: IconGraduation, briefcase: IconBriefcase };

const Hero = ({ profile = fallback.profile }) => {
  const [stats, setStats] = useState(fallback.stats);
  useEffect(() => {
    let active = true;
    getStats().then(data => { if (active) setStats(data); });
    return () => { active = false; };
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid">
        <div className="hud-frame">
          <div className="hud-tl" /><div className="hud-tr" />
          <div className="hud-bl" /><div className="hud-br" />
          <div className="hero-eyebrow">WAKE UP,</div>
          <h1 className="hero-name" aria-label={profile.name} data-text={profile.name.toUpperCase()}>{profile.name.toUpperCase()}</h1>
          <div className="hero-role">{profile.role}</div>
          <p className="hero-bio">{profile.bio}</p>
          <div className="hero-actions">
            <Link to="/projects" className="btn-primary">VIEW PROJECTS</Link>
            <Link to="/contact" className="btn-ghost">[ CONTACT ]</Link>
            {profile.resume && <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-cv">↓ RÉSUMÉ</a>}
          </div>
        </div>
        <div className="stat-panel">
          {stats.map(stat => {
            const Icon = CARD_ICONS[stat.icon];
            return (
              <div key={stat.id} className={`stat-card${stat.highlight ? ' stat-card--highlight' : ''}`}>
                <div className="stat-icon"><Icon size={32} /></div>
                <div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-sub">{stat.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Hero;
