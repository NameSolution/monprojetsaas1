// Wrapper to run the ESM seed script from CommonJS
(async () => {
  try {
    const { default: seedDatabase } = await import('./seed.mjs');
    await seedDatabase();
  } catch (err) {
    console.error('Seed script failed:', err);
    process.exit(1);
  }
})();
