import './LanguageSwitcher.css';

const languages = ['PL', 'UA', 'EN', 'SP', 'RU'];

// Only the first-screen headline changes language; all other site copy remains Ukrainian.
export default function LanguageSwitcher({ active = 'UA', onChange }) {
  return (
    <div className="language-switcher" role="group" aria-label="Мови сайту">
      {languages.map((language, index) => (
        <span className="language-switcher__item" key={language}>
          {index > 0 && <span className="language-switcher__divider" aria-hidden="true" />}
          <button
            type="button"
            onClick={() => onChange?.(language)}
            className={language === active ? 'language-switcher__button is-active' : 'language-switcher__button'}
            aria-pressed={language === active}
            title={language}
          >
            {language}
          </button>
        </span>
      ))}
    </div>
  );
}
