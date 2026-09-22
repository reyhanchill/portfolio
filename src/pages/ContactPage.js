import React from 'react';
import Contact from '../components/Contact';

function ContactPage({ profile }) {
  return (
    <div>
      <Contact profile={profile} />
    </div>
  );
}

export default ContactPage;
