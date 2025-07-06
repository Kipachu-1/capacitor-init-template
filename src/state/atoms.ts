import { Session, User } from "@supabase/supabase-js";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Auth atoms
export const authModalOpenAtom = atom<boolean>(false);
export const userAtom = atomWithStorage<User | null>("user", null);
export const sessionAtom = atomWithStorage<Session | null>("session", null);

// Paywall atoms
export const entitlementStatusAtom = atom<"active" | "inactive" | "loading">(
  "loading"
);

export const darkModeAtom = atomWithStorage("darkMode", false);
