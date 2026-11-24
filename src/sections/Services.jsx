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
    title: 'Говори вільніше.',
    description: 'Польська для життя та роботи.',
    benefits: [
      'Практика живого спілкування польською.',
      'Мова для повсякденних ситуацій.',
      'Підготовка до розмов і співбесід.',
      'Більше впевненості у спілкуванні.',
    ],
  },
  {
    left: 'Чим ближче знайомишся з Польщею',
    right: 'Тим швидше почуваєшся своїм',
    title: 'Відчуй себе своїм.',
    description: 'Мова, знайомства та адаптація.',
    benefits: [
      'Знайомство з мовою і культурою Польщі.',
      'Спілкування у щоденних ситуаціях.',
      'Підтримка на шляху до адаптації.',
      'Нові знайомства та відчуття спільноти.',
    ],
  },
  {
    left: 'Тут усе починається з навчання',
    right: 'А продовжується спілкуванням',
    title: 'Зростай разом з нами.',
    description: 'Навчання, яке об’єднує.',
    benefits: [
      'Навчання через практику та діалог.',
      'Зрозумілі пояснення й живі приклади.',
      'Комфортна атмосфера на заняттях.',
      'Можливість практикувати мову разом.',
    ],
  },
];



const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const pad = (n) => String(n).padStart(2, '0');
const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
    for (let i = 0; i < services.length; i++) {
      const card = cards.current[i];
      if (!card) continue;
      const relative = progress - i;
      let clip = 'inset(0 0 0 0 round 18px)';
      let transform = '';
      let dim = 0;
      let visibility = 'visible';

      if (relative <= -1) {
        visibility = 'hidden';
      } else if (relative < 0) {
        const t = noMotion ? (relative >= -.5 ? 1 : 0) : ease(relative + 1);
        clip = noMotion ? 'inset(0 0 0 0 round 18px)' : 'inset(' + (100 * (1 - t)).toFixed(2) + '% 0 0 0 round 18px)';
        transform = noMotion ? '' : 'translate3d(0,' + ((1 - t) * 8).toFixed(2) + '%,0)';
        if (noMotion && t === 0) visibility = 'hidden';
      } else {
        const depth = Math.min(relative, 2);
        transform = noMotion ? '' : 'perspective(1300px) translate3d(0,' + (-18 * depth).toFixed(2) + 'px,0) rotateX(' + (7 * depth).toFixed(2) + 'deg) scale(' + (1 - .055 * depth).toFixed(4) + ')';
        dim = noMotion ? 0 : Math.min(.4, depth * .21);
        if (relative > 2.5) visibility = 'hidden';
      }

      card.style.visibility = visibility;
      card.style.clipPath = clip;
      card.style.transform = transform || 'translate3d(0,0,0)';
      card.style.setProperty('--services-dim', dim.toFixed(3));
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
      const rate = 7.5;
      const factor = reduced ? 1 : 1 - Math.exp(-dt * rate);
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
            <article key={service.left} ref={node => { cards.current[i] = node; }} className="services__card" style={{ zIndex: i + 1, visibility: i === 0 ? 'visible' : 'hidden' }} aria-hidden={active !== i} inert={active !== i}>
              <div className="services__card-shade" aria-hidden="true" />
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
