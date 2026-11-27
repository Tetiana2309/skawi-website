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
  const aboutImageReadyRef = useRef(null);
  const [sectionTransitionPhase, setSectionTransitionPhase] = useState('idle');

  // Image decoding can be deferred until the first time a large CSS
  // background appears. Start it as soon as the app mounts instead.
  const prepareAboutImage = useCallback(() => {
    if (!aboutImageReadyRef.current) {
      const img = new Image();
      img.src = `${import.meta.env.BASE_URL}images/About-Us-Section.webp`;
      aboutImageReadyRef.current = (img.decode
        ? img.decode()
        : new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
      ).catch(() => {});
    }
    return aboutImageReadyRef.current;
  }, []);

  useEffect(() => {
    prepareAboutImage();
  }, [prepareAboutImage]);

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
    schedule(async () => {
      // Keep the curtain fully closed until the background image is decoded
      // and the text fonts are ready. This matters on the FIRST navigation.
      if (href === '#about') {
        await Promise.all([prepareAboutImage(), document.fonts.ready]);
      }

      const currentSection = document.querySelector(href);
      if (currentSection) {
        const sectionTop = window.scrollY + currentSection.getBoundingClientRect().top;
        const travel = Math.max(0, currentSection.offsetHeight - window.innerHeight);
        const targetY = href === '#about' ? sectionTop + travel * 0.97 : sectionTop + 1;
        if (lenisRef.current) lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
        else window.scrollTo({ top: targetY, behavior: 'instant' });
      }

      // Two frames let the browser settle the photo, text and glass BEFORE
      // the user sees them, rather than during the curtain's exit.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!transitionActiveRef.current) return;
        setSectionTransitionPhase('logo-out');
        schedule(() => setSectionTransitionPhase('exit'), 650);
        schedule(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(window.scrollY, { immediate: true, force: true });
            lenisRef.current.start();
          }
          setSectionTransitionPhase('idle');
          transitionActiveRef.current = false;
        }, 1650);
      }));
    }, 2050);
  }, [prepareAboutImage]);

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
