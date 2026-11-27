import { useEffect, useRef, useState } from 'react';
import './Gallery.css';

// Coordinates relative to the gallery area beginning at (40, 180) in Figma 97:264 (1920 × 2050).
// The three GREY frames in the screenshot are the three uploaded videos.
// Every photographed frame uses one of the twelve numbered images.
const slots = [
  { id: 'photo-1',  x: 0,    y: 30,   w: 498, h: 316, photo: 'gallery-img-one.webp' },
  { id: 'video-1',  x: 544,  y: -60,  w: 462, h: 657, video: 'video-1.mp4' },
  { id: 'photo-2',  x: 1052, y: 45,   w: 362, h: 514, photo: 'gallery-img-two.webp' },
  { id: 'photo-3',  x: 1494, y: 0,    w: 346, h: 314, photo: 'gallery-img-three.webp' },
  { id: 'video-2',  x: 0,    y: 378,  w: 334, h: 481, video: 'video-2.mp4' },
  { id: 'photo-4',  x: 544,  y: 636,  w: 476, h: 250, photo: 'gallery-img-four.webp' },
  { id: 'video-3',  x: 1052, y: 591,  w: 410, h: 618, video: 'video-3.mp4' },
  { id: 'photo-5',  x: 1494, y: 346,  w: 346, h: 604, photo: 'gallery-img-five.webp' },
  { id: 'photo-6',  x: 0,    y: 891,  w: 410, h: 302, photo: 'gallery-img-six.webp' },
  { id: 'photo-7',  x: 454,  y: 918,  w: 566, h: 394, photo: 'gallery-img-seven.webp' },
  { id: 'photo-8',  x: 1494, y: 982,  w: 346, h: 490, photo: 'gallery-img-eight.webp' },
  { id: 'photo-9',  x: 0,    y: 1256, w: 420, h: 434, photo: 'gallery-img-nine.webp' },
  { id: 'photo-10', x: 454,  y: 1344, w: 452, h: 346, photo: 'gallery-img-ten.webp' },
  { id: 'photo-11', x: 1052, y: 1241, w: 346, h: 449, photo: 'gallery-img-eleven.webp' },
  { id: 'photo-12', x: 1414, y: 1498, w: 426, h: 192, photo: 'gallery-img-twelve.webp' },
];
const translations = {
  UA: { heading: 'галерея', quote: '“за кожним кадром - своя історія”', all: 'Усе', photos: 'Фото', videos: 'Відео', close: 'Закрити', next: 'Наступне', prev: 'Попереднє' },
  PL: { heading: 'galeria', quote: '„za każdym kadrem kryje się historia”', all: 'Wszystkie', photos: 'Zdjęcia', videos: 'Wideo', close: 'Zamknij', next: 'Następne', prev: 'Poprzednie' },
  EN: { heading: 'gallery', quote: '“every frame tells its own story”', all: 'All', photos: 'Photos', videos: 'Videos', close: 'Close', next: 'Next', prev: 'Previous' },
  SP: { heading: 'galería', quote: '«cada imagen cuenta su propia historia»', all: 'Todo', photos: 'Fotos', videos: 'Vídeos', close: 'Cerrar', next: 'Siguiente', prev: 'Anterior' },
  RU: { heading: 'галерея', quote: '«за каждым кадром — своя история»', all: 'Все', photos: 'Фото', videos: 'Видео', close: 'Закрыть', next: 'Следующее', prev: 'Предыдущее' },
};

const imagePath = (name) => import.meta.env.BASE_URL + 'images/' + name;
const videoPath = (name) => import.meta.env.BASE_URL + 'videos/' + name;

export default function Gallery({ language = 'UA' }) {
  const copy = translations[language] ?? translations.UA;
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const galleryRef = useRef(null);
  const displayItems = slots;

  useEffect(() => {
    const root = galleryRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('gallery__tile--visible');
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 90px 0px' });
    root.querySelectorAll('.gallery__tile').forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKeyDown);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected !== null]);

  const openItem = (index) => {
    setSelected(index);
    setVisible(false);
  };

  const close = () => {
    setVisible(false);
    setSelected(null);
  };


  return (
    <section className="gallery-section" id="gallery" aria-label={copy.heading}>
      <div className="gallery__topline">
        <span>{copy.heading}</span>
        <span>{copy.quote}</span>
      </div>
      <div className="gallery__canvas" ref={galleryRef}>
        {displayItems.map((item, index) => (
          <button className="gallery__tile" type="button" key={item.id}
            style={{ '--tile-x': `${item.x / 1840 * 100}%`, '--tile-y': `${item.y / 1690 * 100}%`,
              '--tile-w': `${item.w / 1840 * 100}%`, '--tile-h': `${item.h / 1690 * 100}%`,
              '--tile-ratio': `${item.w} / ${item.h}`, '--tile-order': index % 5 }}
            onClick={() => openItem(index)}
            aria-label={item.video ? `${copy.videos} ${index + 1}` : `${copy.photos} ${index + 1}`}>
            <span className="gallery__media">
              {item.video ? (
                <video
                  src={videoPath(item.video)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              ) : (
                <img src={imagePath(item.photo)} alt="" loading={index < 4 ? 'eager' : 'lazy'} decoding="async" />
              )}
            </span>
          </button>
        ))}
      </div>
      {selected !== null && displayItems[selected] && (
        <div
          className={`gallery-lightbox${visible ? ' is-visible' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={copy.heading}
          onClick={close}
        >
          <div className="gallery-lightbox__card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="gallery-lightbox__close" aria-label={copy.close} onClick={close}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <rect width="60" height="60" rx="30" fill="#023536" />
                <path d="M32.8649 30.2132L42.1457 20.9324L39.494 18.2808L30.2133 27.5616L20.9325 18.2808L18.2808 20.9324L27.5616 30.2132L18.2808 39.494L20.9325 42.1456L30.2133 32.8649L39.494 42.1456L42.1457 39.494L32.8649 30.2132Z" fill="#F6FFFC" />
              </svg>
            </button>
            <div className="gallery-lightbox__content">
              {displayItems[selected].video ? (
                <video key={displayItems[selected].id} src={videoPath(displayItems[selected].video)} controls autoPlay playsInline />
              ) : (
                <img key={displayItems[selected].id} src={imagePath(displayItems[selected].photo)} alt="" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
