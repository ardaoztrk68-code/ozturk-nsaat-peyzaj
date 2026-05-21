import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Proje',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', title: 'Konum', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Kategori', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'area', title: 'Alan', type: 'string' }),
    defineField({ name: 'year', title: 'Yıl', type: 'string' }),
    defineField({ name: 'image', title: 'Görsel', type: 'image', options: { hotspot: true } }),
  ],
  orderings: [{ title: 'Yıl (Yeni)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'image' },
  },
});
