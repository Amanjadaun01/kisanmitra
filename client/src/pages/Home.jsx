import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/mandi/prices').then(({ data }) => setPrices(data.records.slice(0, 3))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 py-8 md:grid-cols-[1.2fr_.8fr] md:items-center">
        <div>
          <p className="font-semibold text-primary">{t('taglineHi')}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-normal md:text-6xl">KisanMitra</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{t('tagline')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">{t('register')}</Link>
            <Link className="btn-secondary" to="/login">{t('login')}</Link>
          </div>
        </div>
        <div className="panel border-primary/25 bg-white">
          <h2 className="text-lg font-bold">Aaj ki Mandi</h2>
          {loading ? <LoadingSpinner /> : <div className="mt-4 space-y-3">{prices.map((p) => (
            <div key={`${p.market}-${p.commodity}`} className="flex items-center justify-between rounded-md border border-line p-3">
              <div><p className="font-semibold">{p.commodity}</p><p className="text-sm text-muted">{p.market}</p></div>
              <p className="font-bold text-primary">Rs {p.modal_price}/q</p>
            </div>
          ))}</div>}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['📈', t('mandi'), 'Best mandi with transport cost and net profit.', '/mandi'],
          ['📋', t('yojna'), 'Personalized scheme eligibility and apply steps.', '/yojna'],
          ['💬', t('community'), 'District-wise farmer tips, questions and experience.', '/community']
        ].map(([icon, title, body, to]) => (
          <Link to={to} key={title} className="panel transition hover:-translate-y-1 hover:border-primary">
            <span className="text-3xl">{icon}</span>
            <h3 className="mt-3 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Home;
