import { useEffect, useRef, useState } from 'react';
import './Team.css';

const teachers = [
  {
    image: 'Teacher-Photo-Nazar.webp',
    name: 'Назар',
    role: 'Бакалавр польської філології  ·  4 роки досвіду викладання',
    description: 'Допомагає впевнено спілкуватися польською в повсякденних ситуаціях. Жива мова, практична лексика та навчання у комфортному темпі.',
    quote: '«Дві мови відкривають усі двері на твоєму шляху».',
    author: '— Френк Сміт',
  },
  {
    image: 'Teacher-Photo-Victoria.webp',
    name: 'Вікторія',
    role: 'Засновниця SKAWI  ·  магістр  ·  9 років досвіду викладання',
    description: 'Поєднує викладання з освітньою психологією. Допомагає легко засвоювати складне та перетворювати знання на впевнене спілкування.',
    quote: '«Освіта — це природний процес, що розвивається в самій людині».',
    author: '— Марія Монтессорі',
  },
  {
    image: 'Teacher-Photo-Ruslana.webp',
    name: 'Руслана',
    role: 'Магістр польської філології  ·  5 років досвіду викладання',
    description: 'Створює комфортну атмосферу для навчання, розвиває впевненість учнів і допомагає відкривати нові можливості у вивченні польської.',
    quote: '«Освіта — найпотужніша зброя, якою можна змінити світ».',
    author: '— Нельсон Мандела',
  },
];

const translations = {
  UA: {
    heading: 'наша команда',
    slogan: '«У КОЖНОГО СВІЙ ПІДХІД, АЛЕ СПІЛЬНА СПРАВА»',
    teachers,
  },
  PL: {
    heading: 'nasz zespół',
    slogan: '„KAŻDY MA WŁASNE PODEJŚCIE, ALE ŁĄCZY NAS WSPÓLNY CEL”',
    teachers: [
      { name: 'Nazar', role: 'Licencjat z filologii polskiej  ·  4 lata doświadczenia', description: 'Pomaga swobodnie mówić po polsku w codziennych sytuacjach. Żywy język, praktyczne słownictwo i nauka w komfortowym tempie.', quote: '„Dwa języki otwierają przed tobą wszystkie drzwi”.', author: '— Frank Smith' },
      { name: 'Wiktoria', role: 'Założycielka SKAWI  ·  magister  ·  9 lat doświadczenia', description: 'Łączy nauczanie z psychologią edukacji. Pomaga łatwo przyswajać trudne zagadnienia i zamieniać wiedzę w pewną komunikację.', quote: '„Edukacja jest naturalnym procesem, który rozwija się w człowieku”.', author: '— Maria Montessori' },
      { name: 'Rusłana', role: 'Magister filologii polskiej  ·  5 lat doświadczenia', description: 'Tworzy przyjazną atmosferę nauki, wzmacnia pewność siebie uczniów i pomaga odkrywać nowe możliwości w nauce polskiego.', quote: '„Edukacja to najpotężniejsza broń, którą można zmienić świat”.', author: '— Nelson Mandela' },
    ],
  },
  EN: {
    heading: 'our team',
    slogan: '“DIFFERENT APPROACHES, ONE SHARED PURPOSE”',
    teachers: [
      { name: 'Nazar', role: 'BA in Polish Philology  ·  4 years of teaching experience', description: 'Helps students speak Polish confidently in everyday situations. Real conversations, practical vocabulary and learning at a comfortable pace.', quote: '“Two languages open every door along your way.”', author: '— Frank Smith' },
      { name: 'Victoria', role: 'SKAWI founder  ·  Master’s degree  ·  9 years of experience', description: 'Combines language teaching with educational psychology. Makes complex topics easier and turns knowledge into confident communication.', quote: '“Education is a natural process carried out by the individual.”', author: '— Maria Montessori' },
      { name: 'Ruslana', role: 'MA in Polish Philology  ·  5 years of teaching experience', description: 'Creates a welcoming learning environment, builds students’ confidence and helps them discover new possibilities through Polish.', quote: '“Education is the most powerful weapon you can use to change the world.”', author: '— Nelson Mandela' },
    ],
  },
  SP: {
    heading: 'nuestro equipo',
    slogan: '«CADA UNO TIENE SU ENFOQUE, PERO COMPARTIMOS UN PROPÓSITO»',
    teachers: [
      { name: 'Nazar', role: 'Grado en Filología Polaca  ·  4 años de experiencia docente', description: 'Ayuda a hablar polaco con confianza en situaciones cotidianas. Conversaciones reales, vocabulario práctico y aprendizaje a tu ritmo.', quote: '«Dos idiomas te abren todas las puertas del camino».', author: '— Frank Smith' },
      { name: 'Victoria', role: 'Fundadora de SKAWI  ·  máster  ·  9 años de experiencia', description: 'Combina la enseñanza con la psicología educativa. Ayuda a comprender temas complejos y a transformar lo aprendido en comunicación segura.', quote: '«La educación es un proceso natural que se desarrolla en cada persona».', author: '— María Montessori' },
      { name: 'Ruslana', role: 'Máster en Filología Polaca  ·  5 años de experiencia', description: 'Crea un ambiente cómodo, refuerza la confianza de sus alumnos y les ayuda a descubrir nuevas posibilidades al aprender polaco.', quote: '«La educación es el arma más poderosa para cambiar el mundo».', author: '— Nelson Mandela' },
    ],
  },
  RU: {
    heading: 'наша команда',
    slogan: '«У КАЖДОГО СВОЙ ПОДХОД, НО ОБЩЕЕ ДЕЛО»',
    teachers: [
      { name: 'Назар', role: 'Бакалавр польской филологии  ·  4 года преподавания', description: 'Помогает уверенно говорить по-польски в повседневных ситуациях. Живой язык, практическая лексика и обучение в комфортном темпе.', quote: '«Два языка открывают все двери на твоём пути».', author: '— Фрэнк Смит' },
      { name: 'Виктория', role: 'Основательница SKAWI  ·  магистр  ·  9 лет преподавания', description: 'Совмещает преподавание с педагогической психологией. Помогает легко осваивать сложное и превращать знания в уверенное общение.', quote: '«Образование — естественный процесс, развивающийся в самом человеке».', author: '— Мария Монтессори' },
      { name: 'Руслана', role: 'Магистр польской филологии  ·  5 лет преподавания', description: 'Создаёт комфортную атмосферу обучения, развивает уверенность учеников и помогает открывать новые возможности в изучении польского.', quote: '«Образование — самое мощное оружие, которым можно изменить мир».', author: '— Нельсон Мандела' },
    ],
  },
};

const pad = (number) => String(number).padStart(2, '0');

export default function Team({ language = 'UA' }) {
  const copy = translations[language] ?? translations.UA;
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    let previousTime = 0;
    let displayedX = null;
    let startY = 0;
    let travelY = 1;
    let slideWidth = 1;
    let targetPosition = 0;
    let displayedPosition = null;

    const measure = () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!root || !stage || !track) return;
      startY = window.scrollY + root.getBoundingClientRect().top;
      travelY = Math.max(1, root.offsetHeight - stage.offsetHeight);
      slideWidth = stage.clientWidth;
    };

    const paint = (time) => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;

      const delta = previousTime ? Math.min(0.05, (time - previousTime) / 1000) : 1 / 60;
      previousTime = time;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const factor = reduceMotion ? 1 : 1 - Math.exp(-delta * 12);
      if (displayedPosition === null) displayedPosition = targetPosition;
      else displayedPosition += (targetPosition - displayedPosition) * factor;
      if (Math.abs(targetPosition - displayedPosition) < 0.0001) displayedPosition = targetPosition;

      // Move each teacher independently: the outgoing card leaves first,
      // then the incoming card enters. No opacity, fading or overlapping.
      const segment = Math.min(teachers.length - 2, Math.floor(displayedPosition));
      const progress = Math.max(0, Math.min(1, displayedPosition - segment));
      const ease = (value) => {
        const t = Math.max(0, Math.min(1, value));
        return t * t * (3 - 2 * t);
      };
      for (const [index, slide] of [...track.children].entries()) {
        let x = 0;
        let visible = false;
        if (index === segment) {
          x = -slideWidth * ease(progress / 0.56);
          visible = progress < 0.56;
        } else if (index === segment + 1) {
          x = slideWidth * (1 - ease((progress - 0.44) / 0.56));
          visible = progress > 0.44;
        }
        slide.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
        slide.style.visibility = visible ? 'visible' : 'hidden';
      }

      if (displayedPosition !== targetPosition) frame = window.requestAnimationFrame(paint);
      else previousTime = 0;
    };

    const update = () => {
      const progress = Math.max(0, Math.min(1, (window.scrollY - startY) / travelY));
      targetPosition = progress * (teachers.length - 1);
      const nextActive = Math.round(targetPosition);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const goToTeacher = (index) => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const destination = Math.max(0, Math.min(teachers.length - 1, index));
    const start = window.scrollY + root.getBoundingClientRect().top;
    const distance = Math.max(0, root.offsetHeight - stage.offsetHeight);
    window.scrollTo({
      top: start + distance * destination / (teachers.length - 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <section className="team-scroll" id="team" ref={rootRef} aria-label={copy.heading}>
      <div className="team" ref={stageRef}>
        <div className="team__topline">
          <span>{copy.heading}</span>
          <span>{copy.slogan}</span>
        </div>
        <div className="team__viewport" role="region" aria-roledescription="carousel" aria-label={copy.heading}>
          <div className="team__track" ref={trackRef}>
            {teachers.map((teacher, i) => {
              const localized = copy.teachers[i];
              return (
                <article className="team__slide" key={teacher.image} aria-hidden={i !== active} inert={i !== active}>
                  <div className="team__photo">
                    <img src={import.meta.env.BASE_URL + 'images/' + teacher.image} alt={localized.name} draggable="false" />
                  </div>
                  <div className="team__details">
                    <h2>{localized.name}</h2>
                    <p className="team__role">{localized.role}</p>
                    <p className="team__description">{localized.description}</p>
                  </div>
                  <figure className="team__quotation">
                    <blockquote>{localized.quote}</blockquote>
                    <figcaption>{localized.author}</figcaption>
                  </figure>
                </article>
              );
            })}
          </div>
        </div>
        <div className="team__controls">
          <div className="team__pagination" aria-label={pad(active + 1) + ' / ' + pad(teachers.length)}>
            <span>{pad(active + 1)}</span>
            <div className="team__progress">
              {teachers.map((teacher, i) => (
                <button
                  key={teacher.image}
                  type="button"
                  aria-label={'Slide ' + (i + 1)}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => goToTeacher(i)}
                  className={i <= active ? 'is-current' : ''}
                />
              ))}
            </div>
            <span>{pad(teachers.length)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
