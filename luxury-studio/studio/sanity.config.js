import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'ozturk-insaat-peyzaj',
  title: 'Ozturk Insaat & Peyzaj CMS',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
