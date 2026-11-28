import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Header.css';

const groups = [['#about','#team','#gallery'],['#services','#enrollment','#test'],['#benefits','#awards','#reviews']];
const pending = new Set(['#test','#pricing','#contacts']);
const headerTranslations = {
  "UA": {
    "nav": [
      "Про школу",
      "Навчання",
      "Чому SKAWI",
      "Тарифи",
      "Контакти"
    ],
    "sub": [
      "Про нас",
      "Наші викладачі",
      "Галерея",
      "Наші послуги",
      "Як почати навчання",
      "Тест на рівень мови",
      "Наші переваги",
      "Наші нагороди",
      "Відгуки"
    ],
    "cta": "ПОЧАТИ НАВЧАННЯ",
    "open": "Відкрити меню",
    "close": "Закрити меню",
    "soon": "Незабаром"
  },
  "PL": {
    "nav": [
      "O szkole",
      "Nauka",
      "Dlaczego SKAWI",
      "Cennik",
      "Kontakt"
    ],
    "sub": [
      "O nas",
      "Nasi lektorzy",
      "Galeria",
      "Nasze usługi",
      "Jak zacząć naukę",
      "Test poziomujący",
      "Nasze zalety",
      "Nasze nagrody",
      "Opinie"
    ],
    "cta": "ROZPOCZNIJ NAUKĘ",
    "open": "Otwórz menu",
    "close": "Zamknij menu",
    "soon": "Wkrótce"
  },
  "EN": {
    "nav": [
      "About the school",
      "Learning",
      "Why SKAWI",
      "Pricing",
      "Contact"
    ],
    "sub": [
      "About us",
      "Our teachers",
      "Gallery",
      "Our services",
      "How to start learning",
      "Language level test",
      "Our benefits",
      "Our awards",
      "Reviews"
    ],
    "cta": "START LEARNING",
    "open": "Open menu",
    "close": "Close menu",
    "soon": "Coming soon"
  },
  "SP": {
    "nav": [
      "La escuela",
      "Aprendizaje",
      "Por qué SKAWI",
      "Tarifas",
      "Contacto"
    ],
    "sub": [
      "Sobre nosotros",
      "Nuestros profesores",
      "Galería",
      "Nuestros servicios",
      "Cómo empezar",
      "Prueba de nivel",
      "Nuestras ventajas",
      "Nuestros premios",
      "Opiniones"
    ],
    "cta": "EMPEZAR A APRENDER",
    "open": "Abrir menú",
    "close": "Cerrar menú",
    "soon": "Próximamente"
  },
  "RU": {
    "nav": [
      "О школе",
      "Обучение",
      "Почему SKAWI",
      "Тарифы",
      "Контакты"
    ],
    "sub": [
      "О нас",
      "Наши преподаватели",
      "Галерея",
      "Наши услуги",
      "Как начать обучение",
      "Тест на уровень языка",
      "Наши преимущества",
      "Наши награды",
      "Отзывы"
    ],
    "cta": "НАЧАТЬ ОБУЧЕНИЕ",
    "open": "Открыть меню",
    "close": "Закрыть меню",
    "soon": "Скоро"
  }
};
export default function Header({ language = 'UA', onLanguageChange, onSectionNavigate }) {
  const copy = headerTranslations[language] ?? headerTranslations.UA;
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded,setExpanded]=useState(null);
  const headerRef=useRef(null);
  const groupRefs=useRef([]);
  const ctaRef = useRef(null);
  const closeMenus=()=>{setExpanded(null);setMenuOpen(false);};
  useEffect(()=>{
    const outside=e=>{if(!headerRef.current?.contains(e.target)){setExpanded(null);setMenuOpen(false);}};
    const escape=e=>{if(e.key==='Escape'){if(expanded!==null){setExpanded(null);groupRefs.current[expanded]?.focus();}else setMenuOpen(false);}};
    const desktop=window.matchMedia('(min-width:1321px)');
    const resize=()=>{setExpanded(null);setMenuOpen(false);};
    document.addEventListener('pointerdown',outside);
    document.addEventListener('keydown',escape);
    desktop.addEventListener('change',resize);
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);desktop.removeEventListener('change',resize);};
  },[expanded]);
  const go=(e,href)=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(!document.querySelector(href)){e.preventDefault();return;}
    closeMenus();
    if(onSectionNavigate){e.preventDefault();onSectionNavigate(href);}
  };
  const navLink=(href,label,child=false)=>pending.has(href)
    ? <span className="hero-header__unavailable" aria-disabled="true" title={copy.soon}>{label}<small>{copy.soon}</small></span>
    : <a href={href} onClick={e=>go(e,href)}>{label}{child&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.2"/></svg>}</a>;

  const labelRef = useRef(null);
  const arrowRef = useRef(null);

  useLayoutEffect(() => {
    const button = ctaRef.current;
    const label = labelRef.current;
    const arrow = arrowRef.current;
    if (!button || !label || !arrow) return;

    const updateSwapDistance = () => {
      const style = window.getComputedStyle(button);
      const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const usableWidth = button.clientWidth - horizontalPadding;
      button.style.setProperty('--cta-label-travel', `${usableWidth - label.offsetWidth}px`);
      button.style.setProperty('--cta-arrow-travel', `${-(usableWidth - arrow.offsetWidth)}px`);
    };

    updateSwapDistance();
    const observer = new ResizeObserver(updateSwapDistance);
    observer.observe(button);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="hero-header" ref={headerRef}>
      <button
        className="hero-header__toggle"
        type="button"
        aria-label={menuOpen ? copy.close : copy.open}
        aria-expanded={menuOpen}
        aria-controls="skawi-navigation"
        onClick={() => {setMenuOpen(open=>!open);setExpanded(null);}}
      >
        <span /><span /><span />
      </button>
      <nav id="skawi-navigation" className={menuOpen ? 'hero-header__nav is-open' : 'hero-header__nav'} aria-label="Основная навигация">
        {groups.map((links,i)=><div className="hero-header__group" key={i} onMouseEnter={()=>{if(window.matchMedia('(min-width:1321px) and (hover:hover) and (pointer:fine)').matches)setExpanded(i);}} onMouseLeave={()=>{if(window.matchMedia('(min-width:1321px) and (hover:hover) and (pointer:fine)').matches)setExpanded(v=>v===i?null:v);}}>
          <button type="button" className="hero-header__group-trigger" ref={el=>{groupRefs.current[i]=el;}} aria-expanded={expanded===i} aria-controls={'skawi-subnav-'+i} onClick={()=>setExpanded(v=>v===i?null:i)}>
            {copy.nav[i]}<svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div id={'skawi-subnav-'+i} className={'hero-header__dropdown'+(expanded===i?' is-expanded':'')} inert={expanded!==i}>
            <div className="hero-header__dropdown-inner">{links.map((href,j)=><div className="hero-header__dropdown-item" key={href} style={{'--item':j}}>{navLink(href,copy.sub[i*3+j],true)}</div>)}</div>
          </div>
        </div>)}
        <div className="hero-header__direct">{navLink('#pricing',copy.nav[3])}</div>
        <div className="hero-header__direct">{navLink('#contacts',copy.nav[4])}</div>
      </nav>
      <LanguageSwitcher active={language} onChange={onLanguageChange} />
      <a className="hero-header__cta" href="#enrollment" ref={ctaRef} onClick={e=>go(e,"#enrollment")}>
        <span className="hero-header__cta-label" ref={labelRef}>{copy.cta}</span>
        <span className="hero-header__arrow" aria-hidden="true" ref={arrowRef}>
          <img className="hero-header__arrow-default" src={`${import.meta.env.BASE_URL}icons/cta-arrow.svg`} width="36" height="36" alt="" />
          <img className="hero-header__arrow-active" src={`${import.meta.env.BASE_URL}icons/cta-arrow-active.svg`} width="36" height="36" alt="" />
        </span>
      </a>
    </header>
  );
}
