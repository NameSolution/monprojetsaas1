const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

async function createTables() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create public schema tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(255),
        default_lang_code VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        hotel_id UUID REFERENCES hotels(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS hotel_languages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hotel_id UUID REFERENCES hotels(id),
        lang_code VARCHAR(10) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (hotel_id, lang_code)
      );

      CREATE TABLE IF NOT EXISTS support_tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'medium',
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscription_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        features JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS languages (
        code VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}


async function seedDatabase() {
  try {
    await createTables();

    console.log('Starting database seeding...');

    // Insert subscription plans
    await db.query(`
      INSERT INTO subscription_plans (name, price, features) 
      VALUES 
        ('Basic', 29.99, '{"conversations": 1000, "languages": 5}'),
        ('Pro', 79.99, '{"conversations": 5000, "languages": 15}'),
        ('Enterprise', 199.99, '{"conversations": -1, "languages": -1}')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert demo hotel
    await db.query(`
      INSERT INTO hotels (id, name, description) 
      VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Hotel', 'A demonstration hotel for testing')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert languages
    await db.query(`
      INSERT INTO languages (code, name) VALUES 
        ('fr', 'Français'),
        ('en', 'English'),
        ('es', 'Español'),
        ('de', 'Deutsch')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Create superadmin user
    const existingSuperAdmin = await db.query(`
      SELECT id FROM users WHERE email = 'pass@passhoteltest.com'
    `);

    let superAdminResult;
    if (existingSuperAdmin.rows.length === 0) {
      const hashedSuperAdminPassword = await bcrypt.hash('pass', 10);
      superAdminResult = await db.query(`
        INSERT INTO users (id, email, password_hash)
        VALUES (gen_random_uuid(), 'pass@passhoteltest.com', $1)
        RETURNING id
      `, [hashedSuperAdminPassword]);

      await db.query(`
        INSERT INTO profiles (id, name, role) 
        VALUES ($1, 'Super Admin', 'superadmin')
      `, [superAdminResult.rows[0].id]);
    }

    // Create demo hotel admin
    const existingHotelAdmin = await db.query(`
      SELECT id FROM users WHERE email = 'admin@example.com'
    `);

    let hotelAdminResult;
    if (existingHotelAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      hotelAdminResult = await db.query(`
        INSERT INTO users (id, email, password_hash)
        VALUES (gen_random_uuid(), 'admin@example.com', $1)
        RETURNING id
      `, [hashedPassword]);

      await db.query(`
        INSERT INTO profiles (id, name, role, hotel_id) 
        VALUES ($1, 'Admin Demo', 'admin', '550e8400-e29b-41d4-a716-446655440000')
      `, [hotelAdminResult.rows[0].id]);

      // Add hotel languages
      await db.query(`
        INSERT INTO hotel_languages (hotel_id, lang_code) VALUES 
          ('550e8400-e29b-41d4-a716-446655440000', 'fr'),
          ('550e8400-e29b-41d4-a716-446655440000', 'en')
        ON CONFLICT (hotel_id, lang_code) DO NOTHING;
      `);
    }

    console.log('Database seeding completed successfully!');
    console.log('Default users created:');
    console.log('- pass@passhoteltest.com / pass (Super Admin)');
    console.log('- admin@example.com / password (Hotel Admin)');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
