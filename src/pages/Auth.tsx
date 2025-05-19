
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { refreshSession } from "@/services/authService";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, session, user, isLoading, profile, refreshProfile } = useAuth();
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Effect to handle successful authentication
  useEffect(() => {
    // Check if we have all the pieces of a successful auth
    if (session && user && profile && authComplete) {
      console.log("Auth: User has complete authentication, redirecting");
      // Get the intended destination or default to home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [session, user, profile, authComplete, location.state, navigate]);

  // If we're still loading auth state, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // If already authenticated (all pieces are present), redirect
  if (session && user && profile && !authComplete) {
    console.log("Auth: Already authenticated, will redirect");
    setAuthComplete(true);
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Authentication successful, redirecting...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        console.log("Auth: Attempting sign in");
        await signIn(values.email, values.password);
        
        // Wait a moment for auth state to update
        setTimeout(async () => {
          console.log("Auth: Sign in completed, refreshing session");
          await refreshSession();
          
          // Wait another moment then refresh profile
          setTimeout(async () => {
            console.log("Auth: Refreshing profile after sign in");
            await refreshProfile();
            setAuthComplete(true);
          }, 500);
        }, 500);
        
      } else {
        console.log("Auth: Attempting sign up");
        await signUp(values.email, values.password);
        // Show success message but stay on page
        toast.success("Please check your email to verify your account!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-accent-teal">
            {isLogin ? "Sign In to Wrenchmark" : "Create a Wrenchmark Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your dashboard"
              : "Sign up for a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent-teal text-black hover:bg-accent-teal/80" disabled={isSubmitting || authComplete}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing In..." : "Signing Up..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button variant="link" className="ml-1 p-0" onClick={toggleAuthMode}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
