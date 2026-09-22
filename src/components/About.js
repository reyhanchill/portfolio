import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getSkills } from '../services/portfolio';
import fallback from '../data/portfolio.json';
import TechnologyIcon from './TechnologyIcon';
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const About = () => {
  const reducedMotion = useReducedMotion();
  const [skills, setSkills] = useState(fallback.skills);

  useEffect(() => {
    let active = true;
    getSkills().then(data => { if (active) setSkills(data); });
    return () => { active = false; };
  }, []);

  return (
    <section id="about">
      <div className="section-header">
        <span className="section-num" aria-hidden="true">01</span>
        <h1 className="section-title">STACK</h1>
        <div className="section-rule" />
      </div>

      <div className="stack-intro">
        <p className="stack-eyebrow">LANGUAGES · FRAMEWORKS · TOOLS</p>
      </div>
      <div className="about-sub">TECHNOLOGIES</div>
      <motion.div
        className="skills-grid"
        variants={containerVariants}
        initial={reducedMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {skills.map((cat, i) => (
          <motion.div key={cat.id || i} className={`skill-category${cat.category === 'LANGUAGES' ? ' skill-category--languages' : ''}`} variants={reducedMotion ? undefined : cardVariants}>
            <div className="skill-heading"><span className="skill-number" aria-hidden="true">0{i + 1}</span><h2>{cat.category}</h2></div>
            <ul className="skill-list">
              {cat.items.map(s => {

                return <li key={s}><TechnologyIcon technology={s} className="skill-icon" /><span>{s}</span></li>;
              })}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default About;
