import React, { useEffect, useRef, useState } from 'react';
import fallback from '../data/portfolio.json';
import { sendContact, validateContact } from '../services/contact';

const Contact = ({ profile = fallback.profile }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const pending = useRef(null);
  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, []);

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
    if (status !== 'sending') { setStatus(''); setError(''); }
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (pending.current) return;
    const validation = validateContact(form);
    if (validation) { setError(validation); setStatus('error'); return; }
    const controller = new AbortController();
    pending.current = controller;
    setStatus('sending');
    setError('');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      await sendContact(form, profile.email, controller.signal);
      if (pending.current !== controller) return;
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      if (pending.current !== controller) return;
      setError('Your message could not be sent. Please try again or email me directly.');
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      if (pending.current === controller) pending.current = null;
    }
  };

  return (
    <section id="contact">
      <div className="section-header">
        <span className="section-num" aria-hidden="true">03</span>
        <h1 className="section-title">CONTACT</h1>
        <div className="section-rule" />
      </div>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit} aria-busy={status === 'sending'}>
          <div className="form-group">
            <label htmlFor="name">NAME</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" maxLength={100} disabled={status === 'sending'} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" maxLength={254} disabled={status === 'sending'} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">MESSAGE</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} maxLength={5000} disabled={status === 'sending'} required />
          </div>
          <button type="submit" className="btn-primary contact-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
          <p className={`form-status${status === 'error' ? ' form-status--error' : ' form-status--success'}`} role="status" aria-live="polite" aria-atomic="true">
            {status === 'sending' && 'Sending your message…'}
            {status === 'success' && "Message sent. I'll get back to you soon."}
            {status === 'error' && error}
          </p>
        </form>
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="contact-info-label">EMAIL</div>
            <div className="contact-info-value"><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">GITHUB</div>
            <div className="contact-info-value"><a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github.replace('https://', '')}</a></div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">LINKEDIN</div>
            <div className="contact-info-value"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin.replace('https://', '')}</a></div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">LOCATION</div>
            <div className="contact-info-value">{profile.location} · Available remote</div>
          </div>
          <div className="contact-info-card contact-info-card--highlight">
            <div className="contact-info-label">STATUS</div>
            <div className="contact-info-value">{profile.availability}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
