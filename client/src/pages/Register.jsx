import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { crops, districts, errText } from './shared';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', password: '', district: 'Lucknow', landSize: 1, primaryCrop: 'Gehu', state: 'Uttar Pradesh' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || form.phone.length < 10 || form.password.length < 6) return setError('Please fill all fields correctly.');
    setSaving(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(errText(err));
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-xl panel space-y-4">
      <h1 className="text-2xl font-bold">{t('register')}</h1>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {[['name', t('name')], ['phone', t('phone')], ['password', t('password')]].map(([key, label]) => (
        <label key={key} className="block text-sm font-semibold">{label}<input className="field mt-1" type={key === 'password' ? 'password' : 'text'} value={form[key]} onChange={(e) => update(key, e.target.value)} /></label>
      ))}
      <label className="block text-sm font-semibold">{t('district')}<select className="field mt-1" value={form.district} onChange={(e) => update('district', e.target.value)}>{districts.map((d) => <option key={d}>{d}</option>)}</select></label>
      <label className="block text-sm font-semibold">{t('landSize')} (acres)<input className="field mt-1" type="number" min="0" step="0.1" value={form.landSize} onChange={(e) => update('landSize', e.target.value)} /></label>
      <label className="block text-sm font-semibold">{t('primaryCrop')}<select className="field mt-1" value={form.primaryCrop} onChange={(e) => update('primaryCrop', e.target.value)}>{crops.map((c) => <option key={c}>{c}</option>)}</select></label>
      <button className="btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : t('register')}</button>
    </form>
  );
};

export default Register;
