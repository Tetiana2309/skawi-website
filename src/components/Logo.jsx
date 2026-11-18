import './Logo.css';

export default function Logo() {
  return (
    <a className="brand-logo" href="#home" aria-label="SKAWI — на главную">
      <span className="brand-logo__word">SKAWI</span>
      <span className="brand-logo__emblem" aria-hidden="true">
        <span className="brand-logo__symbol">S</span>
      </span>
    </a>
  );
}
