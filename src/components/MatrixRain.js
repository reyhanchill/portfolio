import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const MatrixRain = () => {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    if (reducedMotion) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    const fontSize = 13;
    let width, height, drops, interval, resizeTimer;
    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.floor(width / fontSize) }, () => Math.random() * -100);
    };
    init();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((drop, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drop * fontSize);
        drops[i] = drop * fontSize > height && Math.random() > 0.975 ? 0 : drop + 1;
      });
    };
    const updateVisibility = () => {
      clearInterval(interval);
      if (!document.hidden) interval = setInterval(draw, 33);
    };
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearInterval(interval);
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);
  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
};
export default MatrixRain;
