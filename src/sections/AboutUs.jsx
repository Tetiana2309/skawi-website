import { useEffect, useRef, useState } from 'react';
import './AboutUs.css';

export default function AboutUs() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`about-us${revealed ? ' about-us--visible' : ''}`} id="about" aria-labelledby="about-us-title" style={{ '--about-us-image': `url("${import.meta.env.BASE_URL}images/About-Us-Section.webp")` }}>
      <div className="about-us__panel">
        <p className="about-us__eyebrow">Про нас</p>
        <h2 className="about-us__title" id="about-us-title">Мова — це більше,<br />ніж слова.</h2>
        <p className="about-us__signature">Філософія SKAWI</p>
        <p className="about-us__body">
          Skawi — мовна школа в Лодзі. Ми допомагаємо не просто вивчати іноземні мови, а впевнено спілкуватися ними в житті. Навчаємо стаціонарно й онлайн на усіх рівнях складності. На заняттях тренуємо вимову, відпрацьовуємо живі діалоги й підбираємо завдання під твої цілі, щоб тобі було легше зробити те, заради чого ти вчиш мову: заговорити з колегами, пояснити що турбує, чи впевненіше піти на співбесіду.
        </p>
      </div>
    </section>
  );
}
