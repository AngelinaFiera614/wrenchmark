
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth';
import { User, Mail, Shield, Settings, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Profile | Wrenchmark</title>
        </Helmet>
        
        <Layout>
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Access Your Profile</h1>
            <p className="text-muted-foreground mb-6">Sign in to view and manage your profile</p>
            <Link to="/login">
              <Button className="bg-accent-teal hover:bg-accent-teal/90 text-black">
                Sign In
              </Button>
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Wrenchmark</title>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            {/* Admin Access Card - Prominent for admin users */}
            {isAdmin && (
              <Card className="border-accent-teal/30 bg-accent-teal/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-teal">
                    <Crown className="h-5 w-5" />
                    Administrator Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You have administrator privileges. Access the admin dashboard to manage motorcycles, 
                    brands, content, and system settings.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild className="bg-accent-teal hover:bg-accent-teal/90 text-black">
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-accent-teal text-accent-teal hover:bg-accent-teal/10">
                      <Link to="/admin/users" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Manage Users
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={user?.email || ''} disabled />
                  </div>
                </div>

                {profile?.username && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profile.username} disabled />
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-2 p-3 bg-accent-teal/10 rounded-lg">
                    <Shield className="h-4 w-4 text-accent-teal" />
                    <span className="text-sm font-medium text-accent-teal">Administrator Access</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Edit Profile (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProfilePage;
