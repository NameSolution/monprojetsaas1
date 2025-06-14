#!/usr/bin/env node
const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

async function createTables() {
  try {
    // pgcrypto pour gen_random_uuid()
    await db.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    // Si les tables existent déjà, on ajoute la colonne tenant_id si nécessaire
    await db.query(`
      ALTER TABLE public.users              ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.hotels             ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.profiles           ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.hotel_languages    ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.support_tickets    ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.subscription_plans ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
      ALTER TABLE public.languages          ADD COLUMN IF NOT EXISTS tenant_id   INT NOT NULL DEFAULT 1;
    `);

    // Création (si non existantes) de toutes les tables dans public
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id      INT         NOT NULL DEFAULT 1,
        email          VARCHAR(255) UNIQUE NOT NULL,
        password_hash  VARCHAR(255) NOT NULL,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.hotels (
        id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id        INT         NOT NULL DEFAULT 1,
        name             VARCHAR(255) NOT NULL,
        description      TEXT,
        logo_url         VARCHAR(255),
        default_lang_code VARCHAR(10) NOT NULL DEFAULT 'en',
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.profiles (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id  INT         NOT NULL DEFAULT 1,
        name       VARCHAR(255) NOT NULL,
        role       VARCHAR(50)  NOT NULL DEFAULT 'client',
        hotel_id   UUID        REFERENCES public.hotels(id),
        user_id    UUID        UNIQUE REFERENCES public.users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.hotel_languages (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id  INT         NOT NULL DEFAULT 1,
        hotel_id   UUID        NOT NULL REFERENCES public.hotels(id),
        lang_code  VARCHAR(10)  NOT NULL,
        is_active  BOOLEAN     NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (hotel_id, lang_code)
      );

      CREATE TABLE IF NOT EXISTS public.support_tickets (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id   INT         NOT NULL DEFAULT 1,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        status      VARCHAR(50)  NOT NULL DEFAULT 'open',
        priority    VARCHAR(50)  NOT NULL DEFAULT 'medium',
        user_id     UUID        REFERENCES public.users(id),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.subscription_plans (
        id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id   INT         NOT NULL DEFAULT 1,
        name        VARCHAR(255) NOT NULL,
        price       DECIMAL(10,2) NOT NULL,
        features    JSONB,
        is_active   BOOLEAN     NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.languages (
        code       VARCHAR(10)  PRIMARY KEY,
        tenant_id  INT         NOT NULL DEFAULT 1,
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

    // Plans d'abonnement
    await db.query(`
      INSERT INTO public.subscription_plans (tenant_id, name, price, features) 
      VALUES 
        (1, 'Basic', 29.99, '{"conversations":1000,"languages":5}'),
        (1, 'Pro', 79.99, '{"conversations":5000,"languages":15}'),
        (1, 'Enterprise', 199.99, '{"conversations":-1,"languages":-1}')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Démo hôtel
    await db.query(`
      INSERT INTO public.hotels (id, tenant_id, name, description)
      VALUES ('550e8400-e29b-41d4-a716-446655440000', 1, 'Demo Hotel', 'A demonstration hotel for testing')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Langues
    await db.query(`
      INSERT INTO public.languages (code, tenant_id, name) VALUES
        ('fr', 1, 'Français'),
        ('en', 1, 'English'),
        ('es', 1, 'Español'),
        ('de', 1, 'Deutsch')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Superadmin
    const { rows: sa } = await db.query(
      `SELECT id FROM public.users WHERE email = 'pass@passhoteltest.com'`
    );
    if (!sa.length) {
      const hash = await bcrypt.hash('pass', 10);
      const res = await db.query(
        `INSERT INTO public.users (tenant_id, email, password_hash) VALUES (1, 'pass@passhoteltest.com', $1) RETURNING id`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (tenant_id, name, role, user_id) VALUES (1, 'Super Admin', 'superadmin', $1)`,
        [res.rows[0].id]
      );
    }

    // Admin démo hôtel
    const { rows: ha } = await db.query(
      `SELECT id FROM public.users WHERE email = 'admin@example.com'`
    );
    if (!ha.length) {
      const hash = await bcrypt.hash('password', 10);
      const res = await db.query(
        `INSERT INTO public.users (tenant_id, email, password_hash) VALUES (1, 'admin@example.com', $1) RETURNING id`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (tenant_id, name, role, hotel_id, user_id)
         VALUES (1, 'Admin Demo', 'admin', '550e8400-e29b-41d4-a716-446655440000', $1)`,
        [res.rows[0].id]
      );
      await db.query(`
        INSERT INTO public.hotel_languages (tenant_id, hotel_id, lang_code) VALUES
          (1, '550e8400-e29b-41d4-a716-446655440000', 'fr'),
          (1, '550e8400-e29b-41d4-a716-446655440000', 'en')
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
