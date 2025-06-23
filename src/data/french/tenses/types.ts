export interface VerbConjugation {
  infinitive: string;
  conjugations: {
    [tense: string]: {
      [pronoun: string]: string;
    };
  };
  tenses: string[];
}

export type Tense = 'Present' | 'Passé composé' | 'Imparfait' | 'Subjonctif' | 'Conditionnel' | 'Conditionnel passé' | 'Plus-que-parfait';
export type Pronoun = 'je' | 'tu' | 'il/elle' | 'nous' | 'vous' | 'ils/elles'; 