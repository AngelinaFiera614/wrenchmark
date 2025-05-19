
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "../profileService";

// Admin cache types
export interface AdminStatusCache {
  isAdmin: boolean;
  timestamp: number;
}

// Local storage cache structure
export interface AdminCacheStorage {
  userId: string;
  isAdmin: boolean;
  timestamp: number;
}

// Session refresh status
export interface SessionRefreshState {
  lastRefreshTime: number;
  refreshPromise: Promise<Session | null> | null;
}
