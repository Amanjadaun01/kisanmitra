import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { crops } from './shared';

const MandiSaarthi = () => {
  const [form, setForm] = useState({ crop: 'Gehu', qty: 10, lat: 26.8467, lng: 80.9462 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const search = async () => {
    setLoading(true);
    const { data } = await api.get(`/mandi/best?crop=${form.crop}&lat=${form.lat}&lng=${form.lng}&qty=${form.qty}`);
    setResults(data.results);
    setLoading(false);
  };
  useEffect(() => { search(); }, []);
  useEffect(() => {
    if (!mapEl.current || !results.length) return;
    if (mapRef.current) mapRef.current.remove();
    const map = L.map(mapEl.current).setView([form.lat, form.lng], 7);
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap' }).addTo(map);
    L.marker([form.lat, form.lng]).addTo(map).bindPopup('Your location');
    results.forEach((m) => L.marker([m.latitude, m.longitude]).addTo(map).bindPopup(`${m.mandiName}: Rs ${m.netProfit}`));
  }, [results]);
  const detect = () => navigator.geolocation?.getCurrentPosition((pos) => setForm({ ...form, lat: pos.coords.latitude, lng: pos.coords.longitude }));
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold">Mandi Saarthi</h1>
      <div className="panel grid gap-3 md:grid-cols-5">
        <select className="field" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>{crops.map((c) => <option key={c}>{c}</option>)}</select>
        <input className="field" type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
        <input className="field" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
        <input className="field" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
        <div className="flex gap-2"><button className="btn-secondary" type="button" onClick={detect}>Locate</button><button className="btn-primary" onClick={search}>Search</button></div>
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="overflow-x-auto panel">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="text-left text-muted"><th>Mandi</th><th>Distance</th><th>Price/Quintal</th><th>Transport Cost</th><th>Net Profit</th></tr></thead>
              <tbody>{results.map((r, i) => <tr className="border-t border-line" key={r._id}><td className="py-3 font-semibold">{r.mandiName} {i === 0 && <span className="badge bg-green-100 text-green-700">Aaj Yahan Becho</span>}</td><td>{r.distanceKm} km</td><td>Rs {r.pricePerQuintal}</td><td>Rs {r.transportCost}</td><td className="font-bold text-primary">Rs {r.netProfit}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="panel h-80"><ResponsiveContainer><BarChart data={results.slice(0, 6)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="district" /><YAxis /><Tooltip /><Bar dataKey="netProfit" fill="#EF9F27" /></BarChart></ResponsiveContainer></div>
            <div className="panel"><div ref={mapEl} className="h-80 rounded-md" /></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MandiSaarthi;
