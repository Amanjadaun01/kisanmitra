import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => {
    Promise.all([
      api.get(`/mandi/best?crop=${user.primaryCrop}&qty=10`),
      api.post('/yojna/eligible', { landSize: user.landSize, income: 250000, crop: user.primaryCrop, state: user.state }),
      api.get(`/community/posts?district=${user.district}&page=1`)
    ]).then(([mandi, yojna, posts]) => setData({ mandi: mandi.data.best, scheme: yojna.data[0], post: posts.data[0] }));
  }, [user]);
  if (!data) return <LoadingSpinner />;
  return (
    <div className="space-y-6">
      <section className="panel bg-primary text-white">
        <h1 className="text-3xl font-extrabold">Namaste {user.name}!</h1>
        <p className="mt-2 opacity-90">{user.district} ke liye aaj ki smart kheti planning ready hai.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[['/mandi', 'Mandi Saarthi', 'Transport aur net profit dekhein'], ['/yojna', 'Yojna Khoj', 'Eligible schemes paayein'], ['/community', 'Fasal Saathi', 'Apne district ki baat sunein']].map(([to, title, body]) => (
          <Link className="panel hover:border-primary" to={to} key={to}><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm text-muted">{body}</p></Link>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel"><p className="text-sm text-muted">Today best price</p><h2 className="mt-2 text-xl font-bold">{data.mandi?.mandiName || 'Seed mandi data first'}</h2><p className="text-primary font-bold">Rs {data.mandi?.pricePerQuintal || 0}/q, net Rs {data.mandi?.netProfit || 0}</p></div>
        <div className="panel"><p className="text-sm text-muted">Scheme reminder</p><h2 className="mt-2 text-xl font-bold">{data.scheme?.name || 'No scheme found'}</h2><p className="text-sm text-muted">{data.scheme?.benefit}</p></div>
        <div className="panel"><p className="text-sm text-muted">Latest district tip</p><h2 className="mt-2 font-semibold">{data.post?.crop || user.primaryCrop}</h2><p className="text-sm text-muted">{data.post?.content || 'No post yet. Start the conversation.'}</p></div>
      </section>
    </div>
  );
};

export default Dashboard;
