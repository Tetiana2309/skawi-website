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
    let frame = 0, previous = 0, current = 0, velocity = 0, initialized = false;
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
        d -= Math.round(d/count)*count;
        const distance = Math.abs(d);
        const f = ease(clamp(1-distance,0,1));
        const depth = ease(clamp((distance-1)/2,0,1));
        const shrink = 1-.32*depth;
        return {
          d, distance,
          width: mix(side,focus,f)*unit*shrink,
          height: mix(418,555,f)*unit*shrink,
          blur: 4*(1-f)+4*depth,
          angle: -Math.sign(d)*mix(0,10,ease(clamp(distance/2,0,1))),
          opacity: 1-ease(clamp((distance-2.7)/1.3,0,1)),
          z: -90*unit*depth,
        };
      });
      // Keep the nearest frames at their specified dimensions, while the
      // outer frames recede. Compensate perspective so the layout gap stays
      // consistent and never expands into an empty space.
      const perspective = 1200;
      const ordered = dimensions.map((v,i)=>({...v,i})).sort((a,b)=>a.d-b.d);
      let cursor = 0;
      const centers = [];
      ordered.forEach(v => { centers[v.i] = cursor+v.width/2; cursor += v.width+gap; });
      const lo = Math.floor(current), hi = Math.min(count-1,lo+1);
      const anchor = mix(centers[lo],centers[hi],current-lo);
      const origin = w/2;
      items.current.forEach((el,i) => {
        if (!el) return;
        const v = dimensions[i];
        const x = centers[i]-anchor;
        const compensation = (perspective-v.z)/perspective;
        el.style.width = v.width+'px';
        el.style.height = v.height+'px';
        el.style.left = origin+'px';
        el.style.top = h/2+'px';
        el.style.transform = 'translate3d('+(-v.width/2+x*compensation)+'px,'+(-v.height/2)+'px,'+v.z+'px) rotateY('+v.angle+'deg) scale('+compensation+')';
        el.style.filter = v.blur < .015 ? 'none' : 'blur('+v.blur.toFixed(2)+'px)';
        el.style.visibility = v.opacity > .001 ? 'visible' : 'hidden';
        el.style.opacity = String(v.opacity);
        el.style.zIndex = String(Math.round(100-v.distance*10));
      });
    };
    const tick = now => {
      frame = 0;
      if (motion.matches) {
        items.current.forEach(el => { if(el) el.removeAttribute('style'); });
        initialized = false; previous = 0; velocity = 0;
        return;
      }
      const target = goal();
      const dt = previous ? clamp((now-previous)/1000,.008,.05) : 1/60;
      previous = now;
      if (!initialized) { current = target; velocity = 0; initialized = true; }
      else {
        // Critically damped spring; small substeps keep it stable even
        // when the browser drops frames. No overshoot at either endpoint.
        const steps = Math.max(1,Math.ceil(dt/.008));
        const step = dt/steps;
        for(let i=0;i<steps;i++){
          velocity += (100*(target-current)-20*velocity)*step;
          current += velocity*step;
          if(current<0 || current>count-1){current=clamp(current,0,count-1);velocity=0;}
        }
      }
      if (Math.abs(target-current)<.001 && Math.abs(velocity)<.01) {current=target;velocity=0;}
      paint();
      if (current!==target || velocity!==0) frame=requestAnimationFrame(tick);
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
