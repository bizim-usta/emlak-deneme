import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-6">Bize Ulaşın</h1>
          <p className="text-navy/50 max-w-2xl mx-auto text-lg">
            Sorularınız, görüşleriniz veya gayrimenkul danışmanlığı talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: Phone, title: 'Telefon', value: '+90 (212) 555 00 00', desc: 'Hafta içi 09:00 - 18:00' },
              { icon: Mail, title: 'E-posta', value: 'info@numanemlak.com', desc: '7/24 bize yazabilirsiniz' },
              { icon: MapPin, title: 'Ofis Adresi', value: 'Atatürk Bulvarı No:123', desc: 'Şişli, İstanbul' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-navy font-semibold mb-1">{item.value}</p>
                <p className="text-sm text-navy/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-navy p-10 md:p-16 rounded-[3rem] text-white shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-8">Mesaj Gönderin</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Ad Soyad</label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Telefon</label>
                  <input
                    type="tel"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="+90"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Mesajınız</label>
                  <textarea
                    rows={5}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="button"
                    className="w-full md:w-auto px-12 py-5 bg-white text-navy font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Gönder</span>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
