import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Info, Phone, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Ana Sayfa', path: '/', icon: Home },
  { name: 'İlanlar', path: '/ilanlar', icon: List },
  { name: 'Hakkımızda', path: '/hakkimizda', icon: Info },
  { name: 'İletişim', path: '/iletisim', icon: Phone },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
                <Home className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-navy">
                NUMAN<span className="text-blue-600">EMLAK</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === item.path ? 'text-blue-600' : 'text-navy/70'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Yönetim Paneli"
              >
                <LogIn className="w-5 h-5 text-navy/70" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-4 rounded-md text-base font-medium text-navy/70 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-4 rounded-md text-base font-medium text-navy/70 hover:bg-gray-50 hover:text-blue-600"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Yönetim Paneli</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <Home className="text-navy w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">NUMANEMLAK</span>
              </Link>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Modern gayrimenkul çözümleriyle hayallerinizdeki eve kavuşmanız için yanınızdayız. 
                Güvenilir, şeffaf ve profesyonel hizmet anlayışı.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Hızlı Bağlantılar</h4>
              <ul className="space-y-4 text-white/60">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">İletişim</h4>
              <ul className="space-y-4 text-white/60">
                <li>Atatürk Bulvarı No:123, İstanbul</li>
                <li>+90 (212) 555 00 00</li>
                <li>info@numanemlak.com</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} Numan Emlak. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/905550000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
        </svg>
      </a>
    </div>
  );
}
