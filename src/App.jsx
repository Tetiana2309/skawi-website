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
  const [sectionTransition, setSectionTransition] = useState(null);

  useEffect(() => () => transitionTimers.current.forEach(window.clearTimeout), []);

  const navigateWithSplash = useCallback((href) => {
    if (href !== '#services' && href !== '#about') return;
    transitionTimers.current.forEach(window.clearTimeout);
    setSectionTransition({ href, phase: 'showing' });

    const navigate = window.setTimeout(() => {
      const section = document.querySelector(href);
      if (section) {
        const sectionTop = window.scrollY + section.getBoundingClientRect().top;
        const targetY = href === '#about' ? sectionTop + window.innerHeight : sectionTop + 1;
        if (lenisRef.current) lenisRef.current.scrollTo(targetY, { immediate: true, force: true });
        else window.scrollTo({ top: targetY, behavior: 'instant' });
      }
      setSectionTransition({ href, phase: 'revealing' });
    }, 1000);
    const finish = window.setTimeout(() => setSectionTransition(null), 2800);
    transitionTimers.current = [navigate, finish];
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
      {sectionTransition && (
        <div
          className={`skawi-preloader skawi-preloader--static ${sectionTransition.phase === 'revealing' ? 'skawi-preloader--revealing' : ''}`}
          role="status"
          aria-label="Перехід до розділу"
        >
          <div className="skawi-preloader__scene" aria-hidden="true">
            <div className="skawi-preloader__coin">
              <img className="skawi-preloader__face skawi-preloader__face--front" src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="" width="220" height="220" />
            </div>
          </div>
        </div>
      )}
      <main>
        <Hero revealing={heroRevealing} language={language} onLanguageChange={setLanguage} onSectionNavigate={navigateWithSplash} />
        <Services language={language} />
        <AboutUs language={language} />
      </main>
    </>
  );
}
