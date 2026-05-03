import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const links = [
    ['/dashboard', t('dashboard')],
    ['/mandi', t('mandi')],
    ['/yojna', t('yojna')],
    ['/community', t('community')]
  ];
  if (user?.role === 'admin') links.push(['/admin', t('admin')]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-extrabold text-primary">KisanMitra</Link>
        <button className="rounded-md border border-line px-3 py-2 md:hidden" onClick={() => setOpen(!open)}>☰</button>
        <nav className="hidden items-center gap-2 md:flex">
          {user && links.map(([to, label]) => <NavLink key={to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`} to={to}>{label}</NavLink>)}
          <LanguageToggle />
          {user ? <button className="btn-secondary" onClick={logout}>{t('logout')}</button> : <><Link className="btn-secondary" to="/login">{t('login')}</Link><Link className="btn-primary" to="/register">{t('register')}</Link></>}
        </nav>
      </div>
      {open && (
        <div className="space-y-2 border-t border-line px-4 pb-4 md:hidden">
          {user && links.map(([to, label]) => <NavLink key={to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 font-semibold text-muted" to={to}>{label}</NavLink>)}
          <div className="flex gap-2"><LanguageToggle />{user ? <button className="btn-secondary" onClick={logout}>{t('logout')}</button> : <Link className="btn-primary" to="/login">{t('login')}</Link>}</div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
