import { useLayoutEffect, useRef, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Header.css';

const linkTargets = ['#home', '#services', '#about', '#benefits', '#gallery', '#contacts'];

export default function Header({ copy, language, onLanguageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = copy.nav.map((label, i) => [label, linkTargets[i]]);
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
  }, [copy.start]);

  return (
    <header className="hero-header">
      <button
        className="hero-header__toggle"
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="skawi-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span /><span /><span />
      </button>
      <nav id="skawi-navigation" className={menuOpen ? 'hero-header__nav is-open' : 'hero-header__nav'} aria-label="Основная навигация">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </nav>
      <LanguageSwitcher active={language} onChange={onLanguageChange} />
      <a className="hero-header__cta" href="#contacts" ref={ctaRef}>
        <span className="hero-header__cta-label" ref={labelRef}>{copy.start}</span>
        <span className="hero-header__arrow" aria-hidden="true" ref={arrowRef}>
          <img className="hero-header__arrow-default" src={`${import.meta.env.BASE_URL}icons/cta-arrow.svg`} width="36" height="36" alt="" />
          <img className="hero-header__arrow-active" src={`${import.meta.env.BASE_URL}icons/cta-arrow-active.svg`} width="36" height="36" alt="" />
        </span>
      </a>
    </header>
  );
}
