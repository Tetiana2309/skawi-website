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

const TRANSITION_MS = 760;
const pad = (value) => String(value).padStart(2, '0');

function ServiceContent({ service, leaving = false, direction = 'forward' }) {
  return (
    <div
      className={`services__content ${leaving ? 'services__content--exit' : 'services__content--enter'} ${direction === 'backward' ? 'services__content--backward' : ''}`}
      aria-hidden={leaving || undefined}
    >
      <div className="services__text-mask">
        <h2 className="services__title">{service.title}</h2>
      </div>
      <div className="services__text-mask services__description-mask">
        <p className="services__description">{service.description}</p>
      </div>
      <ul className="services__benefits">
        {service.benefits.map((benefit, i) => (
          <li key={benefit} style={{ '--benefit-index': i }}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [direction, setDirection] = useState('forward');
  const timer = useRef(null);
  const current = useRef(0);
  const busy = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function choose(index) {
    if (busy.current || index === current.current || index < 0 || index >= services.length) return;
    const from = current.current;
    busy.current = true;
    current.current = index;
    setDirection(index > from ? 'forward' : 'backward');
    setPrevious(from);
    setActive(index);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPrevious(null);
      busy.current = false;
    }, TRANSITION_MS);
  }

  return (
    <section className="services" id="services" aria-label="Напрями навчання">
      <div className="services__eyebrow">напрями навчання</div>
      <p className="services__quote">“межі моєї мови — це межі мого світу” <span>— Людвіг Вітгенштайн</span></p>

      <nav className="services__nav services__nav--left" aria-label="Оберіть напрям навчання">
        {services.map((service, index) => (
          <button
            key={service.left}
            type="button"
            className={`services__nav-item ${active === index ? 'is-active' : ''}`}
            onClick={() => choose(index)}
            aria-current={active === index ? 'true' : undefined}
            aria-label={`${service.left}. ${service.right}`}
          >
            <span className="services__indicator" aria-hidden="true" />
            <span>{service.left}</span>
          </button>
        ))}
      </nav>

      <div className="services__center" aria-live="polite" aria-atomic="true">
        {previous !== null && <ServiceContent key={`old-${previous}`} service={services[previous]} leaving direction={direction} />}
        <ServiceContent key={active} service={services[active]} direction={direction} />
      </div>

      <nav className="services__nav services__nav--right" aria-label="Інші назви напрямів">
        {services.map((service, index) => (
          <button
            key={service.right}
            type="button"
            className={`services__nav-item ${active === index ? 'is-active' : ''}`}
            onClick={() => choose(index)}
            aria-current={active === index ? 'true' : undefined}
            aria-label={`${service.left}. ${service.right}`}
          >
            <span>{service.right}</span>
            <span className="services__indicator" aria-hidden="true" />
          </button>
        ))}
      </nav>

      <div className="services__pagination" aria-label={`Напрям ${active + 1} із ${services.length}`}>
        <span className="services__page-number">{pad(active + 1)}</span>
        <div className="services__progress" aria-hidden="true">
          <span style={{ width: `${((active + 1) / services.length) * 100}%` }} />
        </div>
        <span className="services__page-number">{pad(services.length)}</span>
      </div>
    </section>
  );
}
