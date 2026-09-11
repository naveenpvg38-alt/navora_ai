const db = require('../database.js');

console.log('Clearing all stored login and user data...');

db.pragma('foreign_keys = OFF');

const tables = [
  'favourites',
  'completed_plans',
  'plan_items',
  'plans',
  'preferences',
  'email_verifications',
  'users'
];

for (const table of tables) {
  const info = db.prepare(`DELETE FROM ${table}`).run();
  console.log(`Cleared ${table}: ${info.changes} rows deleted.`);
}

try {
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('favourites', 'completed_plans', 'plan_items', 'plans', 'preferences', 'email_verifications', 'users')").run();
  console.log('Reset sqlite_sequence auto-increment counters.');
} catch (e) {
  console.log('sqlite_sequence note:', e.message);
}

db.pragma('foreign_keys = ON');

console.log('\n--- Database Verification ---');
for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get();
  console.log(`${table}: ${count.c} rows`);
}
console.log('\nAll stored login data has been completely cleared.');
