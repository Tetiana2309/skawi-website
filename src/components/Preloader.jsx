import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

const SPIN_DURATION_MS = 3000;
const REVEAL_DURATION_MS = 850;
const MAX_WAIT_MS = 6500;

export default function Preloader({ onReveal, videoReady = false }) {
  const [phase, setPhase] = useState('loading');

  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [deadlineElapsed, setDeadlineElapsed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimum = window.setTimeout(() => setMinimumElapsed(true), reduced ? 150 : SPIN_DURATION_MS);
    const deadline = window.setTimeout(() => setDeadlineElapsed(true), reduced ? 150 : MAX_WAIT_MS);
    return () => {
      window.clearTimeout(minimum);
      window.clearTimeout(deadline);
    };
  }, []);

  useEffect(() => {
    if (!minimumElapsed || (!videoReady && !deadlineElapsed)) return;
    if (!started.current) {
      started.current = true;
      setPhase('revealing');
      onReveal?.();
    }
  }, [minimumElapsed, videoReady, deadlineElapsed, onReveal]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = window.setTimeout(() => setPhase('hidden'), reduced ? 150 : REVEAL_DURATION_MS);
    return () => window.clearTimeout(finish);
  }, [phase]);

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
