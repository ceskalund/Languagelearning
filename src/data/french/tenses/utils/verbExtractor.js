const IRREGULAR_VERBS = ['être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'savoir', 'vouloir', 'voir', 'venir'];

function extractTenseData(verb, tense) {
  if (!verb.conjugations[tense]) {
    return null;
  }

  return {
    infinitive: verb.infinitive,
    conjugations: {
      [tense]: verb.conjugations[tense]
    },
    tenses: [tense]
  };
}

export function extractRegularVerbs(verbs, tense) {
  return verbs
    .filter(verb => 
      !IRREGULAR_VERBS.includes(verb.infinitive) && 
      verb.tenses.includes(tense)
    )
    .map(verb => extractTenseData(verb, tense))
    .filter(verb => verb !== null);
}

export function extractIrregularVerbs(verbs, tense) {
  return verbs
    .filter(verb => 
      IRREGULAR_VERBS.includes(verb.infinitive) && 
      verb.tenses.includes(tense)
    )
    .map(verb => extractTenseData(verb, tense))
    .filter(verb => verb !== null);
} 