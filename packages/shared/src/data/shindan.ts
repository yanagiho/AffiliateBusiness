import type { DiagnosticConfig } from '../types';
import { query } from '../db';

// Function to get all shindan configs
export async function getShindanConfigs(): Promise<DiagnosticConfig[]> {
  const rows = await query.all('SELECT slug, title, description, config FROM shindan_configs');
  return rows.map((row: any) => JSON.parse(row.config)) as DiagnosticConfig[];
}

// Function to get diagnostic config by slug
export async function getShindanConfigBySlug(slug: string): Promise<DiagnosticConfig | null> {
  const row = await query.get('SELECT config FROM shindan_configs WHERE slug = ?', [slug]) as { config: string } | null;
  return row ? JSON.parse(row.config) : null;
}

// For backward compatibility, keep the old array but load from DB
// Note: This will be empty in production until we call getShindanConfigs()
export const shindanConfigs: DiagnosticConfig[] = [];
