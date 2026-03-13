export type {
  Offer,
  ClickLog,
  DiagnosticOption,
  DiagnosticQuestion,
  DiagnosticResult,
  DiagnosticConfig,
  LPFeature,
  LPFaq,
  LPConfig,
} from './types';

export { extractUTMParams, buildUrlWithUTM } from './utils';
export type { UTMParams } from './utils';

export { offers } from './data/offers';
export { lpConfigs } from './data/lp';
export { shindanConfigs } from './data/shindan';
