import { VerbConjugation } from '../types';

export const irregularPlusQueParfait: VerbConjugation[] = [
  {
    infinitive: 'être',
    conjugations: {
      'Plus-que-parfait': {
        je: 'avais été',
        tu: 'avais été',
        'il/elle': 'avait été',
        nous: 'avions été',
        vous: 'aviez été',
        'ils/elles': 'avaient été',
      }
    },
    tenses: ['Plus-que-parfait']
  },
  {
    infinitive: 'avoir',
    conjugations: {
      'Plus-que-parfait': {
        je: 'avais eu',
        tu: 'avais eu',
        'il/elle': 'avait eu',
        nous: 'avions eu',
        vous: 'aviez eu',
        'ils/elles': 'avaient eu',
      }
    },
    tenses: ['Plus-que-parfait']
  },
  {
    infinitive: 'aller',
    conjugations: {
      'Plus-que-parfait': {
        je: 'étais allé(e)',
        tu: 'étais allé(e)',
        'il/elle': 'était allé(e)',
        nous: 'étions allé(e)s',
        vous: 'étiez allé(e)(s)',
        'ils/elles': 'étaient allé(e)s',
      }
    },
    tenses: ['Plus-que-parfait']
  }
]; 