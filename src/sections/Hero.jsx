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

export default function Hero({ revealing = false, language = 'UA', onLanguageChange, onSectionNavigate }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = true;
    let retryFrame = 0;
    let playPending = false;

    const tryPlay = () => {
      if (!inView || document.hidden || !video.paused || playPending) return;
      video.muted = true;
      playPending = true;
      const playback = video.play();
      if (playback && typeof playback.then === 'function') {
        playback.then(() => { playPending = false; }).catch(() => {
          // A first autoplay attempt may race with the video loading on refresh.
          // The media-ready and page lifecycle listeners below retry it.
          playPending = false;
        });
      } else {
        playPending = false;
      }
    };

    const schedulePlay = () => {
      cancelAnimationFrame(retryFrame);
      retryFrame = requestAnimationFrame(tryPlay);
    };

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else schedulePlay();
    };
    const onPageShow = () => schedulePlay();
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedulePlay();
      else video.pause();
    }, { threshold: 0.01 });

    video.addEventListener('loadeddata', schedulePlay);
    video.addEventListener('canplay', schedulePlay);
    video.addEventListener('stalled', schedulePlay);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pageshow', onPageShow);
    observer.observe(video);
    schedulePlay();

    return () => {
      cancelAnimationFrame(retryFrame);
      observer.disconnect();
      video.removeEventListener('loadeddata', schedulePlay);
      video.removeEventListener('canplay', schedulePlay);
      video.removeEventListener('stalled', schedulePlay);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  // The preloader may finish before the browser has begun playing the video.
  // Retry as soon as the hero is revealed, without resetting its position.
  useEffect(() => {
    if (!revealing) return;
    const video = videoRef.current;
    if (!video || !video.paused) return;
    const playback = video.play();
    playback?.catch(() => {});
  }, [revealing]);

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
