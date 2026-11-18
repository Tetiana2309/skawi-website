import Header from '../components/Header.jsx';
import Logo from '../components/Logo.jsx';
import './Hero.css';

export default function Hero({ revealing = false }) {
  return (
    <section className={revealing ? "hero hero--revealing" : "hero hero--waiting"} id="home" aria-labelledby="hero-heading">
      <div className="hero__media" aria-hidden="true">
        <video className="hero__video" autoPlay muted loop playsInline preload="metadata">
          <source src={`${import.meta.env.BASE_URL}videos/video-hero.mp4`} type="video/mp4" />
        </video>
        <div className="hero__gradient" />
      </div>

      <div className="hero__top">
        <Logo />
        <Header />
      </div>

      <div className="hero__heading" id="hero-heading">
        <p className="hero__pretitle">Твоя Мова.</p>
        <h1>Твоя Свобода.</h1>
      </div>
    </section>
  );
}
