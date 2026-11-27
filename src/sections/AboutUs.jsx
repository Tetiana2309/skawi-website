import { useLayoutEffect, useRef } from 'react';
import './AboutUs.css';

const aboutTranslations = {
  UA: {
    eyebrow: 'Про нас',
    title: ['Мова — це більше,', 'ніж слова.'],
    signature: 'Філософія SKAWI',
    body: 'Skawi — мовна школа в Лодзі. Ми допомагаємо не просто вивчати іноземні мови, а впевнено спілкуватися ними в житті. Навчаємо стаціонарно й онлайн на усіх рівнях складності. На заняттях тренуємо вимову, відпрацьовуємо живі діалоги й підбираємо завдання під твої цілі, щоб тобі було легше зробити те, заради чого ти вчиш мову: заговорити з колегами, пояснити що турбує, чи впевненіше піти на співбесіду.',
  },
  PL: {
    eyebrow: 'O nas',
    title: ['Język to więcej', 'niż słowa.'],
    signature: 'Filozofia SKAWI',
    body: 'Skawi to szkoła językowa w Łodzi. Pomagamy nie tylko uczyć się języków obcych, ale też pewnie posługiwać się nimi na co dzień. Prowadzimy zajęcia stacjonarne i online na wszystkich poziomach zaawansowania. Na lekcjach ćwiczymy wymowę, prowadzimy naturalne dialogi i dobieramy zadania do Twoich celów, aby łatwiej było Ci zrobić to, po co uczysz się języka: porozmawiać ze współpracownikami, wyjaśnić, co Cię niepokoi, czy pewniej pójść na rozmowę kwalifikacyjną.',
  },
  EN: {
    eyebrow: 'About us',
    title: ['Language is more', 'than words.'],
    signature: 'The SKAWI philosophy',
    body: 'Skawi is a language school in Łódź. We help you do more than learn foreign languages — we help you use them confidently in everyday life. We teach in person and online at every level. In our lessons, we practise pronunciation, work through real conversations and tailor activities to your goals, so you can do what you are learning the language for: talk with colleagues, explain what is troubling you or feel more confident at a job interview.',
  },
  SP: {
    eyebrow: 'Sobre nosotros',
    title: ['El idioma es más', 'que palabras.'],
    signature: 'La filosofía de SKAWI',
    body: 'Skawi es una escuela de idiomas en Łódź. No solo te ayudamos a aprender idiomas extranjeros, sino también a utilizarlos con confianza en la vida cotidiana. Ofrecemos clases presenciales y en línea para todos los niveles. Practicamos la pronunciación, trabajamos diálogos reales y adaptamos las actividades a tus objetivos, para que te resulte más fácil hacer aquello por lo que estudias un idioma: hablar con tus compañeros de trabajo, explicar lo que te preocupa o afrontar una entrevista laboral con más seguridad.',
  },
  RU: {
    eyebrow: 'О нас',
    title: ['Язык — это больше,', 'чем слова.'],
    signature: 'Философия SKAWI',
    body: 'Skawi — языковая школа в Лодзи. Мы помогаем не просто изучать иностранные языки, а уверенно общаться на них в жизни. Обучаем очно и онлайн на всех уровнях сложности. На занятиях тренируем произношение, отрабатываем живые диалоги и подбираем задания под твои цели, чтобы тебе было легче сделать то, ради чего ты учишь язык: поговорить с коллегами, объяснить, что беспокоит, или увереннее пойти на собеседование.',
  },
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function AboutUs({ language = 'UA', freezeDuringReveal = false }) {
  const copy = aboutTranslations[language] ?? aboutTranslations.UA;
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1101px) and (max-width: 1550px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const desktopPin = desktop.matches && !media.matches;

      // Keep the stage sticky at every scroll position; no layout-mode changes
      // when the section-transition curtain opens.
      if (freezeDuringReveal) {
        stage.style.setProperty('--about-photo-scale', '1');
        stage.style.setProperty('--about-photo-radius', '0px');
        stage.style.setProperty('--about-panel-visibility', 'visible');
        stage.style.setProperty('--about-copy-opacity', '1');
        stage.style.setProperty('--about-copy-shift', '0px');
        return;
      }
      const availableScroll = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = media.matches
        ? 1
        : clamp(-bounds.top / availableScroll);

      // The photo expands first; the glass content comes into focus afterward.
      const photo = ease(progress / 0.73);
      // On 1440px, finish the photo movement before compositing the blurred panel.
      const copy = desktopPin
        ? ease((progress - 0.76) / 0.2)
        : ease((progress - 0.65) / 0.3);

      stage.style.setProperty('--about-photo-scale', (0.58 + photo * 0.42).toFixed(6));
      // Keep radius stable while scaling; continuous radius animation
      // forces expensive full-screen repaints alongside backdrop blur.
      stage.style.setProperty('--about-photo-radius', desktopPin
        ? (progress >= 0.76 ? '0px' : '30px')
        : (photo > 0.995 ? '0px' : '30px'));
      stage.style.setProperty('--about-panel-visibility', desktopPin && copy < 0.002 ? 'hidden' : 'visible');
      stage.style.setProperty('--about-copy-opacity', copy.toFixed(4));
      stage.style.setProperty('--about-copy-shift', `${((1 - copy) * 22).toFixed(2)}px`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Apply the correct visual state before the browser draws the new scroll position.
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    desktop.addEventListener('change', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
      desktop.removeEventListener('change', schedule);
    };
  }, [freezeDuringReveal]);

  return (
    <section className="about-us-scroll" id="about" ref={sectionRef} aria-labelledby="about-us-title">
      <div className="about-us" ref={stageRef}>
        <div
          className="about-us__photo"
          aria-hidden="true"
          style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/About-Us-Section.webp")` }}
        />
        <div className="about-us__panel">
          <p className="about-us__eyebrow">{copy.eyebrow}</p>
          <h2 className="about-us__title" id="about-us-title">{copy.title[0]}<br />{copy.title[1]}</h2>
          <p className="about-us__signature">{copy.signature}</p>
          <p className="about-us__body">
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
