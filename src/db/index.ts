import { drizzle } from "drizzle-orm/postgres-js";
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

// You can specify any property from the bun sql connection options
export const db = drizzle({
  connection: { url: process.env.DATABASE_URL, connect_timeout: 1000 },
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
