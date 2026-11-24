import { useEffect, useRef, useState } from 'react';
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


const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (v) => String(v).padStart(2, '0');
const ease = (t) => t * t * (3 - 2 * t);

export default function Services() {
  const wrapper = useRef(null);
  const viewport = useRef(null);
  const raf = useRef(0);
  const last = useRef(0);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const active = Math.round(progress);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChange = () => setReduceMotion(media.matches);
    motionChange();
    media.addEventListener('change', motionChange);

    const measure = () => {
      raf.current = 0;
      if (!wrapper.current || !viewport.current) return;
      const maxScroll = Math.max(1, wrapper.current.offsetHeight - viewport.current.offsetHeight);
      const raw = clamp(-wrapper.current.getBoundingClientRect().top / maxScroll, 0, 1) * 3;
      const segment = Math.min(2, Math.floor(raw));
      const eased = segment + ease(clamp(raw - segment, 0, 1));
      if (Math.abs(eased - last.current) > .0002) {
        last.current = eased;
        setProgress(eased);
      }
    };
    const schedule = () => { if (!raf.current) raf.current = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', motionChange);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const choose = (index) => {
    if (!wrapper.current || !viewport.current) return;
    const start = window.scrollY + wrapper.current.getBoundingClientRect().top;
    const range = Math.max(0, wrapper.current.offsetHeight - viewport.current.offsetHeight);
    window.scrollTo({ top: start + index * range / 3, behavior: reduceMotion ? 'instant' : 'smooth' });
  };

  return (
    <section className="services-scroll" id="services" ref={wrapper} aria-label="Напрями навчання">
      <div className="services" ref={viewport}>
        <div className="services__eyebrow">напрями навчання</div>
        <p className="services__quote">“межі моєї мови — це межі мого світу” <span>— Людвіг Вітгенштайн</span></p>
        <nav className="services__nav services__nav--left" aria-label="Оберіть напрям навчання">
          {services.map((service, i) => (
            <button key={service.left} type="button" className={`services__nav-item ${active === i ? 'is-active' : ''}`} onClick={() => choose(i)} aria-current={active === i ? 'true' : undefined} aria-label={`${service.left}. ${service.right}`}>
              <span className="services__indicator" aria-hidden="true" /><span>{service.left}</span>
            </button>
          ))}
        </nav>
        <div className="services__center">
          {services.map((service, i) => {
            const diff = i - progress;
            const opacity = clamp(1 - Math.abs(diff), 0, 1);
            return (
              <div key={service.left} className="services__content services__content--scroll" aria-hidden={active !== i} inert={active !== i} style={{
                opacity,
                visibility: opacity < .001 ? 'hidden' : 'visible',
                transform: `translate3d(0, ${reduceMotion ? 0 : clamp(diff, -1, 1) * 70}px, 0)`,
              }}>
                <div className="services__text-mask"><h2 className="services__title">{service.title}</h2></div>
                <div className="services__text-mask services__description-mask"><p className="services__description">{service.description}</p></div>
                <ul className="services__benefits">{service.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
              </div>
            );
          })}
        </div>
        <nav className="services__nav services__nav--right" aria-label="Інші назви напрямів">
          {services.map((service, i) => (
            <button key={service.right} type="button" className={`services__nav-item ${active === i ? 'is-active' : ''}`} onClick={() => choose(i)} aria-current={active === i ? 'true' : undefined} aria-label={`${service.left}. ${service.right}`}>
              <span>{service.right}</span><span className="services__indicator" aria-hidden="true" />
            </button>
          ))}
        </nav>
        <div className="services__pagination" aria-label={`Напрям ${active + 1} із 4`}>
          <span className="services__page-number">{pad(active + 1)}</span>
          <div className="services__progress" aria-hidden="true"><span style={{ width: `${(progress + 1) * 25}%` }} /></div>
          <span className="services__page-number">04</span>
        </div>
      </div>
    </section>
  );
}
