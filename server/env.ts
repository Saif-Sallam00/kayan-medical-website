// Must be imported before anything that reads DATABASE_URL (db.ts, session store).
// Accept NEON_DATABASE_URL as an alias so either name works in Vercel.
if (!process.env.DATABASE_URL && process.env.NEON_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.NEON_DATABASE_URL;
}

export {};
