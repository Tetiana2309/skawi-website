import { useEffect, useRef, useState } from 'react';
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

export default function Hero({ revealing = false }) {
  const videoRef = useRef(null);
  const [language, setLanguage] = useState('UA');

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
        <Header language={language} onLanguageChange={setLanguage} />
      </div>

      <div className="hero__heading" id="hero-heading">
        <p className="hero__pretitle">{heroTitles[language][0]}</p>
        <h1>{heroTitles[language][1]}</h1>
      </div>
    </section>
  );
}
