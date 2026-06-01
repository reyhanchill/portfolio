import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/reyhanchill@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 6000);
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  return (
    <section id="contact">
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">CONTACT</h2>
        <div className="section-rule" />
      </div>

      <div className="contact-grid">

        {/* Form */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">NAME</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">MESSAGE</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
          </button>

          {status === 'success' && (
            <p className="form-status form-status--success">
              &gt; Message sent. I'll get back to you soon._
            </p>
          )}
          {status === 'error' && (
            <p className="form-status form-status--error">
              &gt; Error sending. Please email me directly.
            </p>
          )}
        </form>

        {/* Info sidebar */}
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="contact-info-label">EMAIL</div>
            <div className="contact-info-value">
              <a href="mailto:reyhanchill@gmail.com">reyhanchill@gmail.com</a>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">GITHUB</div>
            <div className="contact-info-value">
              <a href="https://github.com/reyhanchill" target="_blank" rel="noopener noreferrer">github.com/reyhanchill</a>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">LINKEDIN</div>
            <div className="contact-info-value">
              <a href="https://linkedin.com/in/hrc20" target="_blank" rel="noopener noreferrer">linkedin.com/in/hrc20</a>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-label">LOCATION</div>
            <div className="contact-info-value">London, UK · Available Remote</div>
          </div>
          <div className="contact-info-card" style={{ borderColor: 'rgba(0,255,65,0.35)' }}>
            <div className="contact-info-label">STATUS</div>
            <div className="contact-info-value" style={{ color: 'var(--g)', textShadow: '0 0 8px var(--g)' }}>
              Open to opportunities
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
