import { useEffect, useState } from 'react';
import './Preloader.css';

const SPIN_DURATION_MS = 3000;
const REVEAL_DURATION_MS = 850;

export default function Preloader() {
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spinTime = prefersReducedMotion ? 150 : SPIN_DURATION_MS;
    const revealTime = prefersReducedMotion ? 150 : REVEAL_DURATION_MS;

    const reveal = window.setTimeout(() => setPhase('revealing'), spinTime);
    const finish = window.setTimeout(() => setPhase('hidden'), spinTime + revealTime);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(finish);
    };
  }, []);

  if (phase === 'hidden') return null;

  const logoPath = `${import.meta.env.BASE_URL}images/logo.webp`;

  return (
    <div
      className={`skawi-preloader ${phase === 'revealing' ? 'skawi-preloader--revealing' : ''}`}
      role="status"
      aria-label="SKAWI загружается"
    >
      <div className="skawi-preloader__scene" aria-hidden="true">
        <div className="skawi-preloader__coin">
          <img className="skawi-preloader__face skawi-preloader__face--front" src={logoPath} alt="" width="220" height="220" />
          <img className="skawi-preloader__face skawi-preloader__face--back" src={logoPath} alt="" width="220" height="220" />
        </div>
      </div>
    </div>
  );
}
