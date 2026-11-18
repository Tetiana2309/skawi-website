import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Header.css';

const links = [
  ['Головна', '#home'],
  ['Наші послуги', '#services'],
  ['Про нас', '#about'],
  ['Переваги', '#benefits'],
  ['Галерея', '#gallery'],
  ['Контакти', '#contacts'],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </nav>
      <LanguageSwitcher />
      <a className="hero-header__cta" href="#contacts">
        <span>ПОЧАТИ НАВЧАННЯ</span>
        <span className="hero-header__arrow" aria-hidden="true">
          <img className="hero-header__arrow-default" src={`${import.meta.env.BASE_URL}icons/cta-arrow.svg`} width="36" height="36" alt="" />
          <img className="hero-header__arrow-active" src={`${import.meta.env.BASE_URL}icons/cta-arrow-active.svg`} width="36" height="36" alt="" />
        </span>
      </a>
    </header>
  );
}
