import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import AboutUs from './sections/AboutUs.jsx';
import Preloader from './components/Preloader.jsx';

export default function App() {
  const [heroRevealing, setHeroRevealing] = useState(false);
  const showHero = useCallback(() => setHeroRevealing(true), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Same smooth-wheel scrolling setup used on the Bali Villa website.
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame;
    const animate = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return (
    <>
      <Preloader onReveal={showHero} />
      <main>
        <Hero revealing={heroRevealing} />
        <Services />
        <AboutUs />
      </main>
    </>
  );
}
