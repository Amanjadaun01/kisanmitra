import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { crops, districts, errText } from './shared';

const initialForm = {
  name: '',
  phone: '',
  password: '',
  district: '',
  landSize: '',
  primaryCrop: '',
  state: 'Uttar Pradesh'
};

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = (values) => {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!/^\d{10,}$/.test(values.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
    if (values.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (!values.district) nextErrors.district = 'District is required.';
    if (!values.landSize || Number(values.landSize) <= 0) nextErrors.landSize = 'Enter your land size.';
    if (!values.primaryCrop) nextErrors.primaryCrop = 'Primary crop is required.';
    return nextErrors;
  };

  const fieldErrors = validate(form);
  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };
  const blur = (key) => setTouched((current) => ({ ...current, [key]: true }));
  const showError = (key) => touched[key] && fieldErrors[key];

  const submit = async (e) => {
    e.preventDefault();
    const nextTouched = Object.keys(initialForm).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    const nextErrors = validate(form);
    setTouched(nextTouched);
    if (Object.keys(nextErrors).length) {
      setError('Please fill all fields correctly.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await register({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        landSize: Number(form.landSize)
      });
      setForm(initialForm);
      setTouched({});
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
        <label key={key} className="block text-sm font-semibold">
          {label}
          <input
            className="field mt-1"
            type={key === 'password' ? 'password' : 'text'}
            value={form[key]}
            onBlur={() => blur(key)}
            onChange={(e) => update(key, e.target.value)}
          />
          {showError(key) && <span className="mt-1 block text-xs text-red-600">{fieldErrors[key]}</span>}
        </label>
      ))}
      <label className="block text-sm font-semibold">
        {t('district')}
        <select className="field mt-1" value={form.district} onBlur={() => blur('district')} onChange={(e) => update('district', e.target.value)}>
          <option value="">Select district</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        {showError('district') && <span className="mt-1 block text-xs text-red-600">{fieldErrors.district}</span>}
      </label>
      <label className="block text-sm font-semibold">
        {t('landSize')} (acres)
        <input className="field mt-1" type="number" min="0.1" step="0.1" value={form.landSize} onBlur={() => blur('landSize')} onChange={(e) => update('landSize', e.target.value)} />
        {showError('landSize') && <span className="mt-1 block text-xs text-red-600">{fieldErrors.landSize}</span>}
      </label>
      <label className="block text-sm font-semibold">
        {t('primaryCrop')}
        <select className="field mt-1" value={form.primaryCrop} onBlur={() => blur('primaryCrop')} onChange={(e) => update('primaryCrop', e.target.value)}>
          <option value="">Select crop</option>
          {crops.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {showError('primaryCrop') && <span className="mt-1 block text-xs text-red-600">{fieldErrors.primaryCrop}</span>}
      </label>
      <button className="btn-primary w-full" type="submit" disabled={saving}>{saving ? 'Saving...' : t('register')}</button>
    </form>
  );
};

export default Register;
