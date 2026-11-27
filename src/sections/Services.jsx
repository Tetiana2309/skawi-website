import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Services.css';

const ukrainianServices = [
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


// Only text changes with the selected language; original CSS and animations are shared.
const serviceTranslations = {
  "PL": {
    "eyebrow": "Kierunki nauki",
    "quote": "„Granice mojego języka oznaczają granice mojego świata”",
    "author": "— Ludwig Wittgenstein",
    "services": [
      {
        "left": "Wiesz, czego się spodziewać",
        "right": "Łatwiej zdać egzamin",
        "title": "Przygotuj się do B1.",
        "description": "Podejdź do egzaminu z pewnością siebie.",
        "benefits": [
          "Przygotowanie do B1 w małych grupach do 6 osób.",
          "Omówienie formatu i typowych zadań egzaminacyjnych.",
          "Wsparcie od pierwszych zajęć aż do egzaminu.",
          "Nasi uczniowie z powodzeniem zdają B1/B2."
        ]
      },
      {
        "left": "Słowa stają się rozmowami",
        "right": "A rozmowy otwierają możliwości",
        "title": "Polski do życia i pracy",
        "description": "Rozumiesz polski, ale trudno Ci mówić?",
        "benefits": [
          "Kompleksowa nauka do życia w Polsce.",
          "Przygotowanie do rozmów kwalifikacyjnych i negocjacji.",
          "Ćwiczenie codziennej komunikacji.",
          "Polski do pracy i współpracy w zespole."
        ]
      },
      {
        "left": "Im lepiej poznajesz Polskę",
        "right": "Tym szybciej czujesz się jak u siebie",
        "title": "Język i adaptacja",
        "description": "Odnajdź się w nowym życiu ze SKAWI.",
        "benefits": [
          "Poznawanie języka i kultury Polski.",
          "Programy dopasowane do indywidualnych potrzeb.",
          "Przygotowanie do egzaminów ze wsparciem.",
          "Pomoc w adaptacji językowej."
        ]
      },
      {
        "left": "Tu wszystko zaczyna się od nauki",
        "right": "A trwa dalej dzięki rozmowom",
        "title": "Więcej niż nauka",
        "description": "Odkrywaj więcej możliwości ze SKAWI.",
        "benefits": [
          "Klub „Kajzerka” — bezpłatne konwersacje dla uczniów.",
          "Biblioteczka SKAWI — książki w różnych językach.",
          "Neurobik — rozwój uwagi, refleksu i myślenia.",
          "Zajęcia dla dzieci — nauka języka przez zabawę."
        ]
      }
    ]
  },
  "EN": {
    "eyebrow": "Learning paths",
    "quote": "“The limits of my language mean the limits of my world”",
    "author": "— Ludwig Wittgenstein",
    "services": [
      {
        "left": "Know what to expect",
        "right": "Make the exam easier",
        "title": "Get ready for B1.",
        "description": "Take your exam with confidence.",
        "benefits": [
          "B1 preparation in small groups of up to 6 people.",
          "A clear look at the exam format and typical tasks.",
          "Support from your first lesson through exam day.",
          "Our students successfully pass B1/B2 exams."
        ]
      },
      {
        "left": "Words become conversations",
        "right": "And conversations open doors",
        "title": "Polish for life and work",
        "description": "Understand Polish but find speaking difficult?",
        "benefits": [
          "Practical Polish for everyday life in Poland.",
          "Preparation for interviews and negotiations.",
          "Everyday conversation practice.",
          "Polish for work and team communication."
        ]
      },
      {
        "left": "The more you discover Poland",
        "right": "The sooner you feel at home",
        "title": "Language and adaptation",
        "description": "Settle into your new life with SKAWI.",
        "benefits": [
          "Explore the Polish language and culture.",
          "Programs tailored to individual needs.",
          "Supported preparation for language exams.",
          "Help adapting through language."
        ]
      },
      {
        "left": "It all begins with learning",
        "right": "And continues with conversation",
        "title": "More than learning",
        "description": "Discover more opportunities with SKAWI.",
        "benefits": [
          "Kajzerka Club — free speaking practice for students.",
          "SKAWI library — books in different languages.",
          "Neurobics — build focus, reflexes and thinking skills.",
          "Kids' classes — learning languages through play."
        ]
      }
    ]
  },
  "SP": {
    "eyebrow": "Programas de aprendizaje",
    "quote": "«Los límites de mi lenguaje son los límites de mi mundo»",
    "author": "— Ludwig Wittgenstein",
    "services": [
      {
        "left": "Sabes qué esperar",
        "right": "El examen resulta más fácil",
        "title": "Prepárate para el B1.",
        "description": "Haz el examen con confianza.",
        "benefits": [
          "Preparación para el B1 en grupos de hasta 6 personas.",
          "Explicación del formato y las tareas habituales del examen.",
          "Apoyo desde la primera clase hasta el examen.",
          "Nuestros alumnos aprueban los exámenes B1/B2."
        ]
      },
      {
        "left": "Las palabras se vuelven conversaciones",
        "right": "Y las conversaciones abren oportunidades",
        "title": "Polaco para la vida y el trabajo",
        "description": "¿Entiendes polaco, pero te cuesta hablar?",
        "benefits": [
          "Aprendizaje práctico para vivir en Polonia.",
          "Preparación para entrevistas y negociaciones.",
          "Práctica de la comunicación cotidiana.",
          "Polaco para el trabajo y la colaboración en equipo."
        ]
      },
      {
        "left": "Cuanto más conoces Polonia",
        "right": "Antes te sientes como en casa",
        "title": "Idioma y adaptación",
        "description": "Adáptate a tu nueva vida con SKAWI.",
        "benefits": [
          "Descubre el idioma y la cultura de Polonia.",
          "Programas adaptados a tus necesidades.",
          "Preparación para exámenes con acompañamiento.",
          "Apoyo para adaptarte a través del idioma."
        ]
      },
      {
        "left": "Todo empieza con el aprendizaje",
        "right": "Y continúa con las conversaciones",
        "title": "Más que aprender",
        "description": "Descubre más oportunidades con SKAWI.",
        "benefits": [
          "Club «Kajzerka»: conversación gratuita para alumnos.",
          "Biblioteca SKAWI: libros en distintos idiomas.",
          "Neuróbica: mejora la atención, los reflejos y el pensamiento.",
          "Clases infantiles: aprender idiomas jugando."
        ]
      }
    ]
  },
  "RU": {
    "eyebrow": "Направления обучения",
    "quote": "«Границы моего языка означают границы моего мира»",
    "author": "— Людвиг Витгенштейн",
    "services": [
      {
        "left": "Знаешь, чего ожидать",
        "right": "Легче справиться с экзаменом",
        "title": "Подготовься к B1.",
        "description": "Сдавай экзамен уверенно.",
        "benefits": [
          "Подготовка к B1 в мини-группах до 6 человек.",
          "Разбор формата и типовых заданий экзамена.",
          "Поддержка от первого занятия до экзамена.",
          "Наши ученики успешно сдают B1/B2."
        ]
      },
      {
        "left": "Слова становятся разговорами",
        "right": "А разговоры открывают возможности",
        "title": "Польский для жизни и работы",
        "description": "Понимаешь польский, но сложно говорить?",
        "benefits": [
          "Комплексное обучение для жизни в Польше.",
          "Подготовка к собеседованиям и переговорам.",
          "Практика повседневного общения.",
          "Польский для работы и командного взаимодействия."
        ]
      },
      {
        "left": "Чем ближе знакомишься с Польшей",
        "right": "Тем быстрее чувствуешь себя своим",
        "title": "Язык и адаптация",
        "description": "Адаптируйся к новой жизни со SKAWI.",
        "benefits": [
          "Знакомство с языком и культурой Польши.",
          "Программы под индивидуальные потребности.",
          "Подготовка к экзаменам с поддержкой.",
          "Помощь в языковой адаптации."
        ]
      },
      {
        "left": "Здесь всё начинается с обучения",
        "right": "А продолжается общением",
        "title": "Больше чем обучение",
        "description": "Открывай новые возможности со SKAWI.",
        "benefits": [
          "Клуб «Кайзерка» — бесплатная разговорная практика для учеников.",
          "Библиотека SKAWI — книги на разных языках.",
          "Нейробика — развитие внимания, реакции и мышления.",
          "Занятия для детей — изучение языка через игру."
        ]
      }
    ]
  }
};

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const pad = (n) => String(n).padStart(2, '0');

export default function Services({ language = 'UA' }) {
  const translation = serviceTranslations[language];
  const services = translation?.services ?? ukrainianServices;
  const root = useRef(null);
  const stage = useRef(null);
  const cards = useRef([]);
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
    <section className="services-scroll" id="services" ref={root} aria-label={translation?.eyebrow ?? "Напрями навчання"}>
      <div className="services" ref={stage}>
        <div className="services__eyebrow">{translation?.eyebrow ?? "напрями навчання"}</div>
        <p className="services__quote">{translation?.quote ?? "“межі моєї мови — це межі мого світу”"} <span>{translation?.author ?? "— Людвіг Вітгенштайн"}</span></p>

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
          <div className="services__progress" aria-label="Вибір напрямку навчання">
            {services.map((service, i) => (
              <button key={i} type="button"
                aria-label={`Напрям ${i + 1}`}
                aria-current={active === i ? 'true' : undefined}
                className={i <= active ? 'is-current' : ''}
                onClick={() => choose(i)}
              />
            ))}
          </div>
          <span className="services__page-number">{pad(services.length)}</span>
        </div>
      </div>
    </section>
  );
}
