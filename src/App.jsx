import { useState } from 'react';
import Hero from './sections/Hero.jsx';
import Preloader from './components/Preloader.jsx';

export default function App() {
  const [heroRevealing, setHeroRevealing] = useState(false);
  return (
    <>
      <Preloader onReveal={() => setHeroRevealing(true)} />
      <main>
        <Hero revealing={heroRevealing} />
      </main>
    </>
  );
}
