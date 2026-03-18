import { query } from './lib/db';
import { offers } from '../../packages/shared/src/data/offers';
import { lpConfigs } from '../../packages/shared/src/data/lp';
import { shindanConfigs } from '../../packages/shared/src/data/shindan';

async function main() {
  // Migrate offers
  for (const offer of offers) {
    await query.run(
      'INSERT OR REPLACE INTO offers (id, name, url, description) VALUES (?, ?, ?, ?)',
      [offer.id, offer.name, offer.url, offer.description || null]
    );
  }

  // Migrate LP configs
  for (const lp of lpConfigs) {
    await query.run(
      'INSERT OR REPLACE INTO lp_configs (slug, title, description, config) VALUES (?, ?, ?, ?)',
      [lp.slug, lp.title, lp.description, JSON.stringify(lp)]
    );
  }

  // Migrate Shindan configs
  for (const shindan of shindanConfigs) {
    await query.run(
      'INSERT OR REPLACE INTO shindan_configs (slug, title, description, config) VALUES (?, ?, ?, ?)',
      [shindan.slug, shindan.title, shindan.description, JSON.stringify(shindan)]
    );
  }

  console.log('Migration completed successfully!');
}

main().catch(console.error);