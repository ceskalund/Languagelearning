import { VerbConjugation } from '../types';

export const irregularPasseCompose: VerbConjugation[] = [
  {
    infinitive: 'être',
    conjugations: {
      'Passé composé': {
        je: 'ai été',
        tu: 'as été',
        'il/elle': 'a été',
        nous: 'avons été',
        vous: 'avez été',
        'ils/elles': 'ont été',
      }
    },
    tenses: ['Passé composé']
  },
  {
    infinitive: 'avoir',
    conjugations: {
      'Passé composé': {
        je: 'ai eu',
        tu: 'as eu',
        'il/elle': 'a eu',
        nous: 'avons eu',
        vous: 'avez eu',
        'ils/elles': 'ont eu',
      }
    },
    tenses: ['Passé composé']
  },
  {
    infinitive: 'aller',
    conjugations: {
      'Passé composé': {
        je: 'suis allé(e)',
        tu: 'es allé(e)',
        'il/elle': 'est allé(e)',
        nous: 'sommes allé(e)s',
        vous: 'êtes allé(e)(s)',
        'ils/elles': 'sont allé(e)s',
      }
    },
    tenses: ['Passé composé']
  }
]; 