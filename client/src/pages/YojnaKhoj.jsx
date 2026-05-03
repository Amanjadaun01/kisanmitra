import { useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { crops } from './shared';

const YojnaKhoj = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ state: 'Uttar Pradesh', landSize: 2, crop: 'Gehu', income: 250000, existingSchemes: '' });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    const { data } = await api.post('/yojna/eligible', form);
    setSchemes(data);
    setLoading(false);
  };
  const next = () => step === 5 ? submit() : setStep(step + 1);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold">Yojna Khoj</h1>
      <div className="panel">
        <div className="mb-4 h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-primary" style={{ width: `${step * 20}%` }} /></div>
        {step === 1 && <label className="font-semibold">State<select className="field mt-2" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}><option>Uttar Pradesh</option><option>Bihar</option><option>Madhya Pradesh</option></select></label>}
        {step === 2 && <label className="font-semibold">Land size: {form.landSize} acres<input className="mt-3 w-full accent-primary" type="range" min="0" max="20" step="0.5" value={form.landSize} onChange={(e) => setForm({ ...form, landSize: e.target.value })} /></label>}
        {step === 3 && <label className="font-semibold">Crop<select className="field mt-2" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>{crops.map((c) => <option key={c}>{c}</option>)}</select></label>}
        {step === 4 && <label className="font-semibold">Annual income<select className="field mt-2" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })}><option value="150000">Below Rs 1.5 lakh</option><option value="300000">Rs 1.5-3 lakh</option><option value="600000">Rs 3-6 lakh</option><option value="900000">Above Rs 6 lakh</option></select></label>}
        {step === 5 && <label className="font-semibold">Existing schemes<input className="field mt-2" placeholder="PM-KISAN, KCC..." value={form.existingSchemes} onChange={(e) => setForm({ ...form, existingSchemes: e.target.value })} /></label>}
        <div className="mt-5 flex gap-2"><button className="btn-secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button><button className="btn-primary" onClick={next}>{step === 5 ? 'Find schemes' : 'Next'}</button></div>
      </div>
      {loading && <LoadingSpinner />}
      <section className="grid gap-4 md:grid-cols-2">
        {schemes.map((s) => (
          <article className="panel" key={s._id}>
            <h2 className="text-xl font-bold">{s.name}</h2>
            <p className="font-semibold text-primary">{s.nameHindi}</p>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
            <p className="mt-3 font-bold">{s.benefit}</p>
            <p className="mt-3 text-sm"><span className="font-semibold">Documents:</span> {s.documents.join(', ')}</p>
            <details className="mt-3 rounded-md bg-paper p-3"><summary className="cursor-pointer font-semibold">Kaise Apply Karein</summary><ol className="mt-2 list-decimal pl-5 text-sm text-muted">{s.applySteps.map((a) => <li key={a}>{a}</li>)}</ol></details>
          </article>
        ))}
      </section>
    </div>
  );
};

export default YojnaKhoj;
