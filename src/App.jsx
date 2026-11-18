import { useCallback, useState } from 'react';
import Hero from './sections/Hero.jsx';
import Preloader from './components/Preloader.jsx';

export default function App() {
  const [heroRevealing, setHeroRevealing] = useState(false);
  const showHero = useCallback(() => setHeroRevealing(true), []);
  return (
    <>
      <Preloader onReveal={showHero} />
      <main>
        <Hero revealing={heroRevealing} />
      </main>
    </>
  );
}
