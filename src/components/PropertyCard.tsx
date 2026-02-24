import { Link } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, ArrowRight } from 'lucide-react';
import { formatPrice, cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number;
    location: string;
    squareMeters: number;
    roomCount: string;
    type: string;
    images: string[];
  };
  key?: any;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
    >
      <Link to={`/ilan/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] || 'https://picsum.photos/seed/house/800/600'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white",
            property.type === 'SALE' ? "bg-blue-600" : "bg-emerald-500"
          )}>
            {property.type === 'SALE' ? 'Satılık' : 'Kiralık'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-navy">{formatPrice(property.price)}</p>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/ilan/${property.id}`}>
          <h3 className="text-lg font-bold text-navy mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-navy/50 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center text-navy/70 text-sm">
            <Maximize className="w-4 h-4 mr-2 text-blue-600" />
            <span>{property.squareMeters} m²</span>
          </div>
          <div className="flex items-center text-navy/70 text-sm">
            <BedDouble className="w-4 h-4 mr-2 text-blue-600" />
            <span>{property.roomCount}</span>
          </div>
        </div>

        <Link
          to={`/ilan/${property.id}`}
          className="mt-6 w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gray-50 text-navy font-semibold hover:bg-navy hover:text-white transition-all group/btn"
        >
          <span>Detayları Gör</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
