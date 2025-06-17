const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

async function createTables() {
  try {
      ALTER TABLE IF EXISTS public.hotels ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);
      ALTER TABLE IF EXISTS public.hotels ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
    console.log("▶ Création des extensions et colonnes dynamiques...");

    // pgcrypto + colonnes tenant_id avec précaution
    await db.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    const alterStatements = [
      `ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.hotels ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;`,
      `ALTER TABLE IF EXISTS public.hotel_languages ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.support_tickets ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.subscription_plans ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.languages ADD COLUMN IF NOT EXISTS tenant_id INT;`,
      `ALTER TABLE IF EXISTS public.hotels ADD COLUMN IF NOT EXISTS user_id UUID;`,
      `ALTER TABLE IF EXISTS public.hotels ADD COLUMN IF NOT EXISTS plan_id UUID;`
    ];

    for (const stmt of alterStatements) {
      await db.query(stmt);
    }

    // Appliquer contraintes sur tenant_id
    const constraintFix = [
      `ALTER TABLE public.users ALTER COLUMN tenant_id SET NOT NULL;`,
      `ALTER TABLE public.users ALTER COLUMN tenant_id SET DEFAULT 1;`,
      `ALTER TABLE public.hotels ALTER COLUMN tenant_id SET NOT NULL;`,
      `ALTER TABLE public.hotels ALTER COLUMN tenant_id SET DEFAULT 1;`,
      `ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;`,
      `ALTER TABLE public.profiles ALTER COLUMN tenant_id SET DEFAULT 1;`
    ];

    for (const stmt of constraintFix) {
      await db.query(stmt);
    }

    await db.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_plan'
        ) THEN
          ALTER TABLE public.hotels ADD CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_hotel_user'
        ) THEN
          ALTER TABLE public.hotels ADD CONSTRAINT fk_hotel_user FOREIGN KEY (user_id) REFERENCES public.users(id);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_fkey'
        ) THEN
          ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
        END IF;
      END$$;
    `);

    console.log("▶ Création des tables principales...");

    // Users
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,

      CREATE TABLE IF NOT EXISTS public.knowledge_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID REFERENCES public.hotels(id),
        info TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Hotels
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.hotels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(255),
        default_lang_code VARCHAR(10) DEFAULT 'en',
        plan_id UUID,
        user_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Profiles
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      INSERT INTO public.hotels (id, name, description, contact_name, contact_email)
      VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Hotel', 'A demonstration hotel for testing', 'Admin Demo', 'admin@example.com')
        role VARCHAR(50) DEFAULT 'client',
        hotel_id UUID REFERENCES public.hotels(id),
        user_id UUID UNIQUE REFERENCES public.users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Hotel Languages
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.hotel_languages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        hotel_id UUID REFERENCES public.hotels(id),
        lang_code VARCHAR(10) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (hotel_id, lang_code)
      );
    `);

    // Support Tickets
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.support_tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'medium',
        user_id UUID REFERENCES public.users(id),
    } else {
      superAdminResult = existingSuperAdmin;
      const prof = await db.query(
        'SELECT id FROM public.profiles WHERE user_id = $1',
        [existingSuperAdmin.rows[0].id]
      );
      if (prof.rows.length === 0) {
        await db.query(
          `INSERT INTO public.profiles (user_id, name, role) VALUES ($1, 'Super Admin', 'superadmin')`,
          [existingSuperAdmin.rows[0].id]
        );
      }
    } else {
      hotelAdminResult = existingHotelAdmin;
      const prof = await db.query(
        'SELECT id FROM public.profiles WHERE user_id = $1',
        [existingHotelAdmin.rows[0].id]
      );
      if (prof.rows.length === 0) {
        await db.query(
          `INSERT INTO public.profiles (user_id, name, role, hotel_id) VALUES ($1, 'Admin Demo', 'admin', '550e8400-e29b-41d4-a716-446655440000')`,
          [existingHotelAdmin.rows[0].id]
        );
      }
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Subscription Plans
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.subscription_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        features JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(name)
      );
    `);

    // Languages
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.languages (
        code VARCHAR(10) PRIMARY KEY,
        tenant_id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL
      );
    `);


      await db.query(`
        INSERT INTO public.knowledge_items (hotel_id, info)
        VALUES
          ('550e8400-e29b-41d4-a716-446655440000', 'Le petit-d\'jeuner est servi de 7h \u00e0 10h.'),
          ('550e8400-e29b-41d4-a716-446655440000', 'La piscine est ouverte de 8h \u00e0 20h.')
        ON CONFLICT DO NOTHING;
      `);
    // Conversations (ajoutée pour éviter crash dashboard)
    await db.query(`
      CREATE TABLE IF NOT EXISTS public.conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hotel_id UUID REFERENCES public.hotels(id),
        user_id UUID REFERENCES public.users(id),
        started_at TIMESTAMPTZ DEFAULT NOW(),
        last_message_at TIMESTAMPTZ
      );
    `);

    console.log("✅ Tables créées avec succès.");
  } catch (error) {
    console.error('❌ Erreur création tables:', error);
  }
}

async function seedDatabase() {
  try {
    await createTables();
    console.log('🚀 Début du peuplement de la base...');

    await db.query(`
      INSERT INTO public.subscription_plans (name, price, features)
      VALUES
        ('Basic', 29.99, '{"conversations": 1000, "languages": 5}'::jsonb),
        ('Pro', 79.99, '{"conversations": 5000, "languages": 15}'::jsonb),
        ('Enterprise', 199.99, '{"conversations": -1, "languages": -1}'::jsonb)
      ON CONFLICT (name) DO NOTHING;
    `);

    await db.query(`
      INSERT INTO public.hotels (id, name, description)
      VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Hotel', 'A demonstration hotel for testing')
      ON CONFLICT (id) DO NOTHING;
    `);

    await db.query(`
      INSERT INTO public.languages (code, name) VALUES
        ('fr', 'Français'),
        ('en', 'English'),
        ('es', 'Español'),
        ('de', 'Deutsch')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Création superadmin
    const existingSuperAdmin = await db.query(`SELECT id FROM public.users WHERE email = 'pass@passhoteltest.com'`);
    if (existingSuperAdmin.rows.length === 0) {
      const hash = await bcrypt.hash('pass', 10);
      const res = await db.query(`
        INSERT INTO public.users (id, email, password_hash)
        VALUES (gen_random_uuid(), 'pass@passhoteltest.com', $1)
        RETURNING id;
      `, [hash]);

      await db.query(`
        INSERT INTO public.profiles (user_id, name, role)
        VALUES ($1, 'Super Admin', 'superadmin');
      `, [res.rows[0].id]);
    }

    // Création admin hôtel
    const existingHotelAdmin = await db.query(`SELECT id FROM public.users WHERE email = 'admin@example.com'`);
    if (existingHotelAdmin.rows.length === 0) {
      const hash = await bcrypt.hash('password', 10);
      const res = await db.query(`
        INSERT INTO public.users (id, email, password_hash)
        VALUES (gen_random_uuid(), 'admin@example.com', $1)
        RETURNING id;
      `, [hash]);

      await db.query(`
        INSERT INTO public.profiles (user_id, name, role, hotel_id)
        VALUES ($1, 'Admin Demo', 'admin', '550e8400-e29b-41d4-a716-446655440000');
      `, [res.rows[0].id]);

      await db.query(`
        UPDATE public.hotels SET user_id = $1 WHERE id = '550e8400-e29b-41d4-a716-446655440000';
      `, [res.rows[0].id]);

      await db.query(`
        INSERT INTO public.hotel_languages (hotel_id, lang_code)
        VALUES 
          ('550e8400-e29b-41d4-a716-446655440000', 'fr'),
          ('550e8400-e29b-41d4-a716-446655440000', 'en')
        ON CONFLICT (hotel_id, lang_code) DO NOTHING;
      `);
    }

    console.log('✅ Base de données peuplée avec succès !');
    console.log('Utilisateurs créés :');
    console.log('- pass@passhoteltest.com / pass (Super Admin)');
    console.log('- admin@example.com / password (Hotel Admin)');
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
