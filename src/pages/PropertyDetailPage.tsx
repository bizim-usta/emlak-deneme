import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, Building, Calendar, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">İlan bulunamadı.</div>;

  const nextImage = () => setActiveImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={property.images[activeImage] || 'https://picsum.photos/seed/house/1200/800'}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {property.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeImage === i ? "bg-white w-8" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Header Info */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white",
                property.type === 'SALE' ? "bg-blue-600" : "bg-emerald-500"
              )}>
                {property.type === 'SALE' ? 'Satılık' : 'Kiralık'}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-navy uppercase tracking-wider">
                {property.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-navy mb-4">{property.title}</h1>
            <div className="flex items-center text-navy/50 text-lg">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              {property.location}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100">
            {[
              { icon: Maximize, label: 'm²', value: property.squareMeters },
              { icon: BedDouble, label: 'Oda Sayısı', value: property.roomCount },
              { icon: Building, label: 'Kat', value: property.floor },
              { icon: Calendar, label: 'Bina Yaşı', value: property.buildingAge },
            ].map((spec, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start text-blue-600 mb-2">
                  <spec.icon className="w-5 h-5 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50">{spec.label}</span>
                </div>
                <p className="text-xl font-bold text-navy">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Açıklama</h2>
            <div className="prose prose-lg text-navy/70 max-w-none whitespace-pre-wrap leading-relaxed">
              {property.description}
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Konum</h2>
            <div className="aspect-video rounded-3xl overflow-hidden border border-gray-100 grayscale opacity-80">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(property.location)}`}
                allowFullScreen
              ></iframe>
              {/* Note: In a real app, you'd use a real API key or a static map image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-navy/40 font-medium">Harita Yükleniyor...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-28 space-y-8">
            {/* Price Card */}
            <div className="bg-navy text-white p-8 rounded-3xl shadow-2xl">
              <p className="text-sm font-medium opacity-60 uppercase tracking-widest mb-2">Fiyat</p>
              <h2 className="text-4xl font-bold mb-8">{formatPrice(property.price)}</h2>
              <div className="space-y-4">
                <a
                  href={`tel:+905550000000`}
                  className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl bg-white text-navy font-bold hover:bg-white/90 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span>Hemen Ara</span>
                </a>
                <a
                  href={`https://wa.me/905550000000?text=${encodeURIComponent(`${property.title} ilanı hakkında bilgi almak istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp ile Yaz</span>
                </a>
              </div>
            </div>

            {/* Agent Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-6">Danışman Bilgileri</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img src="https://i.pravatar.cc/150?u=agent" alt="Agent" />
                </div>
                <div>
                  <p className="font-bold text-navy">Ahmet Yılmaz</p>
                  <p className="text-sm text-navy/50">Kıdemli Gayrimenkul Danışmanı</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center text-sm text-navy/70">
                  <Phone className="w-4 h-4 mr-3 text-blue-600" />
                  +90 (555) 000 00 00
                </div>
                <div className="flex items-center text-sm text-navy/70">
                  <MessageCircle className="w-4 h-4 mr-3 text-blue-600" />
                  ahmet@emlakofisi.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
