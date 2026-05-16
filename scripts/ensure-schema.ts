import { ensureDatabaseSchema } from "../src/lib/ensure-schema";

ensureDatabaseSchema()
  .then((result) => console.log(`==> ensure-schema: ${result.message}`))
  .catch((error) => {
    console.error("==> ensure-schema failed:", error);
    process.exit(1);
  });
