import { createAuthClient } from "better-auth/react";
import type { auth } from "../auth";
import {
  inferAdditionalFields,
  passkeyClient,
  oidcClient,
  // genericOAuthClient,
  // apiKeyClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    passkeyClient(),
    oidcClient(),
    inferAdditionalFields<typeof auth>(),
    // genericOAuthClient(),
    // apiKeyClient(),
  ],
});

export const { signIn, signOut, getSession, useSession } = authClient;
