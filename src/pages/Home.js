import React from 'react';
import Hero from '../components/Hero';

function Home({ profile }) {
  return (
    <div>
      <Hero profile={profile} />
    </div>
  );
}

export default Home;
