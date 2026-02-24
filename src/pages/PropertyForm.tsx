import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';
import { ROOM_COUNTS } from '@/src/lib/utils';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    squareMeters: '',
    roomCount: '2+1',
    floor: '',
    buildingAge: '',
    type: 'SALE',
    location: '',
    status: 'ACTIVE',
    images: [] as string[],
  });

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      fetch(`/api/properties/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            price: data.price.toString(),
            squareMeters: data.squareMeters.toString(),
            floor: data.floor.toString(),
            buildingAge: data.buildingAge.toString(),
          });
          setFetching(false);
        });
    }
  }, [id, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      squareMeters: parseInt(formData.squareMeters),
      floor: parseInt(formData.floor),
      buildingAge: parseInt(formData.buildingAge),
    };

    const url = id ? `/api/admin/properties/${id}` : '/api/admin/properties';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate('/admin');
    } else {
      alert('Bir hata oluştu');
    }
    setLoading(false);
  };

  const addImage = () => {
    if (imageUrl) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  if (fetching) return <div className="p-12 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center text-navy/50 hover:text-navy mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Geri Dön
      </button>

      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-navy">
          {id ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-navy mb-3">İlan Başlığı</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Kadıköy'de Deniz Manzaralı Lüks Daire"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-navy mb-3">Fiyat (TL)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-3">İlan Tipi</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SALE">Satılık</option>
                <option value="RENT">Kiralık</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-navy mb-3">Konum</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Kadıköy, İstanbul"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-navy mb-3">m²</label>
              <input
                type="number"
                required
                value={formData.squareMeters}
                onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-3">Oda Sayısı</label>
              <select
                value={formData.roomCount}
                onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {ROOM_COUNTS.map(rc => (
                  <option key={rc} value={rc}>{rc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-3">Kat</label>
              <input
                type="number"
                required
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-3">Bina Yaşı</label>
              <input
                type="number"
                required
                value={formData.buildingAge}
                onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-navy mb-3">Açıklama</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="İlan detaylarını buraya yazın..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy mb-3">Durum</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ACTIVE">Aktif (Yayında)</option>
              <option value="PASSIVE">Pasif (Gizli)</option>
            </select>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-navy">Fotoğraflar</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Fotoğraf URL'si girin..."
            />
            <button
              type="button"
              onClick={addImage}
              className="px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all"
            >
              Ekle
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-navy/20">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold">Fotoğraf Yok</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-12 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Kaydediliyor...' : 'İlanı Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
