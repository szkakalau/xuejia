import { ensureDatabaseSchema } from "../src/lib/ensure-schema";
import { disconnectSeedClient, seedIfEmpty } from "../src/lib/seed-database";

ensureDatabaseSchema()
  .then(() => seedIfEmpty())
  .then((result) => {
    if (result.seeded) {
      console.log(`==> Seeded ${result.productCount} products.`);
    } else {
      console.log(`==> Database already has ${result.productCount} products, skip seed.`);
    }
  })
  .catch((error) => {
    console.error("==> Seed failed:", error);
    process.exit(1);
  })
  .finally(() => disconnectSeedClient());
