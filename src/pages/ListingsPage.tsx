import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/src/components/PropertyCard';
import { ROOM_COUNTS } from '@/src/lib/utils';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(searchParams).toString();
    fetch(`/api/properties?${query}`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="sticky top-28 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-navy flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-blue-600" />
                Filtrele
              </h2>
              <button 
                onClick={() => setSearchParams({})}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Temizle
              </button>
            </div>

            <div className="space-y-8">
              {/* Type */}
              <div>
                <label className="block text-sm font-bold text-navy mb-4">İlan Tipi</label>
                <div className="flex gap-2">
                  {['', 'SALE', 'RENT'].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleFilterChange('type', t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        type === t 
                          ? 'bg-navy border-navy text-white' 
                          : 'bg-white border-gray-200 text-navy hover:border-navy'
                      }`}
                    >
                      {t === '' ? 'Hepsi' : t === 'SALE' ? 'Satılık' : 'Kiralık'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold text-navy mb-4">Fiyat Aralığı (TL)</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Room Count */}
              <div>
                <label className="block text-sm font-bold text-navy mb-4">Oda Sayısı</label>
                <select
                  onChange={(e) => handleFilterChange('roomCount', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Tümü</option>
                  {ROOM_COUNTS.map(rc => (
                    <option key={rc} value={rc}>{rc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-navy">
              {properties.length} İlan Bulundu
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[1, 2, 4, 5].map(i => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Search className="w-12 h-12 text-navy/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">İlan Bulunamadı</h3>
              <p className="text-navy/50">Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
