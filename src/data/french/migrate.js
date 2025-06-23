import { verbs } from '../french.js';
import { migrateVerbs } from './tenses/utils/migrator.js';

// Run the migration
try {
  migrateVerbs(verbs);
  console.log('✅ Successfully migrated verb data to TypeScript modules');
} catch (error) {
  console.error('❌ Error migrating verb data:', error);
  process.exit(1);
} 