import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Services.css';

const services = [
  {
    left: 'Знаєш, чого очікувати',
    right: 'Легше впоратися з іспитом',
    title: 'Підготуйся до B1.',
    description: 'Складай іспит упевнено.',
    benefits: [
      'Підготовка до B1 у мінігрупах до 6 осіб.',
      'Розбір формату і типових завдань іспиту.',
      'Підтримка від першого заняття до іспиту.',
      'Наші учні успішно складають B1/B2.',
    ],
  },
  {
    left: 'Слова стають розмовами',
    right: 'А розмови відкривають можливості',
    title: 'Польська для життя та роботи',
    description: 'Розумієш польську, але складно говорити?',
    benefits: [
      'Комплексне навчання для життя в Польщі.',
      'Підготовка до співбесід і переговорів.',
      'Практика щоденного спілкування.',
      'Польська для роботи та командної взаємодії.',
    ],
  },
  {
    left: 'Чим ближче знайомишся з Польщею',
    right: 'Тим швидше почуваєшся своїм',
    title: 'Мова та адаптація',
    description: 'Адаптуйся до нового життя разом зі SKAWI.',
    benefits: [
      'Знайомство з мовою та культурою Польщі.',
      'Програми під індивідуальні потреби.',
      'Підготовка до іспитів із підтримкою.',
      'Допомога в мовній адаптації.',
    ],
  },
  {
    left: 'Тут усе починається з навчання',
    right: 'А продовжується спілкуванням',
    title: 'Більше ніж навчання',
    description: 'Відкривай більше можливостей зі SKAWI.',
    benefits: [
      'Клуб «Кайзерка» — розмовна практика без доплати для учнів.',
      'Бібліотечка SKAWI — книжки різними мовами.',
      'Нейробіка — розвиток уваги, реакції та мислення.',
      'Дитячі заняття — вивчення мови через гру.',
    ],
  },
];

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const pad = (n) => String(n).padStart(2, '0');

export default function Services() {
  const root = useRef(null);
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

  const choose = (index) => {
    if (!root.current) return;
    const sectionStart = window.scrollY + root.current.getBoundingClientRect().top;
    window.scrollTo({ top: sectionStart + index * window.innerHeight * .9 + 1, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="services-scroll" id="services" ref={root} aria-label="Напрями навчання">
      <div className="services">
        <div className="services__eyebrow">напрями навчання</div>
        <p className="services__quote">“межі моєї мови — це межі мого світу” <span>— Людвіг Вітгенштайн</span></p>

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
                <h2 className="services__title">{service.title}</h2>
                <p className="services__description">{service.description}</p>
                <ul className="services__benefits">
                  {service.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                </ul>
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
