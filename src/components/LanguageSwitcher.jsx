import './LanguageSwitcher.css';

const languages = ['PL', 'UA', 'EN', 'SP', 'RU'];

// Visual language labels only. Ukrainian is the sole active site language.
export default function LanguageSwitcher() {
  return (
    <div className="language-switcher" role="group" aria-label="Мови сайту">
      {languages.map((language, index) => (
        <span className="language-switcher__item" key={language}>
          {index > 0 && <span className="language-switcher__divider" aria-hidden="true" />}
          <span
            className={language === 'UA' ? 'language-switcher__button is-active' : 'language-switcher__button'}
            aria-current={language === 'UA' ? 'true' : undefined}
          >
            {language}
          </span>
        </span>
      ))}
    </div>
  );
}
