import { VerbConjugation } from '../types';

export const irregularConditionelPasse: VerbConjugation[] = [
  {
    infinitive: 'être',
    conjugations: {
      'Conditionnel passé': {
        je: 'aurais été',
        tu: 'aurais été',
        'il/elle': 'aurait été',
        nous: 'aurions été',
        vous: 'auriez été',
        'ils/elles': 'auraient été',
      }
    },
    tenses: ['Conditionnel passé']
  },
  {
    infinitive: 'avoir',
    conjugations: {
      'Conditionnel passé': {
        je: 'aurais eu',
        tu: 'aurais eu',
        'il/elle': 'aurait eu',
        nous: 'aurions eu',
        vous: 'auriez eu',
        'ils/elles': 'auraient eu',
      }
    },
    tenses: ['Conditionnel passé']
  },
  {
    infinitive: 'aller',
    conjugations: {
      'Conditionnel passé': {
        je: 'serais allé(e)',
        tu: 'serais allé(e)',
        'il/elle': 'serait allé(e)',
        nous: 'serions allé(e)s',
        vous: 'seriez allé(e)(s)',
        'ils/elles': 'seraient allé(e)s',
      }
    },
    tenses: ['Conditionnel passé']
  }
]; 