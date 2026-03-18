import db from '../packages/shared/src/db';
import { offers } from '../packages/shared/src/data/offers';
import { lpConfigs } from '../packages/shared/src/data/lp';
import { shindanConfigs } from '../packages/shared/src/data/shindan';

// Migrate offers
const insertOffer = db.prepare(`
  INSERT OR REPLACE INTO offers (id, name, url, description)
  VALUES (?, ?, ?, ?)
`);

for (const offer of offers) {
  insertOffer.run(offer.id, offer.name, offer.url, offer.description || null);
}

// Migrate LP configs
const insertLP = db.prepare(`
  INSERT OR REPLACE INTO lp_configs (slug, title, description, config)
  VALUES (?, ?, ?, ?)
`);

for (const lp of lpConfigs) {
  insertLP.run(lp.slug, lp.title, lp.description, JSON.stringify(lp));
}

// Migrate Shindan configs
const insertShindan = db.prepare(`
  INSERT OR REPLACE INTO shindan_configs (slug, title, description, config)
  VALUES (?, ?, ?, ?)
`);

for (const shindan of shindanConfigs) {
  insertShindan.run(shindan.slug, shindan.title, shindan.description, JSON.stringify(shindan));
}

console.log('Migration completed successfully!');