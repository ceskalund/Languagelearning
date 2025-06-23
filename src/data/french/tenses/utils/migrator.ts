import { VerbConjugation, Tense } from '../types';
import { extractVerbsByTense, validateVerb } from './verbExtractor';
import * as fs from 'fs';
import * as path from 'path';

const tenses: Tense[] = [
  'Present',
  'Passé composé',
  'Imparfait',
  'Subjonctif',
  'Conditionnel',
  'Conditionnel passé',
  'Plus-que-parfait'
];

const createTenseFolder = (tense: string) => {
  const folderName = tense.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const folderPath = path.join(__dirname, '..', folderName);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  return folderPath;
};

const writeVerbsToFile = (
  verbs: VerbConjugation[],
  filePath: string,
  exportName: string
) => {
  const content = `import { VerbConjugation } from '../types';

export const ${exportName}: VerbConjugation[] = ${JSON.stringify(verbs, null, 2)};`;

  fs.writeFileSync(filePath, content);
};

export const migrateVerbs = (originalVerbs: VerbConjugation[]) => {
  // Validate all verbs first
  const invalidVerbs = originalVerbs.filter(verb => !validateVerb(verb));
  if (invalidVerbs.length > 0) {
    console.error('Invalid verbs found:', invalidVerbs.map(v => v.infinitive));
    throw new Error('Invalid verbs found in data');
  }

  // Process each tense
  tenses.forEach(tense => {
    const folderPath = createTenseFolder(tense);
    const { regular, irregular } = extractVerbsByTense(originalVerbs, tense);

    // Write irregular verbs
    writeVerbsToFile(
      irregular,
      path.join(folderPath, 'irregular.ts'),
      `irregular${tense.replace(/[\s-]/g, '')}`
    );

    // Write regular verbs
    writeVerbsToFile(
      regular,
      path.join(folderPath, 'regular.ts'),
      `regular${tense.replace(/[\s-]/g, '')}`
    );

    // Create index.ts
    const indexContent = `export { irregular${tense.replace(/[\s-]/g, '')} } from './irregular';
export { regular${tense.replace(/[\s-]/g, '')} } from './regular';
export const all${tense.replace(/[\s-]/g, '')} = [...irregular${tense.replace(/[\s-]/g, '')}, ...regular${tense.replace(/[\s-]/g, '')}];`;

    fs.writeFileSync(path.join(folderPath, 'index.ts'), indexContent);
  });
};

const TENSE_FOLDERS = [
  'present',
  'passe-compose',
  'imparfait',
  'subjonctif',
  'conditionnel',
  'conditionnel-passe',
  'plus-que-parfait'
];

export function generateTenseFiles(tense: string, verbs: VerbConjugation[]): void {
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

export const regular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)}: VerbConjugation[] = ${JSON.stringify(regularVerbs, null, 2)};`;

  fs.writeFileSync(
    path.join(tenseFolder, 'regular.ts'),
    regularContent
  );

  // Generate irregular.ts
  const irregularContent = `import { VerbConjugation } from '../types';

export const irregular${tense.replace(/-/g, '')}${tense === 'Present' ? '' : tense.charAt(0).toUpperCase() + tense.slice(1)}: VerbConjugation[] = ${JSON.stringify(irregularVerbs, null, 2)};`;

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

export function migrateVerbs(verbs: VerbConjugation[]): void {
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