import './LanguageSwitcher.css';

const languages = ['PL', 'UA', 'EN', 'SP', 'RU'];

export default function LanguageSwitcher({ active = 'UA', onChange }) {

  return (
    <div className="language-switcher" role="group" aria-label="Язык сайта">
      {languages.map((language, index) => (
        <span className="language-switcher__item" key={language}>
          {index > 0 && <span className="language-switcher__divider" aria-hidden="true" />}
          <button
            className={active === language ? 'language-switcher__button is-active' : 'language-switcher__button'}
            type="button"
            aria-pressed={active === language}
            title={language}
            onClick={() => onChange?.(language)}
          >
            {language}
          </button>
        </span>
      ))}
    </div>
  );
}
