import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import MatrixRain from './components/MatrixRain';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageWrap><Home /></PageWrap>} />
        <Route path="/about"    element={<PageWrap><AboutPage /></PageWrap>} />
        <Route path="/projects" element={<PageWrap><ProjectsPage /></PageWrap>} />
        <Route path="/contact"  element={<PageWrap><ContactPage /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
}

const NAV_LINKS = [
  { to: '/',         label: 'HOME',  icon: '⌂' },
  { to: '/about',    label: 'STACK', icon: '◉' },
  { to: '/projects', label: 'BUILD', icon: '◻' },
  { to: '/contact',  label: 'PING',  icon: '◎' },
];

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function App() {
  const [year] = useState(new Date().getFullYear());

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
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
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'vnav-item active' : 'vnav-item'}
                aria-label={label}
              >
                <span className="vnav-icon">{icon}</span>
                <span className="vnav-label">{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="vnav-bottom">
            <a href="https://github.com/reyhanchill" target="_blank" rel="noopener noreferrer" className="vnav-social" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a href="https://linkedin.com/in/hrc20" target="_blank" rel="noopener noreferrer" className="vnav-social" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <div className="vnav-pulse" title="Online" />
          </div>
        </nav>

        <main>
          <AnimatedRoutes />
        </main>

        <div className="hud-bar" role="status" aria-label="System status">
          <span className="hud-item"><span className="hud-dot" />ONLINE</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">SOFTWARE ENGINEER</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">BUILD: v2.0.0</span>
          <span className="hud-sep">·</span>
          <span className="hud-item">LONDON, UK</span>
          <span className="hud-item hud-right">reyhanchill.dev © {year}</span>
        </div>
      </div>
    </Router>
  );
}

export default App;
