import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'zh66t9nw',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-05-19',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export function urlForImage(source) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return builder.image(source).width(1920).quality(80).url();
}

export function urlForThumb(source, width = 800) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return builder.image(source).width(width).quality(80).url();
}
