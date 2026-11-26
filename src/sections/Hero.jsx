import { useEffect, useLayoutEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import Logo from '../components/Logo.jsx';
import './Hero.css';

export default function Hero({ revealing = false, copy, language, onLanguageChange }) {
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    let cancelled = false;
    const fitTitle = () => {
      if (cancelled) return;
      title.style.fontSize = '';
      const naturalSize = parseFloat(window.getComputedStyle(title).fontSize);
      const availableWidth = Math.max(0, window.innerWidth - 80);
      const actualWidth = title.scrollWidth;
      if (actualWidth > availableWidth && naturalSize > 0) {
        title.style.fontSize = `${Math.floor(naturalSize * availableWidth / actualWidth * 100) / 100}px`;
      }
    };
    fitTitle();
    window.addEventListener('resize', fitTitle);
    document.fonts?.ready.then(fitTitle);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', fitTitle);
    };
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const playback = video.play();
        playback?.catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.01 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={revealing ? "hero hero--revealing" : "hero hero--waiting"} id="home" aria-labelledby="hero-heading">
      <div className="hero__media" aria-hidden="true">
        <video ref={videoRef} className="hero__video" autoPlay muted loop playsInline preload="metadata">
          <source src={`${import.meta.env.BASE_URL}videos/video-hero.mp4`} type="video/mp4" />
        </video>
        <div className="hero__gradient" />
      </div>

      <div className="hero__top">
        <Logo />
        <Header copy={copy} language={language} onLanguageChange={onLanguageChange} />
      </div>

      <div className="hero__heading" id="hero-heading">
        <p className="hero__pretitle">{copy.hero[0]}</p>
        <h1 ref={titleRef}>{copy.hero[1]}</h1>
      </div>
    </section>
  );
}
