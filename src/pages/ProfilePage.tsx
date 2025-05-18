
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';
import UserCoursesSection from '@/components/profile/UserCoursesSection';
import UserSkillsSection from '@/components/profile/UserSkillsSection';
import GlossaryProgressSection from '@/components/profile/GlossaryProgressSection';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
                    {user.user_metadata?.full_name || user.email}
                  </CardTitle>
                  {user.user_metadata?.full_name && (
                    <CardDescription>{user.email}</CardDescription>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UserCoursesSection />
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
