import { motion } from 'motion/react';
import { Home, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-navy text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/id/1031/1920/1080" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8"
          >
            Hakkımızda
          </motion.h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            2010 yılından bu yana, binlerce aileyi hayallerindeki yuvaya kavuşturmanın gururunu yaşıyoruz.
          </p>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Award, title: 'Misyonumuz', desc: 'Müşterilerimize en şeffaf, güvenilir ve profesyonel gayrimenkul danışmanlığı hizmetini sunmak.' },
            { icon: Target, title: 'Vizyonumuz', desc: 'Sektördeki yenilikleri takip ederek Türkiye\'nin en güvenilen emlak markası olmak.' },
            { icon: Heart, title: 'Değerlerimiz', desc: 'Dürüstlük, şeffaflık, müşteri odaklılık ve sürekli gelişim temel prensiplerimizdir.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <item.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">{item.title}</h3>
              <p className="text-navy/50 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-bold text-navy mb-8">Hikayemiz</h2>
          <div className="space-y-6 text-navy/60 text-lg leading-relaxed">
            <p>
              Numan Emlak, 2010 yılında İstanbul'un kalbinde küçük bir ofis olarak kuruldu. 
              Kuruluşumuzdan bu yana tek bir amacımız vardı: Gayrimenkul sektöründeki 
              güven sorununu ortadan kaldırmak ve müşterilerimize gerçek bir danışmanlık deneyimi sunmak.
            </p>
            <p>
              Yıllar içinde portföyümüzü ve ekibimizi büyüterek, binlerce başarılı satış ve 
              kiralama işlemine imza attık. Bugün, modern teknolojileri geleneksel 
              hizmet anlayışımızla birleştirerek size en iyi hizmeti sunmaya devam ediyoruz.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://picsum.photos/id/1048/400/600" alt="" className="rounded-3xl shadow-xl mt-12" />
          <img src="https://picsum.photos/id/1049/400/600" alt="" className="rounded-3xl shadow-xl" />
        </div>
      </section>
    </div>
  );
}
