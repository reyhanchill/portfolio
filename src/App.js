import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import './App.css';
import fallback from './data/portfolio.json';
import { getProfile } from './services/portfolio';
import { IconGithub, LinkedinIcon, IconCode, IconBriefcase, IconHome, IconMail } from './components/Icons';
import MatrixRain from './components/MatrixRain';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop({ profile }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const page = { '/': '', '/about': 'Stack', '/projects': 'Projects', '/contact': 'Contact' }[pathname];
    document.title = `${page === undefined ? 'Page not found · ' : page ? `${page} · ` : ''}${profile.name} — ${profile.role}`;
  }, [pathname, profile.name, profile.role]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

function PageWrap({ children }) {
  const reducedMotion = useReducedMotion();
  const container = useRef(null);
  useEffect(() => {
    const heading = container.current?.querySelector('h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }, []);
  return (
    <motion.div ref={container} variants={reducedMotion ? undefined : pageVariants} initial={reducedMotion ? false : "initial"} animate="animate" exit={reducedMotion ? undefined : "exit"}>
      {children}
    </motion.div>
  );
}

function AnimatedRoutes({ profile }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageWrap><Home profile={profile} /></PageWrap>} />
        <Route path="/about"    element={<PageWrap><AboutPage /></PageWrap>} />
        <Route path="/projects" element={<PageWrap><ProjectsPage /></PageWrap>} />
        <Route path="/contact"  element={<PageWrap><ContactPage profile={profile} /></PageWrap>} />
        <Route path="*" element={<PageWrap><section><h1 className="section-title">PAGE NOT FOUND</h1><p className="not-found-copy">That page doesn’t exist.</p><Link to="/" className="btn-primary">BACK HOME</Link></section></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
}

const NAV_LINKS = [
  { to: '/',         label: 'HOME', icon: IconHome },
  { to: '/about',    label: 'STACK', icon: IconCode },
  { to: '/projects', label: 'PROJECTS', icon: IconBriefcase },
  { to: '/contact',  label: 'CONTACT', icon: IconMail },
];

function App() {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState(fallback.profile);
  useEffect(() => {
    let active = true;
    getProfile().then(data => { if (active) setProfile(data); });
    return () => { active = false; };
  }, []);

  return (
    <MotionConfig reducedMotion="user"><Router>
      <ScrollToTop profile={profile} />
      <div className="App">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <MatrixRain />

        <nav className="vnav" aria-label="Main navigation">
          <div className="vnav-brand">
            <div className="brand-hex">
              <div className="brand-hex-outer" />
              <div className="brand-hex-inner" />
              <span className="brand-hex-text">RC</span>
            </div>
          </div>

          <div className="vnav-links">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'vnav-item active' : 'vnav-item'}
                aria-label={label}
              >
                <span className="vnav-icon"><Icon size={18} /></span>
                <span className="vnav-label">{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="vnav-bottom">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="vnav-social" aria-label="GitHub">
              <IconGithub />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="vnav-social" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <div className="vnav-pulse" title="Online" />
          </div>
        </nav>

        <main id="main-content" tabIndex={-1}>
          <AnimatedRoutes profile={profile} />
        </main>

        <footer className="hud-bar">
          <span className="hud-item"><span className="hud-dot" />ONLINE</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">{profile.role.toUpperCase()}</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">BUILD: v2.0.0</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">{profile.location.toUpperCase()}</span>
          <span className="hud-item hud-right">{new URL(profile.website).hostname} © {year}</span>
        </footer>
      </div>
    </Router></MotionConfig>
  );
}

export default App;
