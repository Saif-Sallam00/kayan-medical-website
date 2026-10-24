// One-off seeding: `npm run db:seed`. Safe to re-run (both seeders skip existing data).
import { seedAdminUser } from "./seed";
import { seedContent } from "./seed-content";

async function main() {
  await seedAdminUser();
  await seedContent();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
