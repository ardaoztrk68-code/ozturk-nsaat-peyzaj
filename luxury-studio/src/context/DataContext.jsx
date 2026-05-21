import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { client, urlForThumb, urlForImage } from '../sanity/client';

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------
const PROJECTS_QUERY = `*[_type == "project"] | order(year desc) {
  _id,
  title, location, year, category, area,
  "image": image{ asset->{ _id, url }, hotspot },
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  logoText,
  navLinks,
  heroTagline, heroHeadingLine1, heroHeadingLine2, heroDescription,
  "heroImage": heroImage{ asset->{ _id, url }, hotspot },
  heroCtaText, heroScrollText,
  aboutSubtitle, aboutHeadingLine1, aboutHeadingLine2,
  aboutDescription1, aboutDescription2,
  "aboutImage": aboutImage{ asset->{ _id, url }, hotspot },
  stats,
  servicesSectionTitle, servicesHeadingLine1, servicesHeadingLine2,
  services,
  footerDescription, footerStudioLabel,
  footerAddressLine1, footerAddressLine2,
  footerEmail, footerPhone,
  footerSocialTitle, footerSocialLinks,
  footerCopyright, footerTagline,
}`;

// ---------------------------------------------------------------------------
// Fallback defaults – used when Sanity isn't configured yet or returns empty
// ---------------------------------------------------------------------------
const DEFAULT_PROJECTS = [
  {
    _id: '1',
    title: 'Villa Cortina',
    location: 'Lake Como, Italy',
    year: '2024',
    category: 'Mimari & Peyzaj',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
    area: '750 m²',
  },
  {
    _id: '2',
    title: 'The Glass Pavilion',
    location: 'Bel Air, California',
    year: '2023',
    category: 'Konut Mimarisi',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    area: '1,200 m²',
  },
  {
    _id: '3',
    title: 'Stone Ridge Estate',
    location: 'Scottsdale, Arizona',
    year: '2024',
    category: 'Peyzaj & Havuz Tasarımı',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    area: '580 m²',
  },
  {
    _id: '4',
    title: 'Coastal Retreat',
    location: 'Amalfi Coast, Italy',
    year: '2023',
    category: 'İnşaat & İç Mekân',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    area: '420 m²',
  },
  {
    _id: '5',
    title: 'The Oasis Residence',
    location: 'Palm Springs, California',
    year: '2024',
    category: 'Mimari & Peyzaj',
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80',
    area: '650 m²',
  },
  {
    _id: '6',
    title: 'Horizon House',
    location: 'Ibiza, Spain',
    year: '2024',
    category: 'Havuz & Dış Mekân Yaşam',
    image: 'https://images.unsplash.com/photo-1600566753086-00fcea404194?auto=format&fit=crop&w=800&q=80',
    area: '380 m²',
  },
];

const DEFAULT_SITE_SETTINGS = {
  logoText: 'ÖZTÜRK İNŞAAT & PEYZAJ',
  navLinks: [
    { id: 'projects', label: 'Projeler', href: '#projects' },
    { id: 'about', label: 'Stüdyo', href: '#about' },
    { id: 'services', label: 'Hizmetler', href: '#services' },
    { id: 'footer', label: 'İletişim', href: '#footer' },
  ],
  heroTagline: 'Mimari · İnşaat · Peyzaj',
  heroHeadingLine1: 'Zamansız Güzelliğin',
  heroHeadingLine2: 'Mekânlarını Yaratıyoruz',
  heroDescription: 'Mimari, inşaat ve peyzaj tasarımının kesişiminde, zamansız dış mekân yaşam alanları yaratan butik bir stüdyo.',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
  heroCtaText: 'Projeleri Keşfedin',
  heroScrollText: 'Aşağı',
  aboutSubtitle: 'Felsefemiz',
  aboutHeadingLine1: 'Mimarinin Doğayla',
  aboutHeadingLine2: 'Buluştuğu Nokta',
  aboutDescription1: 'En sıra dışı mekânların, mimarinin peyzajla bütünleştiği noktada ortaya çıktığına inanıyoruz. Her proje, arazinin doğal topoğrafyasına, ışığına ve dokusuna duyulan derin bir saygıyla başlar.',
  aboutDescription2: 'Geniş arazi bahçelerinden samimi avlu peyzajlarına kadar, stüdyomuz yapılı form ile yaşayan çevre arasında kusursuz bir diyalog kurar; sakin ve seçkin bir dış mekân yaşam tarzı yaratır.',
  aboutImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  stats: [
    { id: 'experience', value: '25+', label: 'Yıllık Ustalık' },
    { id: 'completed', value: '200+', label: 'Tamamlanan Proje' },
    { id: 'awards', value: '18', label: 'Tasarım Ödülü' },
  ],
  servicesSectionTitle: 'Kişiye Özel Hizmetler',
  servicesHeadingLine1: 'Baştan Sona',
  servicesHeadingLine2: 'Kusursuzluk',
  services: [
    {
      number: '01', title: 'Peyzaj Mimarisi',
      description: 'Araziyi sanata dönüştüren ana planlama ve detaylı tasarım. Toprağı, suyu ve bitki örtüsünü; on yıllar boyunca zarafetle olgunlaşan, bütüncül ve yaşanabilir kompozisyonlara dönüştürüyoruz.',
      details: ['Arazi analizi & ana planlama', 'Sert zemin & yumuşak peyzaj tasarımı', 'Dış mekân aydınlatma tasarımı', 'Doğal bitkilendirme & ekoloji', 'Sulama & drenaj sistemleri'],
    },
    {
      number: '02', title: 'Lüks Havuz Tasarımı',
      description: 'Su ile mimari arasındaki sınırı belirsizleştiren, kişiye özel su ortamları. Sonsuzluk kenarlarından doğal yüzme göletlerine kadar her havuz, heykelsi bir merkez parçasıdır.',
      details: ['Kişiye özel havuz mimarisi', 'Sonsuzluk kenarı & kaybolan kenar', 'Doğal yüzme göletleri', 'Spa & wellness entegrasyonu', 'Su ögesi tasarımı'],
    },
    {
      number: '03', title: 'Seçkin İnşaat',
      description: 'Temelden son rötuşa kadar kusursuz uygulama. İnşaat ekibimiz, ödünsüz kalite için dünya çapında tedarik edilen malzemelerle mimari hassasiyet sunar.',
      details: ['Konut & rezidans inşaatı', 'Dış mekân pavyonları & yapıları', 'Malzeme tedariki & küratörlüğü', 'Proje yönetimi', 'Tarihi yapı restorasyonu'],
    },
  ],
  footerDescription: '1999\'dan bu yana zamansız güzellikte mekânlar yaratan butik bir mimari, inşaat ve peyzaj tasarım stüdyosu.',
  footerAddressLine1: '14 Via della Spiga',
  footerAddressLine2: 'Milan, 20121 Italy',
  footerEmail: 'info@ozturkinsaat.com',
  footerPhone: '+90 212 555 67 89',
  footerSocialTitle: 'Bağlantı',
  footerSocialLinks: [
    { label: 'Instagram', href: '#' },
    { label: 'Pinterest', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  footerCopyright: '© {year} Öztürk İnşaat & Peyzaj. Tüm hakları saklıdır.',
  footerTagline: 'Mimari · İnşaat · Peyzaj',
  footerStudioLabel: 'Stüdyo',
};

// Inbox stays local for now (usually handled by a form-to-email service)
const INBOX_MESSAGES = [
  {
    id: 'msg1', name: 'Defne Kaya', email: 'defne.kaya@example.com',
    projectType: 'Villa Restorasyonu',
    message: 'Boğaz\'da 450 m²\'lik bir yalı restorasyonu için ön görüşme talep ediyorum. Projenin 2026 sonbaharında başlamasını planlıyoruz. Acil dönüş bekliyorum.',
    date: '2026-05-18', read: false,
  },
  {
    id: 'msg2', name: 'Koray Yılmaz', email: 'koray.yilmaz@example.com',
    projectType: 'Butik Otel',
    message: 'Yeni nesil butik otel projemiz için mimari danışmanlık ve uygulama hizmeti almak istiyoruz. 12 odalı, sürdürülebilir konseptte bir yapı düşünüyoruz.',
    date: '2026-05-17', read: false,
  },
  {
    id: 'msg3', name: 'Selma Öztürk', email: 'selma.ozturk@example.com',
    projectType: 'Peyzaj & Havuz',
    message: 'Villa projemiz için peyzaj ve havuz tasarımı konusunda fiyat teklifi rica ediyorum. Arsamız 800 m² ve deniz manzaralı. Mimari proje hazır.',
    date: '2026-05-15', read: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isSanityConfigured = () =>
  client.config().projectId && client.config().projectId !== '';

async function sanityWrite(action, body) {
  const token = sessionStorage.getItem('atelier_admin_token');
  const res = await fetch('/api/sanity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...body }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.error || `Sanity API error (${res.status})`;
    throw new Error(msg);
  }
  const data = await res.json();
  return data.result;
}

/** Normalise a raw Sanity project doc into the shape the frontend expects. */
function normaliseProject(doc) {
  const image = doc.image?.asset ? urlForImage(doc.image) : typeof doc.image === 'string' ? doc.image : urlForImage(doc.image);
  return {
    ...doc,
    id: doc._id,
    image: image || '',
    area: doc.area || '',
  };
}

/** Normalise a raw Sanity site-settings doc. */
function normaliseSettings(doc) {
  if (!doc) return DEFAULT_SITE_SETTINGS;
  const filtered = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value !== null && value !== undefined) filtered[key] = value;
  }
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...filtered,
    heroImage: doc.heroImage?.asset ? urlForImage(doc.heroImage) : doc.heroImage || DEFAULT_SITE_SETTINGS.heroImage,
    aboutImage: doc.aboutImage?.asset ? urlForImage(doc.aboutImage) : doc.aboutImage || DEFAULT_SITE_SETTINGS.aboutImage,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const DataContext = createContext(null);

const SITE_SETTINGS_ID = 'siteSettings';

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [inboxMessages, setInboxMessages] = useState(INBOX_MESSAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Initial fetch from Sanity ----
  useEffect(() => {
    if (!isSanityConfigured()) {
      // Keep hardcoded defaults – load any legacy localStorage projects
      try {
        const stored = localStorage.getItem('atelier_projects');
        if (stored) setProjects(JSON.parse(stored));
      } catch { /* ignore */ }
      try {
        const stored = localStorage.getItem('atelier_site_settings');
        if (stored) setSiteSettings(JSON.parse(stored));
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const [rawProjects, rawSettings] = await Promise.all([
          client.fetch(PROJECTS_QUERY),
          client.fetch(SITE_SETTINGS_QUERY),
        ]);
        if (cancelled) return;

        if (rawProjects && rawProjects.length > 0) {
          setProjects(rawProjects.map(normaliseProject));
        }
        if (rawSettings) {
          setSiteSettings(normaliseSettings(rawSettings));
        }
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // ---- Project CRUD ----
  const addProject = useCallback(async (project) => {
    const doc = {
      _type: 'project',
      title: project.title,
      location: project.location,
      year: project.year || new Date().getFullYear().toString(),
      category: project.category,
      area: project.area || '',
      image: project.image
        ? { _type: 'image', asset: { _type: 'reference', _ref: `image-${Date.now()}` } }
        : undefined,
    };

    if (isSanityConfigured()) {
      const created = await sanityWrite('create', { doc });
      const normalised = normaliseProject({ ...doc, _id: created._id, image: project.image });
      setProjects((prev) => [normalised, ...prev]);
    } else {
      const id = Date.now().toString(36);
      const newProject = { ...doc, id, image: project.image || '' };
      setProjects((prev) => {
        const next = [newProject, ...prev];
        localStorage.setItem('atelier_projects', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const updateProject = useCallback(async (id, data) => {
    if (isSanityConfigured()) {
      const patch = { ...data };
      delete patch.id;
      delete patch._id;
      delete patch.image;
      await sanityWrite('patch', { id, patch });
    }

    setProjects((prev) => {
      const next = prev.map((p) => {
        if ((p.id || p._id) !== id) return p;
        return { ...p, ...data, image: data.image || p.image };
      });
      if (!isSanityConfigured()) {
        localStorage.setItem('atelier_projects', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const deleteProject = useCallback(async (id) => {
    if (isSanityConfigured()) {
      await sanityWrite('delete', { id });
    }
    setProjects((prev) => {
      const next = prev.filter((p) => (p.id || p._id) !== id);
      if (!isSanityConfigured()) {
        localStorage.setItem('atelier_projects', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // ---- Inbox (local) ----
  const markMessageRead = useCallback((id) => {
    setInboxMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }, []);

  // ---- Site Settings ----
  const updateSiteSettings = useCallback(async (data) => {
    if (isSanityConfigured()) {
      try {
        const existing = await client.fetch(SITE_SETTINGS_QUERY);
        if (existing && existing._id) {
          await sanityWrite('patch', { id: existing._id, patch: data });
        } else {
          await sanityWrite('create', { doc: { _id: SITE_SETTINGS_ID, _type: 'siteSettings', ...DEFAULT_SITE_SETTINGS, ...data } });
        }
      } catch (err) {
        console.error('Failed to save site settings to Sanity:', err);
        throw err;
      }
    }

    setSiteSettings((prev) => {
      const next = { ...prev, ...data };
      if (!isSanityConfigured()) {
        localStorage.setItem('atelier_site_settings', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const resetSiteSettings = useCallback(async () => {
    if (isSanityConfigured()) {
      const existing = await client.fetch(SITE_SETTINGS_QUERY);
      if (existing && existing._id) {
        await sanityWrite('patch', { id: existing._id, patch: DEFAULT_SITE_SETTINGS });
      }
    }
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    if (!isSanityConfigured()) {
      localStorage.setItem('atelier_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        projects, addProject, updateProject, deleteProject,
        inboxMessages, markMessageRead,
        siteSettings, updateSiteSettings, resetSiteSettings,
        loading, error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
