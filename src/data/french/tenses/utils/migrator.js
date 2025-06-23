import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { extractRegularVerbs, extractIrregularVerbs } from './verbExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TENSE_FOLDERS = [
  'present',
  'passe-compose',
  'imparfait',
  'subjonctif',
  'conditionnel',
  'conditionnel-passe',
  'plus-que-parfait'
];

export function generateTenseFiles(tense, verbs) {
  const tenseFolder = path.join(__dirname, '..', tense.toLowerCase());
  
  // Create tense folder if it doesn't exist
  if (!fs.existsSync(tenseFolder)) {
    fs.mkdirSync(tenseFolder, { recursive: true });
  }

  // Extract regular and irregular verbs
  const regularVerbs = extractRegularVerbs(verbs, tense);
  const irregularVerbs = extractIrregularVerbs(verbs, tense);

  // Generate regular.ts
  const regularContent = `import { VerbConjugation } from '../types';

export const regular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)} = ${JSON.stringify(regularVerbs, null, 2)};`;

  fs.writeFileSync(
    path.join(tenseFolder, 'regular.ts'),
    regularContent
  );

  // Generate irregular.ts
  const irregularContent = `import { VerbConjugation } from '../types';

export const irregular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)} = ${JSON.stringify(irregularVerbs, null, 2)};`;

  fs.writeFileSync(
    path.join(tenseFolder, 'irregular.ts'),
    irregularContent
  );

  // Generate index.ts
  const indexContent = `export { irregular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)} } from './irregular';
export { regular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)} } from './regular';
export const all${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)} = [...irregular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)}, ...regular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)}];`;

  fs.writeFileSync(
    path.join(tenseFolder, 'index.ts'),
    indexContent
  );
}

export function migrateVerbs(verbs) {
  // Create each tense folder and its files
  TENSE_FOLDERS.forEach(tense => {
    const formattedTense = tense
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    generateTenseFiles(formattedTense, verbs);
  });

  console.log('✅ Generated all tense files successfully');
} 