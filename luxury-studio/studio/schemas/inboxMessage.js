import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'inboxMessage',
  title: 'Gelen Mesaj',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'İsim', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'E-posta', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'projectType', title: 'Proje Türü', type: 'string' }),
    defineField({ name: 'message', title: 'Mesaj', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Tarih', type: 'date', initialValue: () => new Date().toISOString().split('T')[0] }),
    defineField({ name: 'read', title: 'Okundu', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Tarih (Yeni)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'projectType' },
  },
});
