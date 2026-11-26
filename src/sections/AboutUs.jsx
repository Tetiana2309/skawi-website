import { useEffect, useRef } from 'react';
import './AboutUs.css';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function AboutUs() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const availableScroll = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = media.matches
        ? 1
        : clamp(-section.getBoundingClientRect().top / availableScroll);

      // The photo expands first; the glass content comes into focus afterward.
      const photo = ease(progress / 0.73);
      const copy = ease((progress - 0.65) / 0.3);

      stage.style.setProperty('--about-photo-scale', (0.58 + photo * 0.42).toFixed(4));
      stage.style.setProperty('--about-photo-radius', `${Math.round((1 - photo) * 30)}px`);
      stage.style.setProperty('--about-copy-opacity', copy.toFixed(4));
      stage.style.setProperty('--about-copy-shift', `${((1 - copy) * 22).toFixed(2)}px`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <section className="about-us-scroll" id="about" ref={sectionRef} aria-labelledby="about-us-title">
      <div className="about-us" ref={stageRef}>
        <div
          className="about-us__photo"
          aria-hidden="true"
          style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/About-Us-Section.webp")` }}
        />
        <div className="about-us__panel">
          <p className="about-us__eyebrow">Про нас</p>
          <h2 className="about-us__title" id="about-us-title">Мова — це більше,<br />ніж слова.</h2>
          <p className="about-us__signature">Філософія SKAWI</p>
          <p className="about-us__body">
            Skawi — мовна школа в Лодзі. Ми допомагаємо не просто вивчати іноземні мови, а впевнено спілкуватися ними в житті. Навчаємо стаціонарно й онлайн на усіх рівнях складності. На заняттях тренуємо вимову, відпрацьовуємо живі діалоги й підбираємо завдання під твої цілі, щоб тобі було легше зробити те, заради чого ти вчиш мову: заговорити з колегами, пояснити що турбує, чи впевненіше піти на співбесіду.
          </p>
        </div>
      </div>
    </section>
  );
}
