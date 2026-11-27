import { useEffect, useRef } from 'react';
import './Awards.css';

const titles = { UA: 'Наші нагороди', RU: 'Наши награды', EN: 'Our awards', PL: 'Nasze nagrody', SP: 'Nuestros premios' };
const names = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven'];
const clamp = (v,a,b) => Math.max(a, Math.min(b,v));

export default function Awards({ language = 'UA' }) {
  const root = useRef(null);
  const stage = useRef(null);
  const track = useRef(null);
  const items = useRef([]);
  useEffect(() => {
    const section = root.current, viewport = stage.current, row = track.current;
    if (!section || !viewport || !row) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previousCenter = null;
    let previousTime = 0;
    let bend = 0;
    let impulse = 0;
    const paint = now => {
      frame = 0;
      if (motion.matches) {
        row.style.transform = '';
        items.current.forEach(el => { if (el) el.style.transform = ''; });
        previousCenter = null; previousTime = 0; bend = 0; impulse = 0;
        return;
      }
      const travel = Math.max(1, section.offsetHeight - viewport.offsetHeight);
      const p = clamp(-section.getBoundingClientRect().top / travel, 0, 1);
      const progress = clamp((p - .04) / .92, 0, 1);
      const first = items.current[0], last = items.current[names.length - 1];
      if (!first || !last) return;
      const from = first.offsetLeft + first.offsetWidth / 2;
      const to = last.offsetLeft + last.offsetWidth / 2;
      const center = from + (to - from) * progress;
      const dt = previousTime ? clamp((now - previousTime) / 1000, .008, .05) : 1 / 60;
      const delta = previousCenter === null ? 0 : center - previousCenter;
      previousCenter = center;
      previousTime = now;
      if (Math.abs(delta) > .04) {
        impulse = clamp(delta / dt / 500, -1, 1);
      } else {
        impulse *= Math.exp(-dt * 4.5);
      }
      bend += (impulse - bend) * (1 - Math.exp(-dt * 9));
      if (Math.abs(bend) < .001 && Math.abs(impulse) < .001) { bend = 0; impulse = 0; }
      row.style.transform = 'translate3d(' + (viewport.clientWidth / 2 - center) + 'px,0,0)';
      items.current.forEach(el => {
        if (!el) return;
        const d = (el.offsetLeft + el.offsetWidth / 2 - center) / Math.max(1, viewport.clientWidth / 2);
        const n = clamp(d, -1.5, 1.5);
        const offset = n * bend * Math.min(180, viewport.clientHeight * .19);
        const angle = n * bend * 9;
        el.style.transform = 'translate3d(0,' + offset + 'px,0) rotate(' + angle + 'deg)';
      });
      if (bend !== 0 || impulse !== 0) frame = requestAnimationFrame(paint);
      else previousTime = 0;
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new ResizeObserver(wake);
    observer.observe(viewport); observer.observe(row);
    items.current.forEach(el => { if(el) observer.observe(el); });
    window.addEventListener('scroll',wake,{passive:true});
    motion.addEventListener('change',wake);
    wake();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll',wake); motion.removeEventListener('change',wake); };
  }, []);
  return (
    <section className="awards-scroll" id="awards" ref={root} aria-labelledby="awards-heading">
      <div className="awards" ref={stage}>
        <h2 id="awards-heading" className="awards__heading">{titles[language] ?? titles.UA}</h2>
        <div className="awards__viewport">
          <div className="awards__track" ref={track}>
            {names.map((name,i) => <figure className="awards__item" key={name} ref={el => { items.current[i] = el; }}>
              <img src={import.meta.env.BASE_URL + 'images/certificates-img-' + name + '.webp'} alt={(titles[language] ?? titles.UA) + ' — ' + (i+1)} decoding="async" onLoad={() => window.dispatchEvent(new Event('scroll'))} />
            </figure>)}
          </div>
        </div>
      </div>
    </section>
  );
}
