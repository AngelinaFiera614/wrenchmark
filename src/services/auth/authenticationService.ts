
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getProfile, createProfileIfNotExists } from "@/services/profileService";
import { validatePassword, sanitizeUserInput } from "@/services/security/inputSanitizer";
import { auditLogger } from "@/services/security/auditLogger";
import type { Profile } from "@/services/profileService";

export async function signIn(email: string, password: string) {
  console.log("Signing in user:", email);
  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeUserInput(email, 254).toLowerCase().trim();
    
    if (!sanitizedEmail || !password) {
      throw new Error("Email and password are required");
    }
    
    // Log authentication attempt
    await auditLogger.logAuthenticationAttempt(false, sanitizedEmail, { 
      action: 'sign_in_attempt' 
    });
    
    const { error, data } = await supabase.auth.signInWithPassword({ 
      email: sanitizedEmail, 
      password 
    });
    
    if (error) {
      await auditLogger.logAuthenticationAttempt(false, sanitizedEmail, { 
        error: error.message,
        action: 'sign_in_failed'
      });
      throw error;
    }
    
    console.log("Sign in successful");
    
    // Log successful authentication
    await auditLogger.logAuthenticationAttempt(true, sanitizedEmail, { 
      action: 'sign_in_success' 
    });

    if (data.user) {
      // Ensure profile exists after login
      const profile = await getProfile(data.user.id);
      if (!profile) {
        console.log("Creating profile after login");
        const createdProfile = await createProfileIfNotExists(data.user.id);
        if (!createdProfile) {
          toast.error("Failed to create profile. Please try refreshing.");
        }
      }
    }
    return data;
  } catch (error: any) {
    console.error("Sign in error:", error);
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeUserInput(email, 254).toLowerCase().trim();
    
    if (!sanitizedEmail || !password) {
      throw new Error("Email and password are required");
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    // Log authentication attempt
    await auditLogger.logAuthenticationAttempt(false, sanitizedEmail, { 
      action: 'sign_up_attempt' 
    });
    
    const { error, data } = await supabase.auth.signUp({ 
      email: sanitizedEmail, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      await auditLogger.logAuthenticationAttempt(false, sanitizedEmail, { 
        error: error.message,
        action: 'sign_up_failed'
      });
      throw error;
    }
    
    // Log successful signup
    await auditLogger.logAuthenticationAttempt(true, sanitizedEmail, { 
      action: 'sign_up_success' 
    });
    
    // Create profile immediately after signup if we have a user
    if (data.user) {
      console.log("Creating profile immediately after signup");
      const createdProfile = await createProfileIfNotExists(data.user.id);
      if (!createdProfile) {
        console.log("Failed to create profile during signup");
      }
    }
    
    toast.success("Signup successful! Please check your email to verify your account.");
    return data;
  } catch (error: any) {
    console.error("Sign up error:", error);
    toast.error(error.message || "Failed to sign up");
    throw error;
  }
}

export async function signOut() {
  try {
    // Log sign out attempt
    await auditLogger.logSecurityEvent({
      action: 'sign_out',
      resource_type: 'authentication',
      details: {},
      severity: 'low'
    });
    
    await supabase.auth.signOut();
    toast.success("You have been signed out");
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
}

export async function updateProfileData(
  userId: string, 
  profileData: Partial<Profile>
) {
  if (!userId) {
    toast.error("User ID not available for profile update");
    throw new Error("User ID not available");
  }

  try {
    // Sanitize profile data
    const sanitizedData: Partial<Profile> = {};
    
    if (profileData.username) {
      sanitizedData.username = sanitizeUserInput(profileData.username, 50);
    }
    
    if (profileData.full_name) {
      sanitizedData.full_name = sanitizeUserInput(profileData.full_name, 100);
    }
    
    if (profileData.bio) {
      sanitizedData.bio = sanitizeUserInput(profileData.bio, 500);
    }
    
    // Log profile update attempt
    await auditLogger.logSecurityEvent({
      action: 'profile_update',
      resource_type: 'profile',
      resource_id: userId,
      details: { fields: Object.keys(sanitizedData) },
      severity: 'low'
    });

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...sanitizedData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Profile updated successfully");
    return data as Profile;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.message || "Failed to update profile");
    throw error;
  }
}
