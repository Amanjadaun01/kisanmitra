import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const change = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    localStorage.setItem('km_lang', next);
    i18n.changeLanguage(next);
  };
  return (
    <button className="btn-secondary px-3" onClick={change} aria-label="Toggle language">
      {i18n.language === 'hi' ? 'EN' : 'हिं'}
    </button>
  );
};

export default LanguageToggle;
