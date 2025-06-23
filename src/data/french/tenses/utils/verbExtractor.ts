import { VerbConjugation, Tense } from '../types';

const irregularVerbsList = [
  'être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'vouloir', 'devoir', 
  'prendre', 'venir', 'savoir', 'voir', 'mettre', 'tenir', 'suivre', 'connaître', 
  'croire', 'entendre', 'attendre', 'boire', 'conduire', 'courir', 'cueillir', 
  'découvrir', 'écrire', 'sentir', 'servir', 'couvrir', 'craindre', 'croître', 
  'cuire', 'concevoir', 'conclure', 'conquérir', 'construire', 'contenir', 
  'contredire', 'convaincre', 'convenir', 'coudre', 'falloir'
];

export const isIrregularVerb = (infinitive: string): boolean => {
  return irregularVerbsList.includes(infinitive);
};

export const extractVerbsByTense = (
  verbs: VerbConjugation[],
  tense: Tense
): { regular: VerbConjugation[], irregular: VerbConjugation[] } => {
  const filtered = verbs.map(verb => ({
    infinitive: verb.infinitive,
    conjugations: {
      [tense]: verb.conjugations[tense]
    },
    tenses: [tense]
  }));

  return {
    regular: filtered.filter(verb => !isIrregularVerb(verb.infinitive)),
    irregular: filtered.filter(verb => isIrregularVerb(verb.infinitive))
  };
};

export const validateVerb = (verb: VerbConjugation): boolean => {
  if (!verb.infinitive || !verb.conjugations || !verb.tenses) {
    return false;
  }

  for (const tense of verb.tenses) {
    if (!verb.conjugations[tense]) {
      return false;
    }
  }

  return true;
}; 