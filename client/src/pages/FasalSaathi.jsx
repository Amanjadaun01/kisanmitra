import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { crops, districts } from './shared';

const timeAgo = (date) => new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.round((new Date(date) - Date.now()) / 86400000), 'day');

const FasalSaathi = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState({ district: user.district, crop: '', type: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState({ crop: user.primaryCrop, type: 'tip', content: '' });
  const load = () => {
    setLoading(true);
    const params = new URLSearchParams(Object.entries(filter).filter(([, v]) => v));
    api.get(`/community/posts?${params}`).then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  };
  useEffect(load, [filter]);
  const like = async (id) => { await api.put(`/community/posts/${id}/like`); load(); };
  const comment = async (id, content) => { if (content) { await api.post(`/community/posts/${id}/comments`, { content }); load(); } };
  const create = async () => { await api.post('/community/posts', { ...draft, district: user.district }); setModal(false); setDraft({ ...draft, content: '' }); load(); };
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold">Fasal Saathi</h1>
      <div className="panel grid gap-3 md:grid-cols-3"><select className="field" value={filter.district} onChange={(e) => setFilter({ ...filter, district: e.target.value })}>{districts.map((d) => <option key={d}>{d}</option>)}</select><select className="field" value={filter.crop} onChange={(e) => setFilter({ ...filter, crop: e.target.value })}><option value="">All crops</option>{crops.map((c) => <option key={c}>{c}</option>)}</select><select className="field" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}><option value="">All types</option><option>tip</option><option>question</option><option>experience</option></select></div>
      {loading ? <LoadingSpinner /> : <section className="space-y-4">{posts.map((p) => <PostCard key={p._id} post={p} like={like} comment={comment} />)}</section>}
      <button className="fixed bottom-6 right-6 rounded-full bg-community px-5 py-3 font-bold text-white shadow-lg" onClick={() => setModal(true)}>Post Karo</button>
      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="panel w-full max-w-lg space-y-3"><h2 className="text-xl font-bold">New post</h2><select className="field" value={draft.crop} onChange={(e) => setDraft({ ...draft, crop: e.target.value })}>{crops.map((c) => <option key={c}>{c}</option>)}</select><select className="field" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option>tip</option><option>question</option><option>experience</option></select><textarea className="field min-h-32" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /><div className="flex justify-end gap-2"><button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button><button className="btn-primary" onClick={create}>Post</button></div></div></div>}
    </div>
  );
};

const PostCard = ({ post, like, comment }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  return (
    <article className="panel">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold">{post.author?.name || 'Farmer'}</h2><p className="text-sm text-muted">{post.district} · {post.crop} · {timeAgo(post.createdAt)}</p></div><span className="badge bg-community/10 text-community">{post.type}</span></div>
      <p className="mt-3">{post.content}</p>
      <div className="mt-4 flex gap-2"><button className="btn-secondary" onClick={() => like(post._id)}>Like ({post.likes?.length || 0})</button><button className="btn-secondary" onClick={() => setOpen(!open)}>Comments ({post.comments?.length || 0})</button></div>
      {open && <div className="mt-3 space-y-2 border-t border-line pt-3">{post.comments?.map((c) => <p className="text-sm" key={c._id}><b>{c.author?.name}:</b> {c.content}</p>)}<div className="flex gap-2"><input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write comment" /><button className="btn-primary" onClick={() => { comment(post._id, text); setText(''); }}>Send</button></div></div>}
    </article>
  );
};

export default FasalSaathi;
