
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/auth";
import { Loader, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const AdminAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin, isLoading, signIn } = useAuth();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If user is already authenticated and is admin, redirect to admin dashboard
  useEffect(() => {
    if (user && !isLoading && isAdmin) {
      console.log("AdminAuth: Admin user authenticated, redirecting to dashboard");
    }
  }, [user, isLoading, isAdmin]);

  // If user is authenticated but not admin, show error
  if (user && !isLoading && !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-explorer-dark px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-explorer-chrome/30 bg-explorer-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription className="text-explorer-text-muted">
              You need administrator privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-explorer-text-muted text-center">
              Please contact an administrator to request access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated and is admin, redirect
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (values: SignInFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      console.log("AdminAuth: Attempting admin sign in");
      await signIn(values.email, values.password);
      toast.success("Welcome to Wrenchmark Admin!");
    } catch (error: any) {
      console.error("Admin authentication error:", error);
      setAuthError(error.message || "Authentication failed. Please check your credentials.");
      toast.error(error.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-explorer-dark">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-explorer-text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-explorer-dark px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-explorer-chrome/30 bg-explorer-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-accent-teal" />
          </div>
          <CardTitle className="text-2xl font-bold text-accent-teal">
            Admin Access
          </CardTitle>
          <CardDescription className="text-explorer-text-muted">
            Sign in with your administrator credentials to access the Wrenchmark admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-400/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-explorer-text">Admin Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@wrenchmark.com" 
                        className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-explorer-text">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-accent-teal text-black hover:bg-accent-teal/80" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Access Admin Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-xs text-explorer-text-muted">
            Need access? Contact your system administrator.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminAuth;
