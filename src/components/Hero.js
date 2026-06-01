import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getProfile } from '../services/portfolio';
import fallback from '../data/portfolio.json';

const Hero = () => {
  const [stats, setStats]     = useState(fallback.stats);
  const [profile, setProfile] = useState(fallback.profile);

  useEffect(() => {
    getStats().then(setStats);
    getProfile().then(setProfile);
  }, []);

  const resumeUrl = profile?.resume || '#';

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid">

        {/* Left — identity */}
        <div className="hud-frame">
          <div className="hud-tl" /><div className="hud-tr" />
          <div className="hud-bl" /><div className="hud-br" />

          <div className="hero-eyebrow">WAKE UP,</div>
          <h1 className="hero-name" data-text="REYHAN CHILL">REYHAN CHILL</h1>
          <div className="hero-role">FULL STACK DEVELOPER</div>

          <p className="hero-bio">
            Building end-to-end digital systems — from pixel-perfect interfaces
            to resilient backend architecture. Focused on elegant solutions to
            real-world problems.
          </p>

          <div className="hero-actions">
            <Link to="/projects">
              <button className="btn-primary">VIEW PROJECTS</button>
            </Link>
            <Link to="/contact">
              <button className="btn-ghost">[ CONTACT ]</button>
            </Link>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <button className="btn-cv">↓ RÉSUMÉ</button>
            </a>
          </div>
        </div>

        {/* Right — stat cards from Firebase */}
        <div className="stat-panel">
          {stats.map((s, i) => (
            <div key={s.id || i} className={`stat-card${s.highlight ? ' stat-card--highlight' : ''}`}>
              <div className="stat-num" style={s.highlight ? { fontSize: '11px', lineHeight: 1.5, minWidth: 60 } : {}}>
                {s.num.split('\n').map((line, j) => (
                  <React.Fragment key={j}>{line}{j < s.num.split('\n').length - 1 && <br/>}</React.Fragment>
                ))}
              </div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
