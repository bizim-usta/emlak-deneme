import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { formatPrice, cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch('/api/properties?status=ALL')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      });
  }, [token, navigate]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      setProperties(properties.filter((p: any) => p.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const filteredProperties = properties.filter((p: any) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white hidden md:flex flex-col">
        <div className="p-8">
          <h2 className="text-xl font-bold tracking-tight">YÖNETİM PANELİ</h2>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>İlanlar</span>
          </button>
        </nav>
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">İlan Yönetimi</h1>
              <p className="text-navy/50">Toplam {properties.length} ilan yayında.</p>
            </div>
            <button
              onClick={() => navigate('/admin/ilan-ekle')}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni İlan Ekle</span>
            </button>
          </div>

          {/* Search & Stats */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-2 mr-4" />
            <input
              type="text"
              placeholder="İlanlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent border-none focus:ring-0 text-navy placeholder:text-gray-400"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy/40">İlan</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy/40">Fiyat</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy/40">Tür</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy/40">Durum</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy/40 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-navy/40">Yükleniyor...</td></tr>
                  ) : filteredProperties.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-navy/40">İlan bulunamadı.</td></tr>
                  ) : filteredProperties.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={p.images?.[0] || 'https://picsum.photos/seed/house/100/100'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-navy line-clamp-1">{p.title}</p>
                            <p className="text-xs text-navy/40">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          p.type === 'SALE' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {p.type === 'SALE' ? 'Satılık' : 'Kiralık'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "flex items-center text-xs font-medium",
                          p.status === 'ACTIVE' ? "text-emerald-600" : "text-gray-400"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full mr-2", p.status === 'ACTIVE' ? "bg-emerald-600" : "bg-gray-400")} />
                          {p.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => navigate(`/ilan/${p.id}`)}
                            className="p-2 text-navy/40 hover:text-navy hover:bg-gray-100 rounded-lg transition-all"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/ilan-duzenle/${p.id}`)}
                            className="p-2 text-blue-600/60 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-600/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
