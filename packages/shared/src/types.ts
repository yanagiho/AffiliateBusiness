export interface Offer {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export interface ClickLog {
  id: number;
  offer_id: string;
  clicked_at: string;
  ip?: string | null;
  user_agent?: string | null;
  referer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

export interface DiagnosticOption {
  label: string;
  value: string;
  /** 次の質問ID または "result:{key}" */
  next: string;
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  options: DiagnosticOption[];
}

export interface DiagnosticResult {
  title: string;
  description: string;
  offer_id: string;
  cta: string;
}

export interface DiagnosticConfig {
  slug: string;
  title: string;
  description: string;
  startQuestion: string;
  questions: DiagnosticQuestion[];
  results: Record<string, DiagnosticResult>;
}

export interface LPFeature {
  icon: string;
  title: string;
  body: string;
}

export interface LPFaq {
  question: string;
  answer: string;
}

export interface SNSAccount {
  id: number;
  platform: string;
  account_name: string;
  theme: string;
  character_name: string;
  character_role: string;
  character_bio: string;
  character_tone: string;
  post_format: string;
  cta_style: string;
  forbidden_expressions: string;
  visual_direction: string;
  api_key?: string;
  api_secret?: string;
  access_token?: string;
  access_secret?: string;
  is_active: boolean | number;
  created_at?: string;
}

export interface LPConfig {
  slug: string;
  title: string;
  description: string;
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    offer_id: string;
  };
  features?: LPFeature[];
  faq?: LPFaq[];
  content?: any; // Claude generated content
}
