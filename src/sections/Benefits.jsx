import { useEffect, useRef, useState } from 'react';
import './Benefits.css';

const copy = {
  UA: {
    heading: 'Навчання, створене для тебе', quote: '“Ми віримо в людей”', signature: 'Філософія SKAWI',
    intro: 'Кожен здатен опанувати польську мову. Важливо знайти свій шлях, отримати належну підтримку та мати можливість рухатися до власної мети.', motto: '“У тебе все вийде”',
    cards: [
      ['Гнучкий графік', 'Обирай зручний час занять, який легко поєднати з роботою та особистим життям.'],
      ['Сучасна програма', 'Актуальні теми, жива мова та максимум практики для реальних ситуацій.'],
      ['Обирай свій формат', 'Онлайн, у школі або індивідуально — обирай формат занять, який відповідає твоєму ритму життя.'],
      ['Зручне розташування', 'Навчайся у Лодзі за адресою ul. Łagiewnicka 54/56. Зручний доїзд громадським транспортом.'],
    ],
  },
  RU: {
    heading: 'Обучение, созданное для тебя', quote: '«Мы верим в людей»', signature: 'Философия SKAWI',
    intro: 'Каждый способен освоить польский язык. Важно найти свой путь, получить необходимую поддержку и иметь возможность двигаться к своей цели.', motto: '«У тебя всё получится»',
    cards: [['Гибкий график', 'Выбирай удобное время занятий, которое легко совмещать с работой и личной жизнью.'], ['Современная программа', 'Актуальные темы, живой язык и максимум практики для реальных ситуаций.'], ['Выбирай свой формат', 'Онлайн, в школе или индивидуально — выбирай формат занятий, который соответствует твоему ритму жизни.'], ['Удобное расположение', 'Учись в Лодзи по адресу ul. Łagiewnicka 54/56. Удобно добираться общественным транспортом.']],
  },
  EN: {
    heading: 'Learning designed for you', quote: '“We believe in people”', signature: 'SKAWI philosophy',
    intro: 'Everyone can learn Polish. What matters is finding your own path, getting the right support and being able to move towards your goal.', motto: '“You can do it”',
    cards: [['Flexible schedule', 'Choose lesson times that fit easily around work and your personal life.'], ['Modern programme', 'Relevant topics, everyday language and plenty of practice for real situations.'], ['Choose your format', 'Online, at school or one-to-one — choose the format that fits your pace of life.'], ['Convenient location', 'Study in Łódź at ul. Łagiewnicka 54/56, easily accessible by public transport.']],
  },
  PL: {
    heading: 'Nauka stworzona dla Ciebie', quote: '„Wierzymy w ludzi”', signature: 'Filozofia SKAWI',
    intro: 'Każdy może opanować język polski. Ważne jest, aby znaleźć własną drogę, otrzymać odpowiednie wsparcie i móc dążyć do swojego celu.', motto: '„Dasz sobie radę”',
    cards: [['Elastyczny grafik', 'Wybierz godziny zajęć, które łatwo pogodzisz z pracą i życiem prywatnym.'], ['Nowoczesny program', 'Aktualne tematy, żywy język i dużo praktyki w rzeczywistych sytuacjach.'], ['Wybierz swój format', 'Online, w szkole lub indywidualnie — wybierz format dopasowany do Twojego rytmu życia.'], ['Dogodna lokalizacja', 'Ucz się w Łodzi przy ul. Łagiewnickiej 54/56. Wygodny dojazd komunikacją miejską.']],
  },
  SP: {
    heading: 'Aprendizaje pensado para ti', quote: '«Creemos en las personas»', signature: 'Filosofía SKAWI',
    intro: 'Todos pueden aprender polaco. Lo importante es encontrar tu propio camino, recibir el apoyo adecuado y poder avanzar hacia tu objetivo.', motto: '«Tú puedes lograrlo»',
    cards: [['Horario flexible', 'Elige un horario de clases que puedas compaginar con el trabajo y tu vida personal.'], ['Programa moderno', 'Temas actuales, lenguaje cotidiano y mucha práctica para situaciones reales.'], ['Elige tu formato', 'En línea, en la escuela o individualmente: elige el formato que se adapte a tu ritmo de vida.'], ['Ubicación conveniente', 'Estudia en Łódź, ul. Łagiewnicka 54/56, con fácil acceso en transporte público.']],
  },
};
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const ease = t => t * t * (3 - 2 * t);
const number = i => String(i + 1).padStart(2, '0');
const photo = import.meta.env.BASE_URL + 'images/Benefits-Content.webp';

export default function Benefits({ language = 'UA' }) {
  const data = copy[language] ?? copy.UA;
  const root = useRef(null);
  const stage = useRef(null);
  const cards = useRef([]);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = root.current;
    const sticky = stage.current;
    if (!section || !sticky) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    const goal = () => {
      const travel = section.offsetHeight - sticky.offsetHeight;
      if (travel <= 0) return 0;
      // Leave a short hold at the beginning and end of the pinned sequence.
      const fraction = clamp(-section.getBoundingClientRect().top / travel, 0, 1);
      return clamp((fraction - .07) / .86 * 3, 0, 3);
    };
    const paint = p => {
      const index = motion.matches ? clamp(Math.round(p), 0, 3) : clamp(Math.floor(p + .001), 0, 3);
      cards.current.forEach((el, i) => {
        if (!el) return;
        const d = p - i;
        let opacity = 0, reveal = 1, scale = 1, dim = 0;
        if (motion.matches) {
          opacity = i === index ? 1 : 0;
        } else if (d > -1 && d < 0) {
          reveal = ease(d + 1);
          opacity = 1;
        } else if (d >= 0 && d < 1) {
          const t = ease(d);
          scale = 1 - .025 * t;
          dim = .06 * t;
          opacity = 1 - ease(clamp((d - .72) / .28, 0, 1));
        }
        el.style.visibility = opacity > 0 && reveal > 0 ? 'visible' : 'hidden';
        el.style.opacity = String(opacity);
        el.style.transform = 'scale(' + scale + ')';
        el.style.setProperty('--benefit-inverse-scale', String(1 / scale));
        el.style.setProperty('--benefit-reveal', ((1 - reveal) * 100).toFixed(3) + '%');
        el.style.setProperty('--benefit-dim', String(dim));
        // Keep the incoming text intact as the surface reveals it.
        // Fade only the outgoing copy before the next card covers it.
        el.style.setProperty('--benefit-copy-opacity', String(motion.matches || d < 0 ? 1 : 1 - ease(clamp((d - .25) / .35, 0, 1))));
      });
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
      }
    };
    const tick = now => {
      frame = 0;
      const target = goal();
      const dt = previous ? Math.min(.05, (now - previous) / 1000) : 1 / 60;
      previous = now;
      const next = motion.matches ? target : progressRef.current + (target - progressRef.current) * (1 - Math.exp(-dt * 12));
      progressRef.current = Math.abs(next - target) < .001 ? target : next;
      paint(progressRef.current);
      if (progressRef.current !== target) frame = requestAnimationFrame(tick);
      else previous = 0;
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };
    progressRef.current = goal();
    paint(progressRef.current);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    motion.addEventListener('change', wake);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      motion.removeEventListener('change', wake);
    };
  }, []);

  return (
    <section className="benefits-scroll" id="benefits" ref={root} aria-labelledby="benefits-heading">
      <div className="benefits" ref={stage}>
        <div className="benefits__upper">
          <div className="benefits__left">
            <img className="benefits__photo" src={photo} alt="" loading="lazy" decoding="async" />
            <h2 className="benefits__heading" id="benefits-heading">{data.heading}</h2>
            <div className="benefits__deck">
              {data.cards.map(([title, description], i) => (
                <article key={i} ref={el => { cards.current[i] = el; }} className="benefits__card" style={{ zIndex: i + 1 }} aria-hidden={i !== active}>
                  <div className="benefits__card-surface">
                    <img className="benefits__card-photo" src={photo} alt="" loading="lazy" decoding="async" aria-hidden="true" />
                    <div className="benefits__card-tint" aria-hidden="true" />
                    <div className="benefits__card-copy">
                      <div className="benefits__card-number">{number(i)}</div>
                      <div className="benefits__card-line" aria-hidden="true" />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                    <div className="benefits__card-dim" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="benefits__right">
            <div className="benefits__quote"><span>{data.quote}</span><i aria-hidden="true" /><em>{data.signature}</em></div>
            <p className="benefits__intro">{data.intro}</p>
          </div>
        </div>
        <div className="benefits__banner">
          <div className="benefits__pagination" aria-label={number(active) + ' / 04'}>
            <span>{number(active)}</span>
            <div className="benefits__segments" aria-hidden="true">{data.cards.map((_, i) => <i key={i} className={i <= active ? 'is-filled' : ''} />)}</div>
            <span>04</span>
          </div>
          <p className="benefits__motto">{data.motto}</p>
        </div>
      </div>
    </section>
  );
}
