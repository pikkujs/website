/* ─────────────────────────────────────────────────────────────
   FeaturePage — data types
   ───────────────────────────────────────────────────────────── */

/** Supports _italic_ syntax → orange <em> in renderer */
export type TextContent = string;

export type CardItem = {
  icon?: string;        // lucide icon name, e.g. 'bar-chart-3'
  title: string;
  body: string;
  accentColor?: string; // border-top hex
  mono?: boolean;       // monospace title font
};

export type StepItem = {
  title: string;
  desc: string;
  command?: string;
};

export type CodeSpec = {
  filename: string;
  badge?: string;
  icon?: string;        // lucide or wire icon name
  code: string;
  language?: string;
};

export type ColContent =
  | { type: 'cards';      cards: CardItem[];  columns?: number }
  | { type: 'code';       code: CodeSpec }
  | { type: 'codes';      codes: CodeSpec[] }
  | { type: 'check-list'; items: Array<{ title: string; body: string }> }
  | { type: 'note';       icon?: string; title?: string; body: string };

/* ── Section schemas ─────────────────────────────────────── */

export type HeroSection = {
  component: 'hero';
  badge?: string;
  h1: TextContent;
  lead: string;
  cta: Array<{ label: string; to: string; primary?: boolean }>;
  right?:
    | { type: 'code'; code: string; language?: string }
    | { type: 'wire-icon'; name: string };
};

export type TwoColSection = {
  component: 'two-col';
  eyebrow?: string;
  h2?: TextContent;
  lead?: string;
  variant?: 'default' | 'alt' | 'dark';
  id?: string;
  columns?: string; // CSS grid-template-columns, default '1fr 1fr'
  left: ColContent;
  right: ColContent;
  below?: ColContent;
};

export type FeatureGridSection = {
  component: 'feature-grid';
  eyebrow?: string;
  h2?: TextContent;
  lead?: string;
  variant?: 'default' | 'alt' | 'dark';
  id?: string;
  columns?: number;
  cards: CardItem[];
  below?: ColContent;
};

export type WideCodeSection = {
  component: 'wide-code';
  eyebrow?: string;
  h2?: TextContent;
  lead?: string;
  variant?: 'default' | 'alt' | 'dark';
  id?: string;
  code: CodeSpec;
  below?: ColContent;
};

export type StepCardsSection = {
  component: 'step-cards';
  eyebrow?: string;
  h2?: TextContent;
  lead?: string;
  variant?: 'default' | 'alt' | 'dark';
  id?: string;
  steps: StepItem[];
  columns?: number;
  below?: ColContent;
};

export type CtaSection = {
  component: 'cta';
  h2: TextContent;
  lead?: string;
  cmd?: string;
  buttons: Array<{ label: string; to: string; primary?: boolean }>;
  footnote?: string;
};

export type Section =
  | HeroSection
  | TwoColSection
  | FeatureGridSection
  | WideCodeSection
  | StepCardsSection
  | CtaSection;

export type PageData = {
  meta: { title: string; description: string };
  sections: Section[];
};
