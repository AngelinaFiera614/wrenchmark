
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserMinus, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  avatar_url: string | null;
}

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  // Fetch user profiles
  const { data: users, isLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          user_id,
          username,
          full_name,
          is_admin,
          created_at,
          avatar_url
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      return profiles as UserProfile[];
    },
    refetchOnWindowFocus: false,
  });

  const handlePromoteUser = async (targetUserId: string, promote: boolean) => {
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

  const getInitials = (username: string | null, fullName: string | null, userId: string): string => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage users registered on Wrenchmark. Promote or demote admin privileges.
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-teal" />
        </div>
      ) : users && users.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user.username || user.full_name || "User"} />
                      ) : (
                        <AvatarFallback className="bg-accent-teal/20 text-accent-teal">
                          {getInitials(user.username, user.full_name, user.user_id)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {user.full_name || user.username || "No name"}
                    </div>
                    {user.username && user.full_name && (
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    )}
                    <div className="text-xs text-muted-foreground">ID: {user.user_id.substring(0, 8)}...</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {user.is_admin && <Shield className="h-3 w-3 text-accent-teal" />}
                      {user.is_admin ? (
                        <Badge variant="default" className="bg-accent-teal text-black">Admin</Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.user_id !== currentUser?.id && (
                      <div className="flex gap-2">
                        {user.is_admin ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteUser(user.user_id, false)}
                            disabled={promotingUserId === user.user_id}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteUser(user.user_id, true)}
                            disabled={promotingUserId === user.user_id}
                            className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Make Admin
                          </Button>
                        )}
                      </div>
                    )}
                    {user.user_id === currentUser?.id && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
      
      <div className="p-4 border rounded-md bg-muted/10">
        <h3 className="text-sm font-medium mb-2">User Management:</h3>
        <p className="text-xs text-muted-foreground">
          User profiles are automatically created when users sign up. Admin privileges can be granted or revoked here.
          Users with admin access can manage the system through the admin dashboard.
        </p>
      </div>
    </div>
  );
};

export default AdminUsers;
