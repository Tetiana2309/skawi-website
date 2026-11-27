import { useLayoutEffect, useRef, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Header.css';

const navigationTargets = ['#home', '#services', '#about', '#gallery', '#benefits', '#contacts'];

const headerTranslations = {
  UA: {
    nav: ['Головна', 'Наші послуги', 'Про нас', 'Галерея', 'Переваги', 'Контакти'],
    cta: 'ПОЧАТИ НАВЧАННЯ',
  },
  PL: {
    nav: ['Główna', 'Nasze usługi', 'O nas', 'Galeria', 'Zalety', 'Kontakt'],
    cta: 'ROZPOCZNIJ NAUKĘ',
  },
  EN: {
    nav: ['Home', 'Our services', 'About us', 'Gallery', 'Benefits', 'Contact'],
    cta: 'START LEARNING',
  },
  SP: {
    nav: ['Inicio', 'Nuestros servicios', 'Sobre nosotros', 'Galería', 'Ventajas', 'Contacto'],
    cta: 'EMPEZAR A APRENDER',
  },
  RU: {
    nav: ['Главная', 'Наши услуги', 'О нас', 'Галерея', 'Преимущества', 'Контакты'],
    cta: 'НАЧАТЬ ОБУЧЕНИЕ',
  },
};

export default function Header({ language = 'UA', onLanguageChange, onSectionNavigate }) {
  const copy = headerTranslations[language] ?? headerTranslations.UA;
  const [menuOpen, setMenuOpen] = useState(false);
  const ctaRef = useRef(null);
  const labelRef = useRef(null);
  const arrowRef = useRef(null);

  useLayoutEffect(() => {
    const button = ctaRef.current;
    const label = labelRef.current;
    const arrow = arrowRef.current;
    if (!button || !label || !arrow) return;

    const updateSwapDistance = () => {
      const style = window.getComputedStyle(button);
      const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const usableWidth = button.clientWidth - horizontalPadding;
      button.style.setProperty('--cta-label-travel', `${usableWidth - label.offsetWidth}px`);
      button.style.setProperty('--cta-arrow-travel', `${-(usableWidth - arrow.offsetWidth)}px`);
    };

    updateSwapDistance();
    const observer = new ResizeObserver(updateSwapDistance);
    observer.observe(button);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="hero-header">
      <button
        className="hero-header__toggle"
        type="button"
        aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={menuOpen}
        aria-controls="skawi-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span /><span /><span />
      </button>
      <nav id="skawi-navigation" className={menuOpen ? 'hero-header__nav is-open' : 'hero-header__nav'} aria-label="Основная навигация">
        {navigationTargets.map((href, index) => (
          <a key={href} href={href} onClick={(event) => {
            setMenuOpen(false);
            if ((href === '#services' || href === '#about' || href === '#gallery') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
              event.preventDefault();
              onSectionNavigate?.(href);
            }
          }}>{copy.nav[index]}</a>
        ))}
      </nav>
      <LanguageSwitcher active={language} onChange={onLanguageChange} />
      <a className="hero-header__cta" href="#contacts" ref={ctaRef}>
        <span className="hero-header__cta-label" ref={labelRef}>{copy.cta}</span>
        <span className="hero-header__arrow" aria-hidden="true" ref={arrowRef}>
          <img className="hero-header__arrow-default" src={`${import.meta.env.BASE_URL}icons/cta-arrow.svg`} width="36" height="36" alt="" />
          <img className="hero-header__arrow-active" src={`${import.meta.env.BASE_URL}icons/cta-arrow-active.svg`} width="36" height="36" alt="" />
        </span>
      </a>
    </header>
  );
}
