// server/seed.cjs
const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

async function createTables() {
  try {
    // 1) Extension pour UUID
    await db.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // 2) Ajout du champ tenant_id si manquant
    const alterQueries = [
      `ALTER TABLE IF EXISTS public.users            ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.hotels           ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.profiles         ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.hotel_languages  ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.support_tickets  ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.subscription_plans ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
      `ALTER TABLE IF EXISTS public.languages        ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1;`,
    ];
    for (const q of alterQueries) {
      await db.query(q);
    }

    // 3) Création des tables si elles n'existent pas
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id             UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        email          VARCHAR(255) UNIQUE NOT NULL,
        password_hash  VARCHAR(255) NOT NULL,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.hotels (
        id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        name             VARCHAR(255) NOT NULL,
        description      TEXT,
        logo_url         VARCHAR(255),
        default_lang_code VARCHAR(10) NOT NULL DEFAULT 'en',
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.profiles (
        id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        name       VARCHAR(255) NOT NULL,
        role       VARCHAR(50) NOT NULL DEFAULT 'client',
        hotel_id   UUID      REFERENCES public.hotels(id),
        user_id    UUID      UNIQUE REFERENCES public.users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.hotel_languages (
        id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        hotel_id   UUID      NOT NULL REFERENCES public.hotels(id),
        lang_code  VARCHAR(10) NOT NULL,
        is_active  BOOLEAN   NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (hotel_id, lang_code)
      );

      CREATE TABLE IF NOT EXISTS public.support_tickets (
        id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        status      VARCHAR(50) NOT NULL DEFAULT 'open',
        priority    VARCHAR(50) NOT NULL DEFAULT 'medium',
        user_id     UUID      REFERENCES public.users(id),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.subscription_plans (
        id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(255) NOT NULL,
        price       DECIMAL(10,2) NOT NULL,
        features    JSONB,
        is_active   BOOLEAN   NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(name)
      );

      CREATE TABLE IF NOT EXISTS public.languages (
        code       VARCHAR(10) PRIMARY KEY,
        name       VARCHAR(255) NOT NULL
      );
    `);

    console.log('✅ Tables créées (ou mises à jour) avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de la création des tables :', err);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    await createTables();
    console.log('🚀 Début du seed de la base…');

    // Subscription plans
    await db.query(`
      INSERT INTO public.subscription_plans (name, price, features)
      VALUES
        ('Basic', 29.99, '{"conversations":1000,"languages":5}'),
        ('Pro', 79.99, '{"conversations":5000,"languages":15}'),
        ('Enterprise', 199.99, '{"conversations":-1,"languages":-1}')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Demo hotel
    await db.query(`
      INSERT INTO public.hotels (id, name, description)
      VALUES ('550e8400-e29b-41d4-a716-446655440000','Demo Hotel','A demonstration hotel for testing')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Languages
    await db.query(`
      INSERT INTO public.languages (code, name) VALUES
        ('fr','Français'),
        ('en','English'),
        ('es','Español'),
        ('de','Deutsch')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Super Admin
    const { rows: sa } = await db.query(`SELECT id FROM public.users WHERE email='pass@passhoteltest.com'`);
    if (!sa.length) {
      const hash = await bcrypt.hash('pass', 10);
      const res = await db.query(
        `INSERT INTO public.users (email, password_hash) VALUES ('pass@passhoteltest.com',$1) RETURNING id`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (name, role, user_id) VALUES ('Super Admin','superadmin',$1)`,
        [res.rows[0].id]
      );
    }

    // Demo Hotel Admin
    const { rows: ha } = await db.query(`SELECT id FROM public.users WHERE email='admin@example.com'`);
    if (!ha.length) {
      const hash = await bcrypt.hash('password', 10);
      const res = await db.query(
        `INSERT INTO public.users (email,password_hash) VALUES ('admin@example.com',$1) RETURNING id`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (name, role, hotel_id, user_id)
         VALUES ('Admin Demo','admin','550e8400-e29b-41d4-a716-446655440000',$1)`,
        [res.rows[0].id]
      );
      await db.query(`
        INSERT INTO public.hotel_languages (hotel_id,lang_code)
        VALUES
          ('550e8400-e29b-41d4-a716-446655440000','fr'),
          ('550e8400-e29b-41d4-a716-446655440000','en')
        ON CONFLICT (hotel_id, lang_code) DO NOTHING;
      `);
    }

    console.log('✅ Seed terminé !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur de seed :', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
