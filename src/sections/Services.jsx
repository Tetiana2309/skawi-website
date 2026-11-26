import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Services.css';
import { translations } from '../data/translations.js';

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const pad = (n) => String(n).padStart(2, '0');

export default function Services({ copy, language }) {
  const services = copy.services;
  const root = useRef(null);
  const stage = useRef(null);
  const cards = useRef([]);
  const progressBar = useRef(null);
  const progressRef = useRef(0);
  const painter = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const last = services.length - 1;

  const paint = (progress, noMotion) => {
    // Sequential fades keep different slide copy from ever overlapping.
    // The old slide fades away before the new slide fades in.
    const from = Math.min(last, Math.floor(progress));
    const to = Math.min(last, from + 1);
    const fractional = clamp(progress - from, 0, 1);
    const smooth = (t) => t * t * (3 - 2 * t);
    const outgoing = noMotion
      ? (fractional < .5 ? 1 : 0)
      : 1 - smooth(clamp(fractional / .5, 0, 1));
    const incoming = noMotion
      ? (fractional >= .5 ? 1 : 0)
      : smooth(clamp((fractional - .5) / .5, 0, 1));

    for (let i = 0; i < services.length; i++) {
      const card = cards.current[i];
      if (!card) continue;

      const opacity = from === to
        ? (i === from ? 1 : 0)
        : i === from ? outgoing : i === to ? incoming : 0;
      card.style.opacity = String(opacity);
      card.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
    }

    if (progressBar.current) progressBar.current.style.width = ((progress + 1) / services.length * 100).toFixed(2) + '%';
    const nextActive = clamp(Math.round(progress), 0, last);
    if (nextActive !== activeRef.current) {
      activeRef.current = nextActive;
      setActive(nextActive);
    }
  };

  painter.current = paint;
  useLayoutEffect(() => { painter.current(progressRef.current, reduced); }, [reduced]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let raf = 0;
    let previousTime = 0;
    const distance = () => window.innerHeight * .9;
    const target = () => {
      if (!root.current) return 0;
      return clamp(-root.current.getBoundingClientRect().top / Math.max(1, distance()), 0, last);
    };
    const tick = (now) => {
      raf = 0;
      const dt = previousTime ? Math.min(.1, (now - previousTime) / 1000) : 1 / 60;
      previousTime = now;
      const goal = target();
      const rate = 3.6;
      // Lenis already eases the document scroll. Do not apply a second lag
      // on narrower desktops: it makes pinned content appear to judder.
      const desktop1440 = window.matchMedia('(min-width: 1101px) and (max-width: 1550px)').matches;
      const factor = (reduced || desktop1440) ? 1 : 1 - Math.exp(-dt * rate);
      const value = progressRef.current + (goal - progressRef.current) * factor;
      progressRef.current = Math.abs(goal - value) < .0005 ? goal : value;
      painter.current(progressRef.current, reduced);
      if (progressRef.current !== goal) raf = requestAnimationFrame(tick);
      else previousTime = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    progressRef.current = target();
    painter.current(progressRef.current, reduced);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
    };
  }, [last, reduced]);

  useEffect(() => {
    const section = root.current;
    const pinnedStage = stage.current;
    if (!section || !pinnedStage) return;

    // Fixed positioning avoids fractional-pixel movement of sticky text
    // while Lenis eases document scrolling on 1440px desktops.
    const breakpoint = window.matchMedia('(min-width: 1101px) and (max-width: 1550px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!breakpoint.matches) {
        pinnedStage.removeAttribute('data-pin');
        return;
      }

      const rect = section.getBoundingClientRect();
      const next = rect.top >= 0 ? 'before'
        : rect.bottom <= window.innerHeight ? 'after'
        : 'active';
      if (pinnedStage.dataset.pin !== next) pinnedStage.dataset.pin = next;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    breakpoint.addEventListener('change', schedule);

    return () => {
      cancelAnimationFrame(frame);
      pinnedStage.removeAttribute('data-pin');
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      breakpoint.removeEventListener('change', schedule);
    };
  }, []);

  const choose = (index) => {
    if (!root.current) return;
    const sectionStart = window.scrollY + root.current.getBoundingClientRect().top;
    window.scrollTo({ top: sectionStart + index * window.innerHeight * .9 + 1, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="services-scroll" id="services" ref={root} aria-label={copy.eyebrow}>
      <div className="services" ref={stage}>
        <div className="services__eyebrow">{copy.eyebrow}</div>
        <p className="services__quote">{copy.quote} <span>{copy.quoteAuthor}</span></p>

        <nav className="services__nav services__nav--left" aria-label="Оберіть напрям навчання">
          {services.map((service, i) => (
            <button key={service.left} type="button" className={`services__nav-item ${active === i ? 'is-active' : ''}`} onClick={() => choose(i)} aria-current={active === i ? 'true' : undefined} aria-label={`${service.left}. ${service.right}`}>
              <span className="services__indicator" aria-hidden="true" /><span>{service.left}</span>
            </button>
          ))}
        </nav>

        <div className="services__deck" aria-label="Програми навчання">
          {services.map((service, i) => (
            <article key={service.left} ref={node => { cards.current[i] = node; }} className="services__card" style={{ zIndex: i + 1, visibility: i === 0 ? 'visible' : 'hidden', opacity: i === 0 ? 1 : 0 }} aria-hidden={active !== i} inert={active !== i}>
              <div className="services__card-inner">
                {/* The Ukrainian copy defines the original geometry on every language. */}
                <div className="services__copy services__copy--reference" aria-hidden="true" inert>
                  <h2 className="services__title">{translations.UA.services[i].title}</h2>
                  <p className="services__description">{translations.UA.services[i].description}</p>
                  <ul className="services__benefits">
                    {translations.UA.services[i].benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                  </ul>
                </div>
                <div className="services__copy services__copy--translated">
                  <h2 className="services__title">{service.title}</h2>
                  <p className="services__description">{service.description}</p>
                  <ul className="services__benefits">
                    {service.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <nav className="services__nav services__nav--right" aria-label="Інші назви напрямів">
          {services.map((service, i) => (
            <button key={service.right} type="button" className={`services__nav-item ${active === i ? 'is-active' : ''}`} onClick={() => choose(i)} aria-current={active === i ? 'true' : undefined} aria-label={`${service.left}. ${service.right}`}>
              <span>{service.right}</span><span className="services__indicator" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="services__pagination" aria-label={`Напрям ${active + 1} із ${services.length}`}>
          <span className="services__page-number">{pad(active + 1)}</span>
          <div className="services__progress" aria-hidden="true"><span ref={progressBar} /></div>
          <span className="services__page-number">{pad(services.length)}</span>
        </div>
      </div>
    </section>
  );
}
