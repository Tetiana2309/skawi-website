import { useLayoutEffect, useRef } from 'react';
import './Awards.css';

const copy = {
  UA: ['Наші досягнення', '«За кожним досягненням — своя історія.»', 'Філософія SKAWI'],
  RU: ['Наши достижения', '«За каждым достижением — своя история.»', 'Философия SKAWI'],
  EN: ['Our achievements', '“Every achievement has a story behind it.”', 'SKAWI Philosophy'],
  PL: ['Nasze osiągnięcia', '„Za każdym osiągnięciem kryje się historia.”', 'Filozofia SKAWI'],
  SP: ['Nuestros logros', '«Detrás de cada logro hay una historia.»', 'Filosofía SKAWI'],
};
const photos = [
  ['one',550,414], ['two',394,298], ['three',378,285],
  ['four',473,375], ['five',488,355], ['six',361,285],
  ['seven',637,477], ['eight',358,285], ['nine',439,330],
  ['ten',539,477], ['eleven',416,406],
];
const count = photos.length;
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const mix = (a,b,t) => a+(b-a)*t;
const ease = t => t*t*(3-2*t);

export default function Awards({ language = 'UA' }) {
  const [title, quote, signature] = copy[language] ?? copy.UA;
  const root = useRef(null);
  const stage = useRef(null);
  const items = useRef([]);
  useLayoutEffect(() => {
    const section = root.current, viewport = stage.current;
    if (!section || !viewport) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, previous = 0, current = 0, initialized = false;
    const goal = () => {
      const travel = Math.max(1, section.offsetHeight - viewport.offsetHeight);
      return clamp((-section.getBoundingClientRect().top / travel - .025) / .95,0,1)*(count-1);
    };
    const paint = () => {
      const w = viewport.clientWidth, h = viewport.clientHeight;
      const mobile = w <= 800;
      const unit = Math.min(w / (mobile ? 780 : 1920), h / (mobile ? 720 : 1002), 1);
      const gap = 48 * unit;
      const dimensions = photos.map(([,focus,side],i) => {
        let d = i-current;
        // Wrap only the visible neighbors, not the scroll sequence.
        d -= Math.round(d/count)*count;
        const focusAmount = ease(clamp(1-Math.abs(d),0,1));
        return { d, width: mix(side,focus,focusAmount)*unit, height: mix(418,555,focusAmount)*unit, blur: 4*(1-focusAmount) };
      });
      // Lay out real variable-width frames with a constant 48px design gap.
      // Interpolate the anchor between the two nearest photos, so the
      // horizontal motion remains continuous while their dimensions change.
      const ordered = dimensions.map((v,i)=>({...v,i})).sort((a,b)=>a.d-b.d);
      let cursor = 0;
      const centers = [];
      ordered.forEach(v => { centers[v.i] = cursor+v.width/2; cursor += v.width+gap; });
      const lo = Math.floor(current), hi = Math.min(count-1,lo+1);
      const anchor = mix(centers[lo],centers[hi],current-lo);
      const origin = w * (mobile ? .5 : 1148/1920);
      items.current.forEach((el,i) => {
        if (!el) return;
        const v = dimensions[i];
        const x = origin + centers[i]-anchor-v.width/2;
        const y = (h-v.height)/2;
        const visible = Math.abs(v.d) < 4.5;
        el.style.width = v.width+'px';
        el.style.height = v.height+'px';
        el.style.transform = 'translate3d('+x+'px,'+y+'px,0)';
        el.style.filter = v.blur < .015 ? 'none' : 'blur('+v.blur.toFixed(2)+'px)';
        el.style.visibility = visible ? 'visible' : 'hidden';
        el.style.opacity = String(1-ease(clamp((Math.abs(v.d)-3.5),0,1)));
        el.style.zIndex = String(Math.round(100-Math.abs(v.d)*10));
      });
    };
    const tick = now => {
      frame = 0;
      if (motion.matches) {
        items.current.forEach(el => { if(el) el.removeAttribute('style'); });
        initialized = false; previous = 0;
        return;
      }
      const target = goal();
      const dt = previous ? clamp((now-previous)/1000,.008,.05) : 1/60;
      previous = now;
      if (!initialized) { current = target; initialized = true; }
      else current += (target-current)*(1-Math.exp(-dt*11));
      if (Math.abs(target-current)<.001) current=target;
      paint();
      if (current!==target) frame=requestAnimationFrame(tick);
      else previous=0;
    };
    const wake = () => { if(!frame) frame=requestAnimationFrame(tick); };
    const resize = new ResizeObserver(wake);
    resize.observe(viewport);
    window.addEventListener('scroll',wake,{passive:true});
    motion.addEventListener('change',wake);
    tick(performance.now());
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll',wake); motion.removeEventListener('change',wake); };
  }, []);
  return (
    <section className="awards-scroll" id="awards" ref={root} aria-labelledby="awards-heading">
      <div className="awards" ref={stage}>
        <div className="awards__topline">
          <h2 id="awards-heading" className="awards__heading">{title}</h2>
          <div className="awards__quote"><span>{quote}</span><span className="awards__signature"><i aria-hidden="true" />{signature}</span></div>
        </div>
        <div className="awards__viewport">
          {photos.map(([name,focus],i) => (
            <figure key={name} className="awards__item" ref={el => { items.current[i]=el; }}>
              <img src={import.meta.env.BASE_URL+'images/certificates-img-'+name+'.webp'} alt={title+' — '+(i+1)} width={focus} height="555" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
