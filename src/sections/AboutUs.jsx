import { useEffect, useRef } from 'react';
import './AboutUs.css';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function AboutUs({ copy, language }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
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
      if (desktopPin) {
        const position = bounds.top >= 0
          ? 'before'
          : bounds.bottom <= window.innerHeight ? 'after' : 'active';
        if (stage.dataset.pin !== position) stage.dataset.pin = position;
      } else if (stage.dataset.pin) {
        delete stage.dataset.pin;
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

    schedule();
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
  }, []);

  return (
    <section className="about-us-scroll" id="about" ref={sectionRef} aria-labelledby="about-us-title" lang={language === "UA" ? "uk" : language.toLowerCase() === "sp" ? "es" : language.toLowerCase()}>
      <div className="about-us" ref={stageRef}>
        <div
          className="about-us__photo"
          aria-hidden="true"
          style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/About-Us-Section.webp")` }}
        />
        <div className="about-us__panel">
          <p className="about-us__eyebrow">{copy.about.eyebrow}</p>
          <h2 className="about-us__title" id="about-us-title">{copy.about.title[0]}<br />{copy.about.title[1]}</h2>
          <p className="about-us__signature">{copy.about.signature}</p>
          <p className="about-us__body">{copy.about.body}</p>
        </div>
      </div>
    </section>
  );
}
