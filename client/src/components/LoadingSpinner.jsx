import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ label }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 py-8 text-muted">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{label || t('loading')}</span>
    </div>
  );
};

export default LoadingSpinner;
