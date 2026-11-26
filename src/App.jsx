import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import AboutUs from './sections/AboutUs.jsx';
import Preloader from './components/Preloader.jsx';
import './components/Preloader.css';

export default function App() {
  const [heroRevealing, setHeroRevealing] = useState(false);
  const [language, setLanguage] = useState('UA');
  const showHero = useCallback(() => setHeroRevealing(true), []);
  const lenisRef = useRef(null);
  const transitionTimers = useRef([]);
  const transitionActiveRef = useRef(false);
  const [sectionTransitionPhase, setSectionTransitionPhase] = useState('idle');

  useEffect(() => () => {
    transitionTimers.current.forEach(window.clearTimeout);
    lenisRef.current?.start();
  }, []);

  const navigateWithSplash = useCallback((href) => {
    if ((href !== '#services' && href !== '#about') || transitionActiveRef.current) return;
    const section = document.querySelector(href);
    if (!section) return;

    transitionActiveRef.current = true;
    transitionTimers.current.forEach(window.clearTimeout);
    lenisRef.current?.stop();

    // Inspired by Bali Villa: a bottom-up curtain, a centered logo reveal,
    // a brief hold, an invisible page jump, then a smooth downward exit.
    setSectionTransitionPhase('enter');

    const schedule = (callback, delay) => {
      transitionTimers.current.push(window.setTimeout(callback, delay));
    };

    schedule(() => setSectionTransitionPhase('logo-in'), 570);
    schedule(() => {
      const currentSection = document.querySelector(href);
      if (currentSection) {
        const sectionTop = window.scrollY + currentSection.getBoundingClientRect().top;
        const targetY = href === '#about' ? sectionTop + window.innerHeight : sectionTop + 1;
        if (lenisRef.current) lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
        else window.scrollTo({ top: targetY, behavior: 'instant' });
      }
      setSectionTransitionPhase('logo-out');
    }, 2370);
    schedule(() => setSectionTransitionPhase('exit'), 3150);
    schedule(() => {
      setSectionTransitionPhase('idle');
      transitionActiveRef.current = false;
      lenisRef.current?.start();
    }, 4200);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Same smooth-wheel scrolling setup used on the Bali Villa website.
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false,
      autoResize: true,
    });
    lenisRef.current = lenis;
    let frame;
    const animate = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);
  return (
    <>
      <Preloader onReveal={showHero} />
      <div
        className={`skawi-section-transition skawi-section-transition--${sectionTransitionPhase}`}
        aria-hidden="true"
      >
        <div className="skawi-section-transition__logo">
          <img src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="" width="220" height="220" />
        </div>
      </div>
      <main>
        <Hero revealing={heroRevealing} language={language} onLanguageChange={setLanguage} onSectionNavigate={navigateWithSplash} />
        <Services language={language} />
        <AboutUs language={language} />
      </main>
    </>
  );
}
