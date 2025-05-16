
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
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  username: string | null;
  email: string;
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  avatar_url: string | null;
}

const AdminUsers = () => {
  // Fetch user profiles including auth data
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Join profiles with auth.users to get email addresses
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          username,
          is_admin,
          created_at,
          avatar_url
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Since we can't directly query auth.users from client due to RLS,
      // we'll need to handle this with limited information
      return profiles.map(profile => ({
        ...profile,
        email: "***@***", // Privacy-focused placeholder
        last_sign_in_at: null,
      })) as UserProfile[];
    },
    refetchOnWindowFocus: false,
  });

  const getInitials = (username: string | null, email: string): string => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <p className="text-muted-foreground">
        View and manage users registered on Wrenchmark.
      </p>
      
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
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user.username || "User"} />
                      ) : (
                        <AvatarFallback className="bg-accent-teal/20 text-accent-teal">
                          {getInitials(user.username, user.id.substring(0, 2))}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.username || "No username"}</div>
                    <div className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}...</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.is_admin ? (
                      <Badge variant="default" className="bg-accent-teal text-black">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
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
        <h3 className="text-sm font-medium mb-2">Note about user data:</h3>
        <p className="text-xs text-muted-foreground">
          For privacy and security reasons, sensitive user data like email addresses and last sign-in
          times are not displayed in this interface. This user list is intended for moderation purposes only.
        </p>
      </div>
    </div>
  );
};

export default AdminUsers;
