
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/context/auth';
import { User, Mail, Shield, Settings, Crown, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  // Fetch all users if current user is admin
  const { data: allUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, username, full_name, is_admin, created_at')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin,
  });

  const handlePromoteUser = async (targetUserId: string, promote: boolean) => {
    if (!isAdmin) return;
    
    setPromotingUserId(targetUserId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: promote })
        .eq('user_id', targetUserId);

      if (error) throw error;
      
      toast.success(`User ${promote ? 'promoted to' : 'demoted from'} admin successfully`);
      refetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(`Failed to ${promote ? 'promote' : 'demote'} user: ${error.message}`);
    } finally {
      setPromotingUserId(null);
    }
  };

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
                  <Button asChild className="w-full bg-accent-teal hover:bg-accent-teal/90 text-black">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Open Admin Dashboard
                    </Link>
                  </Button>
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

            {/* Admin User Management Section */}
            {isAdmin && allUsers && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.map((userProfile) => (
                          <TableRow key={userProfile.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {userProfile.full_name || userProfile.username || 'No name'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {userProfile.user_id.substring(0, 8)}...
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {userProfile.is_admin ? (
                                <Badge className="bg-accent-teal text-black">Admin</Badge>
                              ) : (
                                <Badge variant="outline">User</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(userProfile.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {userProfile.user_id !== user.id && (
                                <div className="flex gap-2">
                                  {userProfile.is_admin ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handlePromoteUser(userProfile.user_id, false)}
                                      disabled={promotingUserId === userProfile.user_id}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <UserMinus className="h-3 w-3 mr-1" />
                                      Remove Admin
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handlePromoteUser(userProfile.user_id, true)}
                                      disabled={promotingUserId === userProfile.user_id}
                                      className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
                                    >
                                      <UserPlus className="h-3 w-3 mr-1" />
                                      Make Admin
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

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
