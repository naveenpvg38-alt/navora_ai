const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'navora.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for reliability and performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize database schema strictly conforming to Section 17
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS preferences (
      preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mood TEXT,
      interests TEXT,
      budget TEXT,
      duration TEXT,
      start_time TEXT,
      trip_type TEXT,
      people_count INTEGER DEFAULT 1,
      transport TEXT,
      location TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS plans (
      plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      estimated_cost TEXT,
      duration TEXT,
      match_score INTEGER,
      route_info TEXT,
      why_matched TEXT,
      mood TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS plan_items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      place_name TEXT NOT NULL,
      activity TEXT,
      start_time TEXT,
      end_time TEXT,
      travel_time TEXT,
      estimated_cost TEXT,
      latitude REAL,
      longitude REAL,
      category TEXT,
      insider_tip TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favourites (
      favourite_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, plan_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS completed_plans (
      completed_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, plan_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      attempts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
  `);

  // Seed default demo user for instant evaluation
  const demoEmail = 'demo@navora.ai';
  const existingUser = db.prepare('SELECT user_id FROM users WHERE email = ?').get(demoEmail);

  if (!existingUser) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `).run('Alex Rivera', demoEmail, passwordHash);

    const demoUserId = result.lastInsertRowid;

    // Default user preference for Tumkur District
    db.prepare(`
      INSERT INTO preferences (user_id, mood, interests, budget, duration, start_time, trip_type, people_count, transport, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      demoUserId,
      'Foodie',
      'Cafes & Dining, Scenic Outdoors, Art & Culture',
      'Budget ($)',
      'Half Day (4-5h)',
      '08:30 AM',
      'Friends',
      3,
      'Bike / Two-Wheeler',
      'Tumkur, Karnataka'
    );

    // Seed an initial sample outing plan for Tumkur
    const samplePlan = db.prepare(`
      INSERT INTO plans (user_id, title, description, estimated_cost, duration, match_score, route_info, why_matched, mood, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      demoUserId,
      'Devarayanadurga Hill Canopy & Kyathsandra Thatte Idli Trail',
      'An authentic Tumkur day trail combining world-famous Kyathsandra butter Thatte Idli, sacred deer park spring at Namada Chilume, and the panoramic mist of DD Hills.',
      '₹140 / person (~₹420 total for 3 people)',
      '4.5 Hours',
      99,
      '3 curated spots across Tumkur & DD Hills connected via Two-Wheeler / Car',
      'Engineered specifically for Tumkur District, pairing iconic local gastronomy with scenic hill shrines and serene forest reserves.',
      'Foodie',
      'Tumkur, Karnataka'
    );

    const samplePlanId = samplePlan.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO plan_items (plan_id, place_name, activity, start_time, end_time, travel_time, estimated_cost, latitude, longitude, category, insider_tip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertItem.run(
      samplePlanId,
      'Kyathsandra Iconic Thatte Idli Square',
      'Savor warm, fluffy Thatte Idlis bathed in homemade butter (benne), fiery red chutney, and freshly brewed South Indian filter kaapi.',
      '08:30 AM',
      '09:30 AM',
      'Starting Point',
      '₹60 / person',
      13.3106,
      77.1472,
      'Cafes & Dining',
      'Order at Sri Krishna or Venkateshwara Thatte Idli; try the crispy uddina vade alongside.'
    );

    insertItem.run(
      samplePlanId,
      'Namada Chilume Natural Spring & Deer Sanctuary',
      'Explore the perennial sacred spring emerging from rock crevices, walk the quiet deer trail, and discover medicinal herbs.',
      '10:00 AM',
      '11:15 AM',
      '20 mins via DD Hills Road (9.5 km)',
      '₹20 / person',
      13.3444,
      77.1989,
      'Scenic Outdoors',
      'Tender coconut stalls right outside the gate offer refreshing coconut water after the stroll.'
    );

    insertItem.run(
      samplePlanId,
      'Devarayanadurga (DD Hills) Yoga Narasimha Peak',
      'Ascend the winding hill steps to the 3,940-foot sacred cliff top with panoramic vistas over Tumkur district’s rocky valleys.',
      '11:35 AM',
      '01:00 PM',
      '15 mins hill climb drive (5.2 km)',
      'Free (₹0)',
      13.3736,
      77.2114,
      'Scenic Outdoors',
      'Visit the ancient Kalyani (temple pond) nestled in the boulders on your way down.'
    );

    // Seed favourite
    db.prepare(`
      INSERT INTO favourites (user_id, plan_id)
      VALUES (?, ?)
    `).run(demoUserId, samplePlanId);
  }
}

initializeDatabase();

module.exports = db;
