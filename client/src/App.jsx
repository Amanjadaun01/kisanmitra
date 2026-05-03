import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MandiSaarthi from './pages/MandiSaarthi';
import YojnaKhoj from './pages/YojnaKhoj';
import FasalSaathi from './pages/FasalSaathi';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const { t } = useTranslation();

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <>
      <Navbar />
      {!online && <div className="bg-amber px-4 py-2 text-center text-sm font-semibold text-white">{t('offline')}</div>}
      <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mandi" element={<ProtectedRoute><MandiSaarthi /></ProtectedRoute>} />
          <Route path="/yojna" element={<ProtectedRoute><YojnaKhoj /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><FasalSaathi /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
