import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const EMPTY_FORM = {
  title: '',
  location: '',
  year: '',
  category: '',
  image: '',
  area: '',
};

export default function AdminDashboard() {
  const { projects, addProject, updateProject, deleteProject, inboxMessages, markMessageRead, siteSettings, updateSiteSettings, resetSiteSettings } =
    useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('projects');
  const [settingsTab, setSettingsTab] = useState('global');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Site settings local form state – re-seed when siteSettings changes
  const [s, setS] = useState(siteSettings);
  useEffect(() => { setS(siteSettings); }, [siteSettings]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('atelier_admin_token');
    navigate('/admin', { replace: true });
  };

  // ---- Project handlers ----
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const year = form.year || new Date().getFullYear().toString();

    const data = {
      title: form.title,
      location: form.location,
      year,
      category: form.category,
      area: form.area,
      image: form.image?.trim() || '',
    };

    if (editingId) {
      updateProject(editingId, data);
      flash('Proje güncellendi.');
    } else {
      addProject(data);
      flash('Proje eklendi.');
    }

    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      location: project.location,
      year: project.year,
      category: project.category,
      image: project.image || '',
      area: project.area || '',
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (project) => {
    if (window.confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) {
      deleteProject(project.id);
      flash('Proje silindi.');
    }
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
  };

  // ---- Settings handlers ----
  const updateS = (field, value) => setS({ ...s, [field]: value });

  const saveSection = (fields) => {
    updateSiteSettings(fields);
    flash('Site ayarları güncellendi.');
  };

  const handleNavLinkChange = (index, field, value) => {
    const next = [...s.navLinks];
    next[index] = { ...next[index], [field]: value };
    updateS('navLinks', next);
  };

  const addNavLink = () => {
    const newId = 'nav' + Date.now().toString(36);
    updateS('navLinks', [...s.navLinks, { id: newId, label: '', href: '#' }]);
  };

  const removeNavLink = (index) => {
    if (s.navLinks.length <= 1) return;
    updateS('navLinks', s.navLinks.filter((_, i) => i !== index));
  };

  const handleStatChange = (index, field, value) => {
    const next = [...s.stats];
    next[index] = { ...next[index], [field]: value };
    updateS('stats', next);
  };

  const addStat = () => {
    const newId = 'stat' + Date.now().toString(36);
    updateS('stats', [...s.stats, { id: newId, value: '', label: '' }]);
  };

  const removeStat = (index) => {
    if (s.stats.length <= 1) return;
    updateS('stats', s.stats.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index, field, value) => {
    const next = [...s.services];
    next[index] = { ...next[index], [field]: value };
    updateS('services', next);
  };

  const handleServiceDetailsChange = (index, detailsStr) => {
    const next = [...s.services];
    next[index] = { ...next[index], details: detailsStr.split('\n').filter((l) => l.trim()) };
    updateS('services', next);
  };

  const handleFooterSocialChange = (index, value) => {
    const next = [...s.footerSocialLinks];
    next[index] = { ...next[index], href: value };
    updateS('footerSocialLinks', next);
  };

  // ---- Shared styles ----
  const inputClass =
    'w-full border-b border-[#3D3A36] bg-transparent px-1 py-3 font-sans text-sm text-[#FAF8F5] outline-none transition-colors placeholder:text-[#5C5752] focus:border-[#B8956A]';

  const labelClass =
    'mb-1.5 block font-sans text-[10px] font-medium tracking-widest uppercase text-[#8B8580]';

  const sectionClass = 'mb-10 border border-[#3D3A36] bg-[#252320] p-6 sm:p-8';

  const btnPrimary =
    'border border-[#B8956A] bg-[#B8956A] px-6 py-2.5 font-sans text-xs font-medium tracking-widest uppercase text-[#2D2A26] transition-all duration-500 hover:bg-transparent hover:text-[#B8956A]';

  const btnSecondary =
    'border border-[#3D3A36] px-6 py-2.5 font-sans text-xs font-medium tracking-widest uppercase text-[#8B8580] transition-all duration-500 hover:border-[#5C5752] hover:text-[#FAF8F5]';

  const unreadCount = inboxMessages.filter((m) => !m.read).length;

  return (
    <div className="flex min-h-screen bg-[#2D2A26] text-[#FAF8F5]">
      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-fade-in-down">
          <span className="inline-block border border-[#B8956A]/40 bg-[#2D2A26] px-6 py-2.5 font-sans text-xs tracking-wider text-[#B8956A] shadow-lg">
            {toast}
          </span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-[#3D3A36] bg-[#252320]">
        <div className="border-b border-[#3D3A36] px-6 py-6">
          <h1 className="font-serif text-lg font-semibold tracking-[0.2em] text-[#FAF8F5]">
            {s.logoText}
          </h1>
          <span className="mt-1 block font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
            Admin Panel
          </span>
        </div>

        <nav className="flex flex-1 flex-col p-4">
          <button
            onClick={() => { setActiveTab('projects'); setSelectedMessage(null); }}
            className={`flex items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs font-medium tracking-wider transition-all duration-300 ${
              activeTab === 'projects'
                ? 'bg-[#2D2A26] text-[#B8956A]'
                : 'text-[#8B8580] hover:bg-[#2D2A26]/50 hover:text-[#FAF8F5]'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Projeler
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setShowForm(false); }}
            className={`mt-1 flex items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs font-medium tracking-wider transition-all duration-300 ${
              activeTab === 'settings'
                ? 'bg-[#2D2A26] text-[#B8956A]'
                : 'text-[#8B8580] hover:bg-[#2D2A26]/50 hover:text-[#FAF8F5]'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Site Ayarları
          </button>

          <button
            onClick={() => { setActiveTab('inbox'); setShowForm(false); }}
            className={`mt-1 flex items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs font-medium tracking-wider transition-all duration-300 ${
              activeTab === 'inbox'
                ? 'bg-[#2D2A26] text-[#B8956A]'
                : 'text-[#8B8580] hover:bg-[#2D2A26]/50 hover:text-[#FAF8F5]'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="flex flex-1 items-center justify-between">
              Gelen Kutusu
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#B8956A] px-1.5 font-sans text-[10px] font-semibold text-[#2D2A26]">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
        </nav>

        <div className="border-t border-[#3D3A36] p-4 space-y-2">
          <a
            href="/"
            className="flex items-center gap-3 rounded-sm px-4 py-2.5 font-sans text-xs tracking-wider text-[#8B8580] transition-colors hover:bg-[#2D2A26]/50 hover:text-[#FAF8F5]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Siteyi Gör
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-4 py-2.5 font-sans text-xs tracking-wider text-[#8B8580] transition-colors hover:bg-[#2D2A26]/50 hover:text-red-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Çıkış
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-[1100px]">
          {/* ==================== PROJECTS TAB ==================== */}
          {activeTab === 'projects' && (
            <>
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium tracking-tight">Projeler</h2>
                  <p className="mt-1 font-sans text-sm text-[#8B8580]">
                    {projects.length} proje kayıtlı
                  </p>
                </div>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="border border-[#B8956A]/40 px-6 py-3 font-sans text-xs font-medium tracking-widest uppercase text-[#B8956A] transition-all duration-500 hover:border-[#B8956A] hover:bg-[#B8956A] hover:text-[#2D2A26]"
                  >
                    + Yeni Proje
                  </button>
                )}
              </div>

              {/* Add / Edit form */}
              {showForm && (
                <div className="mb-12 animate-fade-in border border-[#3D3A36] bg-[#252320] p-6 sm:p-8">
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">
                    {editingId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Primary fields */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Başlık *</label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="Villa Cortina"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Konum *</label>
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="Lake Como, Italy"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Kategori *</label>
                        <input
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="Mimari & Peyzaj"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Yıl</label>
                        <input
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder={new Date().getFullYear().toString()}
                        />
                      </div>
                    </div>

                    {/* Extra fields */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Proje Alanı</label>
                        <input
                          name="area"
                          value={form.area}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="500 m²"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Görsel URL</label>
                        <input
                          type="url"
                          name="image"
                          value={form.image}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className="border border-[#B8956A] bg-[#B8956A] px-8 py-3 font-sans text-xs font-medium tracking-widest uppercase text-[#2D2A26] transition-all duration-500 hover:bg-transparent hover:text-[#B8956A]"
                      >
                        {editingId ? 'Güncelle' : 'Ekle'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="border border-[#3D3A36] px-8 py-3 font-sans text-xs font-medium tracking-widest uppercase text-[#8B8580] transition-all duration-500 hover:border-[#5C5752] hover:text-[#FAF8F5]"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Project table */}
              {projects.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-sans text-sm text-[#5C5752]">Henüz proje eklenmedi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#3D3A36]">
                        <th className="pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                          Görsel
                        </th>
                        <th className="pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                          Başlık
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] md:table-cell">
                          Konum
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] sm:table-cell">
                          Kategori
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] lg:table-cell">
                          Alan
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] xl:table-cell">
                          Yıl
                        </th>
                        <th className="pb-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr
                          key={project.id}
                          className="border-b border-[#3D3A36]/50 transition-colors hover:bg-[#252320]/50"
                        >
                          <td className="py-4 pr-4">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="h-10 w-14 rounded-sm object-cover"
                            />
                          </td>
                          <td className="py-4 pr-4 font-sans text-sm font-medium">
                            {project.title}
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-sm text-[#8B8580] md:table-cell">
                            {project.location}
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-xs text-[#8B8580] sm:table-cell">
                            {project.category}
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-xs text-[#8B8580] lg:table-cell">
                            {project.area || '—'}
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-sm text-[#8B8580] xl:table-cell">
                            {project.year}
                          </td>
                          <td className="py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(project)}
                                className="font-sans text-xs tracking-wider text-[#B8956A] transition-colors hover:text-[#D4B78A]"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDelete(project)}
                                className="font-sans text-xs tracking-wider text-[#8B8580] transition-colors hover:text-red-400"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ==================== SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-medium tracking-tight">Site Ayarları</h2>
                  <p className="mt-1 font-sans text-sm text-[#8B8580]">
                    Anasayfadaki tüm içerikleri buradan yönetin
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Tüm site ayarlarını varsayılana döndürmek istediğinize emin misiniz?')) {
                      resetSiteSettings();
                      flash('Site ayarları sıfırlandı.');
                    }
                  }}
                  className="border border-red-400/30 px-5 py-2.5 font-sans text-[10px] font-medium tracking-widest uppercase text-red-400/60 transition-all duration-500 hover:border-red-400/60 hover:text-red-400"
                >
                  Varsayılana Dön
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="mb-8 flex flex-wrap gap-2 border-b border-[#3D3A36] pb-0">
                {[
                  { key: 'global', label: 'Genel' },
                  { key: 'hero', label: 'Hero' },
                  { key: 'about', label: 'Hakkımızda' },
                  { key: 'stats', label: 'İstatistikler' },
                  { key: 'services', label: 'Hizmetler' },
                  { key: 'footer', label: 'Footer' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSettingsTab(tab.key)}
                    className={`px-5 py-3 font-sans text-xs font-medium tracking-wider transition-all duration-300 ${
                      settingsTab === tab.key
                        ? 'border-b-2 border-[#B8956A] text-[#B8956A]'
                        : 'text-[#5C5752] hover:text-[#8B8580]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ---- GLOBAL SETTINGS ---- */}
              {settingsTab === 'global' && (
                <div className={sectionClass}>
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">Genel Ayarlar</h3>

                  <div className="mb-8">
                    <label className={labelClass}>Logo Metni</label>
                    <input
                      value={s.logoText}
                      onChange={(e) => updateS('logoText', e.target.value)}
                      className={inputClass}
                      placeholder="ATELIER"
                    />
                  </div>

                  <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                      <label className={labelClass + ' mb-0'}>Navigasyon Linkleri</label>
                      <button
                        type="button"
                        onClick={addNavLink}
                        className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider text-[#B8956A] transition-colors hover:text-[#D4B78A]"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Link Ekle
                      </button>
                    </div>
                    <div className="space-y-3">
                      {s.navLinks.map((link, i) => (
                        <div key={link.id} className="flex items-center gap-3">
                          <input
                            value={link.label}
                            onChange={(e) => handleNavLinkChange(i, 'label', e.target.value)}
                            className={inputClass + ' flex-1'}
                            placeholder="Menü başlığı"
                          />
                          <input
                            value={link.href}
                            onChange={(e) => handleNavLinkChange(i, 'href', e.target.value)}
                            className={inputClass + ' w-36'}
                            placeholder="#section"
                          />
                          {s.navLinks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeNavLink(i)}
                              className="shrink-0 p-2 text-[#5C5752] transition-colors hover:text-red-400"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => saveSection({ logoText: s.logoText, navLinks: s.navLinks })} className={btnPrimary}>
                    Değişiklikleri Kaydet
                  </button>
                </div>
              )}

              {/* ---- HERO SETTINGS ---- */}
              {settingsTab === 'hero' && (
                <div className={sectionClass}>
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">Hero Bölümü</h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Tagline</label>
                      <input value={s.heroTagline} onChange={(e) => updateS('heroTagline', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Buton Metni</label>
                      <input value={s.heroCtaText} onChange={(e) => updateS('heroCtaText', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Başlık (Satır 1)</label>
                      <input value={s.heroHeadingLine1} onChange={(e) => updateS('heroHeadingLine1', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Başlık (Satır 2 - italik)</label>
                      <input value={s.heroHeadingLine2} onChange={(e) => updateS('heroHeadingLine2', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Açıklama Metni</label>
                    <textarea value={s.heroDescription} onChange={(e) => updateS('heroDescription', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Arka Plan Görsel URL</label>
                    <div className="flex items-start gap-4">
                      <input value={s.heroImage} onChange={(e) => updateS('heroImage', e.target.value)} className={inputClass + ' flex-1'} />
                      {s.heroImage && (
                        <img src={s.heroImage} alt="" className="h-14 w-24 rounded-sm object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Scroll Göstergesi Metni</label>
                    <input value={s.heroScrollText} onChange={(e) => updateS('heroScrollText', e.target.value)} className={inputClass + ' max-w-xs'} />
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => saveSection({
                        heroTagline: s.heroTagline, heroHeadingLine1: s.heroHeadingLine1, heroHeadingLine2: s.heroHeadingLine2,
                        heroDescription: s.heroDescription, heroImage: s.heroImage, heroCtaText: s.heroCtaText, heroScrollText: s.heroScrollText,
                      })}
                      className={btnPrimary}
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* ---- ABOUT SETTINGS ---- */}
              {settingsTab === 'about' && (
                <div className={sectionClass}>
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">Hakkımızda Bölümü</h3>

                  <div className="mb-6">
                    <label className={labelClass}>Üst Başlık (Badge)</label>
                    <input value={s.aboutSubtitle} onChange={(e) => updateS('aboutSubtitle', e.target.value)} className={inputClass + ' max-w-sm'} />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Başlık (Satır 1)</label>
                      <input value={s.aboutHeadingLine1} onChange={(e) => updateS('aboutHeadingLine1', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Başlık (Satır 2)</label>
                      <input value={s.aboutHeadingLine2} onChange={(e) => updateS('aboutHeadingLine2', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Açıklama (1. Paragraf)</label>
                    <textarea value={s.aboutDescription1} onChange={(e) => updateS('aboutDescription1', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Açıklama (2. Paragraf)</label>
                    <textarea value={s.aboutDescription2} onChange={(e) => updateS('aboutDescription2', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Görsel URL</label>
                    <div className="flex items-start gap-4">
                      <input value={s.aboutImage} onChange={(e) => updateS('aboutImage', e.target.value)} className={inputClass + ' flex-1'} />
                      {s.aboutImage && (
                        <img src={s.aboutImage} alt="" className="h-14 w-24 rounded-sm object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => saveSection({
                        aboutSubtitle: s.aboutSubtitle, aboutHeadingLine1: s.aboutHeadingLine1, aboutHeadingLine2: s.aboutHeadingLine2,
                        aboutDescription1: s.aboutDescription1, aboutDescription2: s.aboutDescription2, aboutImage: s.aboutImage,
                      })}
                      className={btnPrimary}
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* ---- STATS SETTINGS ---- */}
              {settingsTab === 'stats' && (
                <div className={sectionClass}>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-serif text-lg font-medium tracking-tight">İstatistikler</h3>
                    <button
                      type="button"
                      onClick={addStat}
                      className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider text-[#B8956A] transition-colors hover:text-[#D4B78A]"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      İstatistik Ekle
                    </button>
                  </div>

                  <div className="space-y-4">
                    {s.stats.map((stat, i) => (
                      <div key={stat.id} className="flex items-center gap-4">
                        <div className="flex-1 grid gap-4 sm:grid-cols-2">
                          <input
                            value={stat.value}
                            onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                            className={inputClass}
                            placeholder="Değer (örn: 25+)"
                          />
                          <input
                            value={stat.label}
                            onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                            className={inputClass}
                            placeholder="Etiket (örn: Yıllık Ustalık)"
                          />
                        </div>
                        {s.stats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStat(i)}
                            className="shrink-0 p-2 text-[#5C5752] transition-colors hover:text-red-400"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button onClick={() => saveSection({ stats: s.stats })} className={btnPrimary}>
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* ---- SERVICES SETTINGS ---- */}
              {settingsTab === 'services' && (
                <div className={sectionClass}>
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">Hizmetler Bölümü</h3>

                  <div className="grid gap-6 sm:grid-cols-2 mb-8">
                    <div>
                      <label className={labelClass}>Üst Başlık (Badge)</label>
                      <input value={s.servicesSectionTitle} onChange={(e) => updateS('servicesSectionTitle', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 mb-8">
                    <div>
                      <label className={labelClass}>Başlık (Satır 1)</label>
                      <input value={s.servicesHeadingLine1} onChange={(e) => updateS('servicesHeadingLine1', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Başlık (Satır 2)</label>
                      <input value={s.servicesHeadingLine2} onChange={(e) => updateS('servicesHeadingLine2', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-10">
                    {s.services.map((service, i) => (
                      <div key={service.number} className="border-t border-[#3D3A36] pt-8">
                        <div className="grid gap-5 sm:grid-cols-3">
                          <div>
                            <label className={labelClass}>Numara</label>
                            <input value={service.number} onChange={(e) => handleServiceChange(i, 'number', e.target.value)} className={inputClass} placeholder="01" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelClass}>Başlık</label>
                            <input value={service.title} onChange={(e) => handleServiceChange(i, 'title', e.target.value)} className={inputClass} />
                          </div>
                        </div>
                        <div className="mt-5">
                          <label className={labelClass}>Açıklama</label>
                          <textarea value={service.description} onChange={(e) => handleServiceChange(i, 'description', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                        </div>
                        <div className="mt-5">
                          <label className={labelClass}>Detaylar (her satır bir madde)</label>
                          <textarea
                            value={service.details.join('\n')}
                            onChange={(e) => handleServiceDetailsChange(i, e.target.value)}
                            rows={5}
                            className={`${inputClass} resize-y`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => saveSection({
                        servicesSectionTitle: s.servicesSectionTitle, servicesHeadingLine1: s.servicesHeadingLine1,
                        servicesHeadingLine2: s.servicesHeadingLine2, services: s.services,
                      })}
                      className={btnPrimary}
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* ---- FOOTER SETTINGS ---- */}
              {settingsTab === 'footer' && (
                <div className={sectionClass}>
                  <h3 className="mb-8 font-serif text-lg font-medium tracking-tight">Footer Bölümü</h3>

                  <div>
                    <label className={labelClass}>Stüdyo Açıklaması</label>
                    <textarea value={s.footerDescription} onChange={(e) => updateS('footerDescription', e.target.value)} rows={3} className={`${inputClass} resize-y`} />
                  </div>

                  <div className="mt-6">
                    <label className={labelClass}>Stüdyo Etiketi</label>
                    <input value={s.footerStudioLabel} onChange={(e) => updateS('footerStudioLabel', e.target.value)} className={inputClass + ' max-w-xs'} />
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Adres (Satır 1)</label>
                      <input value={s.footerAddressLine1} onChange={(e) => updateS('footerAddressLine1', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Adres (Satır 2)</label>
                      <input value={s.footerAddressLine2} onChange={(e) => updateS('footerAddressLine2', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>E-posta</label>
                      <input value={s.footerEmail} onChange={(e) => updateS('footerEmail', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Telefon</label>
                      <input value={s.footerPhone} onChange={(e) => updateS('footerPhone', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className={labelClass}>Sosyal Medya Başlığı</label>
                    <input value={s.footerSocialTitle} onChange={(e) => updateS('footerSocialTitle', e.target.value)} className={inputClass + ' max-w-xs'} />
                  </div>

                  <div className="mt-6 space-y-2">
                    <label className={labelClass}>Sosyal Medya Linkleri</label>
                    {s.footerSocialLinks.map((link, i) => (
                      <div key={link.label} className="flex items-center gap-3">
                        <input value={link.label} onChange={() => {}} className={inputClass + ' w-36'} disabled />
                        <input value={link.href} onChange={(e) => handleFooterSocialChange(i, e.target.value)} className={inputClass + ' flex-1'} placeholder="https://..." />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Copyright Metni ({'{year}'} = otomatik yıl)</label>
                      <input value={s.footerCopyright} onChange={(e) => updateS('footerCopyright', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Alt Tagline</label>
                      <input value={s.footerTagline} onChange={(e) => updateS('footerTagline', e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => saveSection({
                        footerDescription: s.footerDescription, footerAddressLine1: s.footerAddressLine1,
                        footerAddressLine2: s.footerAddressLine2, footerEmail: s.footerEmail, footerPhone: s.footerPhone,
                        footerSocialTitle: s.footerSocialTitle, footerSocialLinks: s.footerSocialLinks,
                        footerCopyright: s.footerCopyright, footerTagline: s.footerTagline, footerStudioLabel: s.footerStudioLabel,
                      })}
                      className={btnPrimary}
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================== INBOX TAB ==================== */}
          {activeTab === 'inbox' && (
            <>
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-medium tracking-tight">Gelen Kutusu</h2>
                <p className="mt-1 font-sans text-sm text-[#8B8580]">
                  {inboxMessages.length} mesaj — {unreadCount} okunmamış
                </p>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_380px] lg:gap-6">
                {/* Message list */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#3D3A36]">
                        <th className="pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                          İsim
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] sm:table-cell">
                          Proje Türü
                        </th>
                        <th className="hidden pb-4 pr-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752] lg:table-cell">
                          Tarih
                        </th>
                        <th className="pb-4 font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inboxMessages.map((msg) => (
                        <tr
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.read) markMessageRead(msg.id);
                          }}
                          className={`cursor-pointer border-b border-[#3D3A36]/50 transition-colors hover:bg-[#252320]/50 ${
                            selectedMessage?.id === msg.id ? 'bg-[#252320]' : ''
                          }`}
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2.5">
                              {!msg.read && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#B8956A]" />
                              )}
                              <div>
                                <p className="font-sans text-sm font-medium">{msg.name}</p>
                                <p className="font-sans text-xs text-[#5C5752]">{msg.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-xs text-[#8B8580] sm:table-cell">
                            {msg.projectType}
                          </td>
                          <td className="hidden py-4 pr-4 font-sans text-xs text-[#8B8580] lg:table-cell">
                            {new Date(msg.date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-block font-sans text-[10px] font-medium tracking-wider uppercase ${
                                msg.read ? 'text-[#5C5752]' : 'text-[#B8956A]'
                              }`}
                            >
                              {msg.read ? 'Okundu' : 'Yeni'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Message detail panel */}
                <div className="mt-6 lg:mt-0">
                  {selectedMessage ? (
                    <div className="animate-fade-in border border-[#3D3A36] bg-[#252320] p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-serif text-base font-medium">Mesaj Detayı</h3>
                        <button
                          onClick={() => setSelectedMessage(null)}
                          className="p-1 font-sans text-xs text-[#5C5752] transition-colors hover:text-[#FAF8F5]"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                            Gönderen
                          </span>
                          <p className="mt-0.5 font-sans text-sm">{selectedMessage.name}</p>
                          <p className="font-sans text-xs text-[#8B8580]">{selectedMessage.email}</p>
                        </div>
                        <div>
                          <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                            Proje Türü
                          </span>
                          <p className="mt-0.5 font-sans text-sm text-[#8B8580]">
                            {selectedMessage.projectType}
                          </p>
                        </div>
                        <div>
                          <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                            Tarih
                          </span>
                          <p className="mt-0.5 font-sans text-sm text-[#8B8580]">
                            {new Date(selectedMessage.date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5C5752]">
                            Mesaj
                          </span>
                          <p className="mt-2 font-sans text-sm leading-relaxed text-[#D4D0CB]">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button className="border border-[#B8956A]/40 px-5 py-2.5 font-sans text-[10px] font-medium tracking-widest uppercase text-[#B8956A] transition-all duration-500 hover:border-[#B8956A] hover:bg-[#B8956A] hover:text-[#2D2A26]">
                          Yanıtla
                        </button>
                        <button className="border border-[#3D3A36] px-5 py-2.5 font-sans text-[10px] font-medium tracking-widest uppercase text-[#8B8580] transition-all duration-500 hover:border-[#5C5752] hover:text-[#FAF8F5]">
                          Arşivle
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[200px] items-center justify-center border border-[#3D3A36]/50 bg-[#252320]/30 lg:min-h-0">
                      <p className="font-sans text-sm text-[#5C5752]">
                        Detayları görüntülemek için bir mesaj seçin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
