import { useState, useEffect } from 'react';
import { Search, ArrowRight, Home, Key, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import PropertyCard from '@/src/components/PropertyCard';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties?status=ACTIVE')
      .then(res => res.json())
      .then(data => {
        setProperties(data.slice(0, 6));
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/id/1031/1920/1080?blur=2"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Hayalinizdeki Evi <br />
            <span className="text-blue-400 italic">Birlikte</span> Bulalım
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
          >
            Binlerce güncel ilan arasından size en uygun olanı seçin. 
            Güvenilir ve hızlı gayrimenkul çözümleri.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
          >
            <div className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="text-navy/30 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Şehir, semt veya ilan başlığı..."
                className="w-full bg-transparent border-none focus:ring-0 text-navy placeholder:text-navy/30"
              />
            </div>
            <div className="flex gap-2 p-1">
              <Link to="/ilanlar?type=SALE" className="px-6 py-3 rounded-xl bg-navy text-white font-semibold hover:bg-navy/90 transition-colors">
                Satılık
              </Link>
              <Link to="/ilanlar?type=RENT" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                Kiralık
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-navy mb-4">Öne Çıkan İlanlar</h2>
            <p className="text-navy/50">Sizin için seçtiğimiz en yeni ve avantajlı ilanlar.</p>
          </div>
          <Link to="/ilanlar" className="hidden md:flex items-center text-blue-600 font-bold hover:underline">
            Tümünü Gör <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Neden Biz?</h2>
            <p className="text-navy/50 max-w-2xl mx-auto">
              Emlak sektöründeki 15 yıllık tecrübemizle size en iyi hizmeti sunmak için buradayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Güvenilir Hizmet', desc: 'Tüm işlemlerimiz şeffaf ve yasal prosedürlere uygundur.' },
              { icon: Home, title: 'Geniş Portföy', desc: 'Her bütçeye ve ihtiyaca uygun binlerce ilan seçeneği.' },
              { icon: Users, title: 'Uzman Kadro', desc: 'Alanında uzman danışmanlarımızla yanınızdayız.' },
              { icon: Key, title: 'Hızlı Sonuç', desc: 'İhtiyacınıza en uygun çözümü en kısa sürede üretiyoruz.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4">{item.title}</h3>
                <p className="text-navy/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img
            src="https://picsum.photos/id/1048/800/600"
            alt="Office"
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white p-8 rounded-3xl hidden md:block">
            <p className="text-4xl font-bold mb-1">15+</p>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Yıllık Tecrübe</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-navy mb-6">Numan Emlak ile Profesyonel Danışmanlık</h2>
          <p className="text-navy/60 mb-8 leading-relaxed">
            Numan Emlak olarak, gayrimenkul alım, satım ve kiralama süreçlerinizde size rehberlik ediyoruz. 
            Müşteri memnuniyetini odak noktamıza alarak, doğru fiyatlandırma ve hızlı pazarlama stratejileriyle 
            mülkünüzün değerini bulmasını sağlıyoruz.
          </p>
          <ul className="space-y-4 mb-10">
            {['Ücretsiz Ekspertiz Hizmeti', 'Profesyonel Fotoğraf Çekimi', 'Geniş İlan Ağı', 'Hukuki Danışmanlık'].map((item, i) => (
              <li key={i} className="flex items-center text-navy/80 font-medium">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/hakkimizda" className="inline-flex items-center px-8 py-4 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all">
            Daha Fazla Bilgi <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
