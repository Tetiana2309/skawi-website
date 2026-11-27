import { useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import Logo from '../components/Logo.jsx';
import './Hero.css';

const heroTitles = {
  UA: ['Твоя Мова.', 'Твоя Свобода.'],
  PL: ['Twój Język.', 'Twoja Wolność.'],
  EN: ['Your Language.', 'Your Freedom.'],
  SP: ['Tu Idioma.', 'Tu Libertad.'],
  RU: ['Твой Язык.', 'Твоя Свобода.'],
};

export default function Hero({ revealing = false, language = 'UA', onLanguageChange, onSectionNavigate, onVideoReady }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    let pending = false;
    let disposed = false;
    let ready = false;
    let lastTime = video.currentTime;
    let lastProgress = performance.now();
    let lastRecovery = 0;

    const markReady = () => {
      if (!ready) {
        ready = true;
        onVideoReady?.();
      }
    };
    const active = () => !disposed && inView && !document.hidden && !motion.matches;
    const tryPlay = () => {
      if (!active() || pending || !video.paused) return;
      video.muted = true;
      pending = true;
      Promise.resolve(video.play()).catch(() => {}).finally(() => { pending = false; });
    };
    const sync = () => {
      lastTime = video.currentTime;
      lastProgress = performance.now();
      if (motion.matches) markReady();
      if (active()) tryPlay();
      else video.pause();
    };
    const progress = () => {
      if (Math.abs(video.currentTime - lastTime) > 0.01) {
        lastTime = video.currentTime;
        lastProgress = performance.now();
        markReady();
      }
    };
    const check = () => {
      if (!active()) return;
      progress();
      tryPlay();
      const now = performance.now();
      // A video can be stalled while paused is false. Do not restart downloads
      // while buffering; only nudge the decoder once enough data is available.
      if (!video.paused && !video.seeking && video.readyState >= 3 &&
          now - lastProgress > 1800 && now - lastRecovery > 3500) {
        lastRecovery = now;
        video.pause();
        pending = false;
        tryPlay();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }, { threshold: 0.01 });
    const events = ['loadeddata', 'canplay', 'canplaythrough', 'waiting', 'stalled', 'pause'];
    events.forEach(event => video.addEventListener(event, tryPlay));
    video.addEventListener('timeupdate', progress);
    video.addEventListener('error', markReady);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);
    motion.addEventListener('change', sync);
    observer.observe(video);
    const watchdog = window.setInterval(check, 500);
    sync();
    return () => {
      disposed = true;
      window.clearInterval(watchdog);
      observer.disconnect();
      events.forEach(event => video.removeEventListener(event, tryPlay));
      video.removeEventListener('timeupdate', progress);
      video.removeEventListener('error', markReady);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pageshow', sync);
      motion.removeEventListener('change', sync);
    };
  }, [onVideoReady]);

  return (
    <section className={revealing ? "hero hero--revealing" : "hero hero--waiting"} id="home" aria-labelledby="hero-heading">
      <div className="hero__media" aria-hidden="true">
        <video ref={videoRef} className="hero__video" autoPlay muted loop playsInline preload="auto">
          <source src={`${import.meta.env.BASE_URL}videos/video-hero.mp4`} type="video/mp4" />
        </video>
        <div className="hero__gradient" />
      </div>

      <div className="hero__top">
        <Logo />
        <Header language={language} onLanguageChange={onLanguageChange} onSectionNavigate={onSectionNavigate} />
      </div>

      <div className="hero__heading" id="hero-heading">
        <p className="hero__pretitle">{heroTitles[language][0]}</p>
        <h1>{heroTitles[language][1]}</h1>
      </div>
    </section>
  );
}
