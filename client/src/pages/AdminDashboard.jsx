import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const colors = ['#1D9E75', '#EF9F27', '#7F77DD', '#111111', '#70A9A1'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/crop-trends'), api.get('/admin/scheme-stats'), api.get('/admin/district-map'), api.get('/community/posts')])
      .then(([stats, trends, schemes, map, posts]) => setData({ stats: stats.data, trends: trends.data, schemes: schemes.data, map: map.data, posts: posts.data }));
  }, []);
  useEffect(() => {
    if (!mapEl.current || !data?.map) return;
    if (mapRef.current) mapRef.current.remove();
    const map = L.map(mapEl.current).setView([26.8, 80.9], 6);
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap' }).addTo(map);
    data.map.forEach((d) => L.circle([d.lat, d.lng], { radius: 9000 + d.farmers * 3000, color: '#1D9E75', fillOpacity: 0.35 }).addTo(map).bindPopup(`${d.district}: ${d.farmers} farmers`));
  }, [data]);
  const remove = async (id) => { await api.delete(`/community/posts/${id}`); setData((d) => ({ ...d, posts: d.posts.filter((p) => p._id !== id) })); };
  if (!data) return <LoadingSpinner />;
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-4">{[['Total Farmers', data.stats.totalFarmers], ['Districts', data.stats.districts], ['Posts', data.stats.posts], ['Popular Scheme', data.stats.popularScheme]].map(([k, v]) => <div className="panel" key={k}><p className="text-sm text-muted">{k}</p><h2 className="mt-2 text-2xl font-bold">{v}</h2></div>)}</section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Chart title="Registrations over 6 months"><LineChart data={data.trends.registrations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="farmers" stroke="#1D9E75" strokeWidth={3} /></LineChart></Chart>
        <Chart title="Top crops searched"><BarChart data={data.trends.topCrops}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis /><Tooltip /><Bar dataKey="searches" fill="#EF9F27" /></BarChart></Chart>
        <Chart title="Scheme distribution"><PieChart><Pie data={data.schemes} dataKey="value" nameKey="name" outerRadius={100}>{data.schemes.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></Chart>
        <div className="panel"><h2 className="mb-3 font-bold">Farmer density heatmap</h2><div ref={mapEl} className="h-80 rounded-md" /></div>
      </section>
      <section className="panel overflow-x-auto">
        <h2 className="mb-3 font-bold">Community posts</h2>
        <table className="w-full min-w-[720px] text-sm"><thead><tr className="text-left text-muted"><th>Farmer</th><th>District</th><th>Crop</th><th>Post</th><th></th></tr></thead><tbody>{data.posts.map((p) => <tr className="border-t border-line" key={p._id}><td className="py-3">{p.author?.name}</td><td>{p.district}</td><td>{p.crop}</td><td>{p.content}</td><td><button className="btn-secondary" onClick={() => remove(p._id)}>Delete</button></td></tr>)}</tbody></table>
      </section>
    </div>
  );
};

const Chart = ({ title, children }) => <div className="panel h-80"><h2 className="mb-3 font-bold">{title}</h2><ResponsiveContainer>{children}</ResponsiveContainer></div>;

export default AdminDashboard;
