import './Logo.css';

export default function Logo() {
  return (
    <a className="brand-logo" href="#home" aria-label="SKAWI — на главную">
      <span className="brand-logo__word">SKAWI</span>
      <img
        className="brand-logo__emblem"
        src={`${import.meta.env.BASE_URL}images/logo.webp`}
        alt=""
        width="67"
        height="67"
      />
    </a>
  );
}
