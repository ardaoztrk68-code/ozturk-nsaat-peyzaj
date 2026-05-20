import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Proje',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', title: 'Konum', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Yıl', type: 'string' }),
    defineField({ name: 'category', title: 'Kategori', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'images',
      title: 'Görseller (Sanity Upload)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'imageUrls',
      title: 'Görsel URL\'leri (Harici)',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Admin panelden eklenen projeler için harici URL\'ler.',
    }),
    defineField({ name: 'area', title: 'Alan', type: 'string' }),
    defineField({ name: 'materials', title: 'Malzemeler', type: 'string' }),
    defineField({ name: 'completionYear', title: 'Tamamlanma Yılı', type: 'string' }),
    defineField({ name: 'description', title: 'Açıklama', type: 'text' }),
    defineField({ name: 'span', title: 'Grid Span', type: 'string', initialValue: 'lg:col-span-1 lg:row-span-1' }),
    defineField({ name: 'aspect', title: 'Aspect Ratio', type: 'string', initialValue: 'aspect-[4/5]' }),
  ],
  orderings: [{ title: 'Yıl (Yeni)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'images.0' },
  },
});
