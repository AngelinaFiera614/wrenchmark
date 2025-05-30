
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';
import UserCoursesSection from '@/components/profile/UserCoursesSection';
import UserSkillsSection from '@/components/profile/UserSkillsSection';
import GlossaryProgressSection from '@/components/profile/GlossaryProgressSection';
import UserPreferencesSection from '@/components/profile/UserPreferencesSection';
import { createProfileIfNotExists } from '@/services/profileService';
import { toast } from 'sonner';
import { Loader, RefreshCw } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, signOut, isLoading, refreshProfile } = useAuth();

  // Try to create a profile if one doesn't exist
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile) {
        console.log("Profile page: Creating profile for user", user.id);
        const createdProfile = await createProfileIfNotExists(user.id);
        if (!createdProfile) {
          toast.error("Could not create a user profile. Some features may not work correctly.");
        }
      }
    };
    
    ensureProfile();
  }, [user, profile]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleRefresh = async () => {
    if (user) {
      toast.info("Refreshing your profile information...");
      await refreshProfile();
      toast.success("Profile refreshed");
    }
  };

  // Show loading state while auth is processing
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <Loader className="h-8 w-8 animate-spin text-accent-teal mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile information.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Not Signed In</h1>
          <p className="mb-6 text-muted-foreground">
            You must be signed in to view your profile.
          </p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <>
      <Helmet>
        <title>My Profile | Wrenchmark</title>
      </Helmet>

      <div className="container py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {profile?.full_name || user.user_metadata?.full_name || user.email}
                  </CardTitle>
                  {(profile?.full_name || user.user_metadata?.full_name) && (
                    <CardDescription>{user.email}</CardDescription>
                  )}
                  {profile?.username && (
                    <CardDescription>@{profile.username}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} title="Refresh profile data">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
                {profile?.is_admin && (
                  <p className="text-accent-teal font-medium">Administrator</p>
                )}
                {!profile && (
                  <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-500 px-4 py-2 rounded-md mt-3">
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Note:</span> 
                      Your profile information is incomplete. Click the Refresh button above to try creating your profile.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <UserCoursesSection />
              <UserPreferencesSection />
            </div>
            <div className="space-y-6">
              <GlossaryProgressSection />
              <UserSkillsSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
