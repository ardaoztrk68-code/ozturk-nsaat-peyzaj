import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas/index.js';

export default defineConfig({
  name: 'ozturk-insaat-peyzaj',
  title: 'Ozturk Insaat & Peyzaj CMS',
  projectId: 'zh66t9nw',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
