import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schemas from "@/db/schema";
import { join } from "node:path";

const client = new PGlite();

export const db = drizzle({
  client,
  schema: {
    ...schemas,
  },
});
await migrate(db, {
  migrationsFolder: join(__filename, "../../drizzle"),
});
