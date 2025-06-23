import { presentIrregularVerbs } from './tenses/present/irregular';
import { presentRegularVerbs } from './tenses/present/regular';
import { presensPerfektumIrregularVerbs } from './tenses/presens-perfektum/irregular';
import { presensPerfektumRegularVerbs } from './tenses/presens-perfektum/regular';
import { preteritumIrregularVerbs } from './tenses/preteritum/irregular';
import { preteritumRegularVerbs } from './tenses/preteritum/regular';
import { preteritumPerfektumIrregularVerbs } from './tenses/preteritum-perfektum/irregular';
import { preteritumPerfektumRegularVerbs } from './tenses/preteritum-perfektum/regular';
import { konjunktivIrregularVerbs } from './tenses/konjunktiv/irregular';
import { konjunktivRegularVerbs } from './tenses/konjunktiv/regular';
import { futurumIrregularVerbs } from './tenses/futurum/irregular';
import { futurumRegularVerbs } from './tenses/futurum/regular';
import { fortidsKondisjonalisIrregularVerbs } from './tenses/fortids-kondisjonalis/irregular';
import { fortidsKondisjonalisRegularVerbs } from './tenses/fortids-kondisjonalis/regular';

export const verbs = [
  ...presentIrregularVerbs,
  ...presentRegularVerbs,
  ...presensPerfektumIrregularVerbs,
  ...presensPerfektumRegularVerbs,
  ...preteritumIrregularVerbs,
  ...preteritumRegularVerbs,
  ...preteritumPerfektumIrregularVerbs,
  ...preteritumPerfektumRegularVerbs,
  ...konjunktivIrregularVerbs,
  ...konjunktivRegularVerbs,
  ...futurumIrregularVerbs,
  ...futurumRegularVerbs,
  ...fortidsKondisjonalisIrregularVerbs,
  ...fortidsKondisjonalisRegularVerbs,
]; 