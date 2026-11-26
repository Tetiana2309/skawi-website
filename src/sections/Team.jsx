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
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const wheelLock = useRef(false);

  const show = (index) => {
    setActive(Math.max(0, Math.min(teachers.length - 1, index)));
    setOffset(0);
  };
  const move = (direction) => show(active + direction);

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { id: event.pointerId, start: event.clientX };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    const delta = event.clientX - dragRef.current.start;
    const edge = (active === 0 && delta > 0) || (active === teachers.length - 1 && delta < 0);
    setOffset(edge ? delta * 0.22 : delta);
  };
  const finishDrag = (event) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    const delta = event.clientX - dragRef.current.start;
    const threshold = Math.min(140, (viewportRef.current?.clientWidth ?? 700) * 0.14);
    dragRef.current = null;
    setDragging(false);
    if (Math.abs(delta) > threshold) move(delta < 0 ? 1 : -1);
    else setOffset(0);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!viewportRef.current?.contains(document.activeElement)) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  return (
    <section className="team" id="team" aria-label={copy.heading}>
      <div className="team__topline">
        <span>{copy.heading}</span>
        <span>{copy.slogan}</span>
      </div>
      <div
        className="team__viewport"
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={copy.heading}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div className="team__track" style={{ transform: `translate3d(calc(${-active * 100}% + ${offset}px), 0, 0)`, transition: dragging ? 'none' : undefined }}>
          {teachers.map((teacher, i) => {
            const localized = copy.teachers[i];
            return (
              <article className="team__slide" key={teacher.image} aria-hidden={i !== active} inert={i !== active}>
                <div className="team__photo">
                  <img src={`${import.meta.env.BASE_URL}images/${teacher.image}`} alt={localized.name} draggable="false" />
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
        <div className="team__arrows">
          <button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label="Previous teacher">←</button>
          <button type="button" onClick={() => move(1)} disabled={active === teachers.length - 1} aria-label="Next teacher">→</button>
        </div>
        <div className="team__pagination" aria-label={`${pad(active + 1)} / ${pad(teachers.length)}`}>
          <span>{pad(active + 1)}</span>
          <div className="team__progress">
            {teachers.map((teacher, i) => (
              <button key={teacher.image} type="button" aria-label={`Slide ${i + 1}`} aria-current={i === active ? 'true' : undefined} onClick={() => show(i)} className={i <= active ? 'is-current' : ''} />
            ))}
          </div>
          <span>{pad(teachers.length)}</span>
        </div>
      </div>
    </section>
  );
}
