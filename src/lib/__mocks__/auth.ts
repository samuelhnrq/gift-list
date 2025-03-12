import { vi } from "vitest";

export const mockedSession = {
  session: {},
  user: {
    email: "test@test.com",
  },
};

export const getSession = vi.fn(() => mockedSession);

export const assertSession = vi.fn(() => mockedSession);

export const auth = vi.fn();
