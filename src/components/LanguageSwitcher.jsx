import { useState } from 'react';
import './LanguageSwitcher.css';

const languages = ['PL', 'UA', 'EN', 'SP', 'RU'];

export default function LanguageSwitcher() {
  const [active, setActive] = useState('UA');

  return (
    <div className="language-switcher" role="group" aria-label="Язык сайта">
      {languages.map((language, index) => (
        <span className="language-switcher__item" key={language}>
          {index > 0 && <span className="language-switcher__divider" aria-hidden="true" />}
          <button
            className={active === language ? 'language-switcher__button is-active' : 'language-switcher__button'}
            type="button"
            aria-pressed={active === language}
            title="Выбор языка интерфейса; переводы добавим позже"
            onClick={() => setActive(language)}
          >
            {language}
          </button>
        </span>
      ))}
    </div>
  );
}
