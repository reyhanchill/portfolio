import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSkills } from '../services/portfolio';
import fallback from '../data/portfolio.json';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const About = () => {
  const [skills, setSkills] = useState(fallback.skills);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  return (
    <section id="about">
      <div className="section-header">
        <span className="section-num">01</span>
        <h2 className="section-title">STACK</h2>
        <div className="section-rule" />
      </div>

      <div className="about-sub">SKILLS</div>
      <motion.div
        className="skills-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {skills.map((cat, i) => (
          <motion.div key={cat.id || i} className="skill-category" variants={cardVariants}>
            <h3>[{cat.category}]</h3>
            <ul className="skill-list">
              {cat.items.map((s, j) => <li key={j}>{s}</li>)}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default About;
