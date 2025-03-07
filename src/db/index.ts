import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  account,
  apikey,
  jwks,
  passkey,
  session,
  user,
  verification,
} from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(process.env.DATABASE_URL);

// You can specify any property from the bun sql connection options
export const db = drizzle({
  client,
  schema: {
    account,
    apikey,
    jwks,
    passkey,
    session,
    user,
    verification,
  },
});
