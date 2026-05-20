import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    // -- Global --
    defineField({ name: 'logoText', title: 'Logo Metni', type: 'string', initialValue: 'ÖZTÜRK İNŞAAT & PEYZAJ' }),
    defineField({
      name: 'navLinks', title: 'Navigasyon Linkleri', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'id', title: 'ID', type: 'string' }),
          defineField({ name: 'label', title: 'Etiket', type: 'string' }),
          defineField({ name: 'href', title: 'Hedef', type: 'string' }),
        ],
      }],
    }),

    // -- Hero --
    defineField({ name: 'heroTagline', title: 'Hero Tagline', type: 'string' }),
    defineField({ name: 'heroHeadingLine1', title: 'Hero Başlık (Satır 1)', type: 'string' }),
    defineField({ name: 'heroHeadingLine2', title: 'Hero Başlık (Satır 2)', type: 'string' }),
    defineField({ name: 'heroDescription', title: 'Hero Açıklama', type: 'text' }),
    defineField({ name: 'heroImage', title: 'Hero Arka Plan Görsel', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroCtaText', title: 'Hero Buton Metni', type: 'string' }),
    defineField({ name: 'heroScrollText', title: 'Scroll Göstergesi', type: 'string' }),

    // -- About --
    defineField({ name: 'aboutSubtitle', title: 'Hakkımızda Üst Başlık', type: 'string' }),
    defineField({ name: 'aboutHeadingLine1', title: 'Hakkımızda Başlık (Satır 1)', type: 'string' }),
    defineField({ name: 'aboutHeadingLine2', title: 'Hakkımızda Başlık (Satır 2)', type: 'string' }),
    defineField({ name: 'aboutDescription1', title: 'Hakkımızda Açıklama 1', type: 'text' }),
    defineField({ name: 'aboutDescription2', title: 'Hakkımızda Açıklama 2', type: 'text' }),
    defineField({ name: 'aboutImage', title: 'Hakkımızda Görsel', type: 'image', options: { hotspot: true } }),

    // -- Stats --
    defineField({
      name: 'stats', title: 'İstatistikler', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'id', title: 'ID', type: 'string' }),
          defineField({ name: 'value', title: 'Değer', type: 'string' }),
          defineField({ name: 'label', title: 'Etiket', type: 'string' }),
        ],
      }],
    }),

    // -- Services --
    defineField({ name: 'servicesSectionTitle', title: 'Hizmetler Üst Başlık', type: 'string' }),
    defineField({ name: 'servicesHeadingLine1', title: 'Hizmetler Başlık (Satır 1)', type: 'string' }),
    defineField({ name: 'servicesHeadingLine2', title: 'Hizmetler Başlık (Satır 2)', type: 'string' }),
    defineField({
      name: 'services', title: 'Hizmetler', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'number', title: 'Numara', type: 'string' }),
          defineField({ name: 'title', title: 'Başlık', type: 'string' }),
          defineField({ name: 'description', title: 'Açıklama', type: 'text' }),
          defineField({ name: 'details', title: 'Detaylar', type: 'array', of: [{ type: 'string' }] }),
        ],
      }],
    }),

    // -- Footer --
    defineField({ name: 'footerDescription', title: 'Footer Açıklama', type: 'text' }),
    defineField({ name: 'footerStudioLabel', title: 'Footer Stüdyo Etiketi', type: 'string' }),
    defineField({ name: 'footerAddressLine1', title: 'Footer Adres 1', type: 'string' }),
    defineField({ name: 'footerAddressLine2', title: 'Footer Adres 2', type: 'string' }),
    defineField({ name: 'footerEmail', title: 'Footer E-posta', type: 'string' }),
    defineField({ name: 'footerPhone', title: 'Footer Telefon', type: 'string' }),
    defineField({ name: 'footerSocialTitle', title: 'Footer Sosyal Başlık', type: 'string' }),
    defineField({
      name: 'footerSocialLinks', title: 'Footer Sosyal Linkler', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Etiket', type: 'string' }),
          defineField({ name: 'href', title: 'URL', type: 'string' }),
        ],
      }],
    }),
    defineField({ name: 'footerCopyright', title: 'Footer Copyright', type: 'string' }),
    defineField({ name: 'footerTagline', title: 'Footer Alt Tagline', type: 'string' }),
  ],
});
