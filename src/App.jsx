import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import AboutUs from './sections/AboutUs.jsx';
import Team from './sections/Team.jsx';
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

    schedule(() => setSectionTransitionPhase('logo-in'), 500);
    schedule(() => {
      // Prepare the About Us photo and glass panel before the hidden jump.
      setSectionTransitionPhase('logo-out');
      requestAnimationFrame(() => {
        const currentSection = document.querySelector(href);
        if (!currentSection) return;
        const sectionTop = window.scrollY + currentSection.getBoundingClientRect().top;
        const travel = Math.max(0, currentSection.offsetHeight - window.innerHeight);
        // Stop safely inside the sticky interval, not on its final pixel.
        // At 97% the photo and glass panel are already fully revealed, but
        // the browser cannot flip the sticky element into its outgoing state.
        const targetY = href === '#about' ? sectionTop + travel * 0.97 : sectionTop + 1;
        if (lenisRef.current) lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
        else window.scrollTo({ top: targetY, behavior: 'instant' });
      });
    }, 2050);
    schedule(() => setSectionTransitionPhase('exit'), 2700);
    schedule(() => {
      // Keep Lenis and native scroll aligned before releasing the cover.
      if (lenisRef.current) {
        lenisRef.current.scrollTo(window.scrollY, { immediate: true, force: true });
        lenisRef.current.start();
      }
      setSectionTransitionPhase('idle');
      transitionActiveRef.current = false;
    }, 3650);
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
        <Team language={language} />
      </main>
    </>
  );
}
