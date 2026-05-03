import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { errText } from './shared';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(errText(err));
    }
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-md panel space-y-4">
      <h1 className="text-2xl font-bold">{t('login')}</h1>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">{t('phone')}<input className="field mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label className="block text-sm font-semibold">{t('password')}<input className="field mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <button className="btn-primary w-full">{t('login')}</button>
      <p className="text-sm text-muted">Demo admin: 9999999999 / password123</p>
      <Link className="text-sm font-semibold text-primary" to="/register">Create farmer account</Link>
    </form>
  );
};

export default Login;
