// server/seed.mjs
import db from './db.cjs';
import bcrypt from 'bcryptjs';

async function ensureColumn(table, column, definition) {
  const res = await db.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
    [table, column]
  );
  if (!res.rows.length) {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`Added missing column ${table}.${column}`);
  }
}

async function ensureSetting(key, value) {
  const { rows } = await db.query('SELECT 1 FROM settings WHERE key = $1', [key]);
  if (!rows.length) {
    await db.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2)',
      [key, value]
    );
    console.log(`Inserted default setting ${key}`);
  }
}

async function createTables() {
  try {
    await db.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.subscription_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        features JSONB,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(name)
      );

      CREATE TABLE IF NOT EXISTS public.hotels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(255),
        default_lang_code VARCHAR(10) NOT NULL DEFAULT 'en',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        plan_id UUID,
        user_id UUID,
        theme_color TEXT,
        welcome_message TEXT,
        contact_name TEXT,
        contact_email TEXT,
        slug TEXT UNIQUE,
        status TEXT,
        booking_link TEXT,
        address TEXT,
        phone TEXT,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        hotel_id UUID REFERENCES public.hotels(id),
        user_id UUID UNIQUE REFERENCES public.users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.languages (
        code VARCHAR(10) PRIMARY KEY,
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.hotel_languages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID NOT NULL REFERENCES public.hotels(id),
        lang_code VARCHAR(10) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (hotel_id, lang_code)
      );

      CREATE TABLE IF NOT EXISTS public.hotel_customizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID UNIQUE REFERENCES public.hotels(id),
        name TEXT,
        welcome_message TEXT,
        theme_color TEXT,
        logo_url TEXT,
        default_language TEXT,
        menu_items JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.support_tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        user_id UUID REFERENCES public.users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.interactions (
        id SERIAL PRIMARY KEY,
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID REFERENCES public.hotels(id),
        session_id UUID,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        lang_code VARCHAR(10),
        user_input TEXT,
        bot_response TEXT,
        intent_detected TEXT,
        confidence_score DOUBLE PRECISION,
        feedback SMALLINT
      );

      CREATE TABLE IF NOT EXISTS public.knowledge_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID REFERENCES public.hotels(id),
        info TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    await ensureColumn('interactions', 'timestamp', 'TIMESTAMPTZ DEFAULT NOW()');
    await ensureColumn('interactions', 'session_id', 'UUID');
    await ensureColumn('interactions', 'keywords', 'TEXT');

    const hotelCols = [
      ['plan_id', 'UUID'],
      ['user_id', 'UUID'],
      ['theme_color', 'TEXT'],
      ['welcome_message', 'TEXT'],
      ['contact_name', 'TEXT'],
      ['contact_email', 'TEXT'],
      ['slug', 'TEXT UNIQUE'],
      ['status', 'TEXT'],
      ['booking_link', 'TEXT'],
      ['address', 'TEXT'],
      ['phone', 'TEXT'],
      ['email', 'TEXT']
    ];
    for (const [c, d] of hotelCols) {
      await ensureColumn('hotels', c, d);
    }

    const ticketCols = [
      ['hotel_id', 'UUID'],
      ['submitter_name', 'TEXT'],
      ['submitter_email', 'TEXT'],
      ['assigned_to_user_id', 'UUID'],
      ['internal_notes', 'TEXT'],
      ['admin_response', 'TEXT']
    ];
    for (const [c, d] of ticketCols) {
      await ensureColumn('support_tickets', c, d);
    }

    await ensureSetting(
      'ai_api_url',
      process.env.AI_API_URL || 'http://localhost:11434/v1'
    );
    await ensureSetting('ai_api_key', process.env.AI_API_KEY || '');

    console.log('🚀 Début du seed de la base…');

    await db.query(`
      INSERT INTO public.subscription_plans (tenant_id, name, price, features)
      SELECT v.tenant_id, v.name, v.price, v.features::jsonb
      FROM (VALUES
        (1, 'Basic', 29.99, '{"conversations":1000,"languages":5}'),
        (1, 'Pro', 79.99, '{"conversations":5000,"languages":15}'),
        (1, 'Enterprise', 199.99, '{"conversations":-1,"languages":-1}')
      ) AS v(tenant_id,name,price,features)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.subscription_plans p WHERE p.name = v.name
      );
    `);

    await db.query(`
      INSERT INTO public.languages (code, tenant_id, name)
      SELECT v.code, v.tenant_id, v.name
      FROM (VALUES
        ('fr', 1, 'Français'),
        ('en', 1, 'English'),
        ('es', 1, 'Español'),
        ('de', 1, 'Deutsch')
      ) AS v(code,tenant_id,name)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.languages l WHERE l.code = v.code
      );
    `);

    await db.query(`
      INSERT INTO public.hotels (id, tenant_id, name, description, slug, contact_name, contact_email, theme_color, welcome_message, status)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        1,
        'Demo Hotel',
        'A demonstration hotel for testing',
        'demo-hotel',
        'Demo Admin',
        'demo@example.com',
        '#2563EB',
        'Bienvenue au Demo Hotel',
        'active'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    await db.query(`
      INSERT INTO public.hotel_customizations (hotel_id, name, welcome_message, theme_color, logo_url, default_language, menu_items)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'Assistant Virtuel',
        'Bienvenue au Demo Hotel',
        '#2563EB',
        NULL,
        'fr',
        '[{"label":"Accueil","url":"/"},{"label":"Réservation","url":"/booking"}]'::jsonb
      )
      ON CONFLICT (hotel_id) DO NOTHING;
    `);

    await db.query(`
      UPDATE public.hotels
         SET slug = 'demo-hotel',
             contact_name = 'Demo Admin',
             contact_email = 'demo@example.com',
             theme_color = COALESCE(theme_color, '#2563EB'),
             welcome_message = COALESCE(welcome_message, 'Bienvenue au Demo Hotel'),
             status = COALESCE(status, 'active')
       WHERE id = '550e8400-e29b-41d4-a716-446655440000';
    `);

    const { rows: sa } = await db.query(
      `SELECT id FROM public.users WHERE email = 'pass@passhoteltest.com'`
    );
    if (!sa.length) {
      const hash = await bcrypt.hash('pass', 10);
      const { rows } = await db.query(
        `INSERT INTO public.users (tenant_id, email, password_hash)
         VALUES (1, 'pass@passhoteltest.com', $1)
         RETURNING id;`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (tenant_id, name, role, hotel_id, user_id)
         VALUES (
           1,
           'Super Admin',
           'superadmin',
           '550e8400-e29b-41d4-a716-446655440000',
           $1
         );`,
        [rows[0].id]
      );
      await db.query(
        `UPDATE public.hotels SET user_id = $1 WHERE id = '550e8400-e29b-41d4-a716-446655440000'`,
        [rows[0].id]
      );
    } else {
      // ensure profile has hotel_id linked
      await db.query(
        `UPDATE public.profiles SET hotel_id = '550e8400-e29b-41d4-a716-446655440000' WHERE user_id = $1`,
        [sa[0].id]
      );
    }

    const { rows: ha } = await db.query(
      `SELECT id FROM public.users WHERE email = 'admin@example.com'`
    );
    if (!ha.length) {
      const hash = await bcrypt.hash('password', 10);
      const { rows } = await db.query(
        `INSERT INTO public.users (tenant_id, email, password_hash)
         VALUES (1, 'admin@example.com', $1)
         RETURNING id;`,
        [hash]
      );
      await db.query(
        `INSERT INTO public.profiles (tenant_id, name, role, hotel_id, user_id)
         VALUES (
           1,
           'Admin Demo',
           'admin',
           '550e8400-e29b-41d4-a716-446655440000',
           $1
         );`,
        [rows[0].id]
      );
      await db.query(`
        INSERT INTO public.hotel_languages (tenant_id, hotel_id, lang_code)
        SELECT 1, '550e8400-e29b-41d4-a716-446655440000', lang
        FROM unnest(ARRAY['fr','en']) AS lang
        WHERE NOT EXISTS (
          SELECT 1
            FROM public.hotel_languages hl
           WHERE hl.hotel_id = '550e8400-e29b-41d4-a716-446655440000'
             AND hl.lang_code = lang
        );
      `);

      await db.query(`
        INSERT INTO public.knowledge_items (tenant_id, hotel_id, info)
        VALUES
          (1, '550e8400-e29b-41d4-a716-446655440000', 'Le petit-d\'jeuner est servi de 7h \u00e0 10h.'),
          (1, '550e8400-e29b-41d4-a716-446655440000', 'La piscine est ouverte de 8h \u00e0 20h.')
        ON CONFLICT DO NOTHING;
      `);
    }

    console.log('✅ Seed terminé !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur de seed :', err);
    process.exit(1);
  }
}

// Exécution directe du script (pas de require en ES module)
if (process.argv[1] === (new URL(import.meta.url)).pathname) {
  seedDatabase();
}

export default seedDatabase;
