import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

export default function Gallery({ language = 'UA', onModalChange }) {
  const copy = translations[language] ?? translations.UA;
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const galleryRef = useRef(null);
  const closingRef = useRef(false);
  const modalOpen = selected !== null;
  const displayItems = slots;

  // Defer heavy gallery videos until they actually approach the viewport.
  // Otherwise the three 19–25 MB files compete with the hero video on reload.
  useEffect(() => {
    const root = galleryRef.current;
    if (!root) return;
    const videos = root.querySelectorAll('.gallery__media video');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting && !document.hidden) {
          if (!video.getAttribute('src')) video.src = video.dataset.src;
          video.preload = 'auto';
          const playback = video.play();
          playback?.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, []);

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
    const root = galleryRef.current;
    if (!root || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (event) => {
      if (root.classList.contains('gallery__canvas--modal-open')) return;
      root.classList.remove('gallery__canvas--hover-suspended');
      const rect = root.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      root.style.setProperty('--gallery-mouse-x', x.toFixed(2) + 'px');
      root.style.setProperty('--gallery-mouse-y', y.toFixed(2) + 'px');
    };
    const reset = () => {
      root.style.setProperty('--gallery-mouse-x', '0px');
      root.style.setProperty('--gallery-mouse-y', '0px');
    };
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', reset);
    return () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', reset);
    };
  }, []);

  const close = useCallback(() => {
    if (closingRef.current || !modalOpen) return;
    closingRef.current = true;
    setClosing(true);
    setVisible(false);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    closeTimerRef.current = window.setTimeout(() => {
      setSelected(null);
      setClosing(false);
      closingRef.current = false;
    }, reduced ? 0 : 800);
  }, [modalOpen]);

  useLayoutEffect(() => {
    if (!modalOpen) return;
    const root = document.documentElement;
    const canvas = galleryRef.current;
    root.classList.add('gallery-modal-locked');
    canvas?.classList.add('gallery__canvas--modal-open', 'gallery__canvas--hover-suspended');
    onModalChange?.(true);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!closingRef.current) setVisible(true);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      canvas?.classList.remove('gallery__canvas--modal-open');
      root.classList.remove('gallery-modal-locked');
      onModalChange?.(false);
    };
  }, [modalOpen, close, onModalChange]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const openItem = (index) => {
    if (modalOpen) return;
    closingRef.current = false;
    setClosing(false);
    setVisible(false);
    setSelected(index);
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
                  data-src={videoPath(item.video)}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              ) : (
                <img src={imagePath(item.photo)} alt="" loading="lazy" decoding="async" />
              )}
            </span>
          </button>
        ))}
      </div>
      {selected !== null && displayItems[selected] && createPortal(
        <div
          className={`gallery-lightbox${visible ? ' is-visible' : '' }${closing ? ' is-closing' : ''}` }
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={copy.heading}
          onClick={close}
        >
          <div className="gallery-lightbox__card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="gallery-lightbox__close" aria-label={copy.close} onClick={close}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="14" fill="#023536" />
                <path d="M15.7279 14.3137L20.6777 9.36396L19.2635 7.94975L14.3137 12.8995L9.36397 7.94975L7.94976 9.36396L12.8995 14.3137L7.94976 19.2635L9.36397 20.6777L14.3137 15.7279L19.2635 20.6777L20.6777 19.2635L15.7279 14.3137Z" fill="#F6FFFC" />
              </svg>
            </button>
            <div className={`gallery-lightbox__content${displayItems[selected].photo ? ' gallery-lightbox__content--photo' : ''}`}>
              {displayItems[selected].video ? (
                <video key={displayItems[selected].id} src={videoPath(displayItems[selected].video)} controls autoPlay playsInline />
              ) : (
                <img key={displayItems[selected].id} src={imagePath(displayItems[selected].photo)} alt="" />
              )}
            </div>
          </div>
        </div>, document.body
      )}
    </section>
  );
}
