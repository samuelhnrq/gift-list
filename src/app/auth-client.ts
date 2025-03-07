import { createAuthClient } from "better-auth/react";
import type { auth } from "../auth";
import {
  inferAdditionalFields,
  passkeyClient,
  oidcClient,
} from "better-auth/client/plugins";

let baseURL = process.env.BETTER_AUTH_URL;
if (process.env.VERCEL_URL) {
  baseURL = `https://${process.env.VERCEL_URL}`;
}

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [
    passkeyClient(),
    oidcClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, useSession } = authClient;
