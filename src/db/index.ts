import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schemas from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(process.env.DATABASE_URL, {
  connection: { TimeZone: "UTC" },
});

export const db = drizzle({
  client,
  logger: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  schema: {
    ...schemas,
  },
});
