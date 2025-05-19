
import { supabase } from "@/integrations/supabase/client";
import { getProfileById, createProfileIfNotExists } from "@/services/profileService";
import { AdminStatusCache, AdminCacheStorage } from "./types";
import { fetchCurrentSession } from "./sessionService";

// Constants
const ADMIN_CACHE_KEY = 'wrenchmark_admin_status';
const ADMIN_CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// In-memory cache for quick access
const adminStatusCache = new Map<string, AdminStatusCache>();

// Initialize cache from localStorage
initializeAdminCache();

/**
 * Initialize admin cache from localStorage if available
 */
function initializeAdminCache() {
  try {
    const storedCache = localStorage.getItem(ADMIN_CACHE_KEY);
    if (storedCache) {
      const parsedCache: AdminCacheStorage = JSON.parse(storedCache);
      // Only use cache if it's not expired
      if (parsedCache && parsedCache.timestamp && (Date.now() - parsedCache.timestamp < ADMIN_CACHE_TTL)) {
        if (parsedCache.userId && parsedCache.isAdmin !== undefined) {
          adminStatusCache.set(parsedCache.userId, {
            isAdmin: parsedCache.isAdmin,
            timestamp: parsedCache.timestamp
          });
          console.log("[adminService] Loaded admin status from persistent cache:", parsedCache);
        }
      } else {
        // Clear expired cache
        localStorage.removeItem(ADMIN_CACHE_KEY);
      }
    }
  } catch (error) {
    console.error("[adminService] Error loading admin cache from localStorage:", error);
    // Continue without the cache
  }
}

/**
 * Verify if a user is an admin
 */
export async function verifyAdminStatus(userId?: string): Promise<boolean> {
  try {
    console.log("[adminService] Verifying admin status");
    
    // First check if we have a user ID
    const userIdToCheck = userId || (await fetchCurrentSession())?.user?.id;
    
    if (!userIdToCheck) {
      console.log("[adminService] No user ID available for admin verification");
      return false;
    }
    
    // Check in-memory cache first
    const cachedStatus = adminStatusCache.get(userIdToCheck);
    if (cachedStatus && (Date.now() - cachedStatus.timestamp < ADMIN_CACHE_TTL)) {
      console.log(`[adminService] Using cached admin status for user ${userIdToCheck}: ${cachedStatus.isAdmin}`);
      return cachedStatus.isAdmin;
    }
    
    // Get user profile
    console.log(`[adminService] No valid cache found, fetching profile for user ${userIdToCheck}`);
    const profile = await getProfileById(userIdToCheck);
    
    if (!profile) {
      console.log("[adminService] No profile found during admin verification");
      
      // Try to create a profile if one doesn't exist
      const createdProfile = await createProfileIfNotExists(userIdToCheck);
      if (!createdProfile) {
        // Cache the negative result
        updateAdminCache(userIdToCheck, false);
        return false;
      }
      
      // Use the created profile
      const isAdmin = Boolean(createdProfile.is_admin);
      updateAdminCache(userIdToCheck, isAdmin);
      return isAdmin;
    }
    
    console.log(`[adminService] Admin status for user ${userIdToCheck}: ${profile.is_admin}`);
    
    // Update both caches
    updateAdminCache(userIdToCheck, Boolean(profile.is_admin));
    return Boolean(profile.is_admin);
  } catch (error) {
    console.error("[adminService] Error verifying admin status:", error);
    return false;
  }
}

/**
 * Update the admin cache (both in-memory and localStorage)
 */
function updateAdminCache(userId: string, isAdmin: boolean) {
  // Update in-memory cache
  adminStatusCache.set(userId, {
    isAdmin: isAdmin, 
    timestamp: Date.now()
  });
  
  // Update persistent cache in localStorage
  try {
    localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify({
      userId,
      isAdmin,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("[adminService] Error saving to localStorage:", error);
    // Continue even if localStorage fails
  }
  
  console.log(`[adminService] Updated admin cache for ${userId}: ${isAdmin}`);
}

/**
 * Clear the admin cache
 */
export function clearAdminCache() {
  adminStatusCache.clear();
  try {
    localStorage.removeItem(ADMIN_CACHE_KEY);
    console.log("[adminService] Admin cache cleared");
  } catch (e) {
    console.error("[adminService] Error clearing localStorage:", e);
  }
}

/**
 * Force clear admin cache and re-verify admin status
 */
export async function forceAdminVerification(userId?: string): Promise<boolean> {
  try {
    console.log("[adminService] Performing forced admin verification");
    
    const userIdToCheck = userId || (await fetchCurrentSession())?.user?.id;
    
    if (!userIdToCheck) {
      console.log("[adminService] No user ID available for forced verification");
      return false;
    }
    
    // Clear cache for this user
    adminStatusCache.delete(userIdToCheck);
    try {
      localStorage.removeItem(ADMIN_CACHE_KEY);
    } catch (e) {
      console.error("[adminService] Error clearing localStorage:", e);
    }
    
    // Perform a fresh verification
    return await verifyAdminStatus(userIdToCheck);
  } catch (error) {
    console.error("[adminService] Error in forceAdminVerification:", error);
    return false;
  }
}
