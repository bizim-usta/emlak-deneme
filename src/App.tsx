import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PropertyForm from './pages/PropertyForm';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/ilanlar" element={<Layout><ListingsPage /></Layout>} />
        <Route path="/ilan/:id" element={<Layout><PropertyDetailPage /></Layout>} />
        <Route path="/hakkimizda" element={<Layout><AboutPage /></Layout>} />
        <Route path="/iletisim" element={<Layout><ContactPage /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ilan-ekle" element={<PropertyForm />} />
        <Route path="/admin/ilan-duzenle/:id" element={<PropertyForm />} />
      </Routes>
    </Router>
  );
}
