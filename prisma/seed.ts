import { disconnectSeedClient, seedDatabase } from "../src/lib/seed-database";

seedDatabase()
  .then((count) => console.log(`Done. ${count} products in database.`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => disconnectSeedClient());
