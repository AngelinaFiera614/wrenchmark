
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
import { refreshSession } from "@/services/auth";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [lastRedirectTime, setLastRedirectTime] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, session, user, isLoading, profile } = useAuth();
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Effect to handle successful authentication with protection against redirect loops
  useEffect(() => {
    // Skip if we're still loading or authentication is not complete
    if (isLoading || !session || !user || !authComplete) return;
    
    // Get the intended destination or default to home
    const from = location.state?.from?.pathname || "/";
    const now = Date.now();
    
    // Check if we've redirected too many times in a short period
    if (redirectAttempts > 5 && now - lastRedirectTime < 3000) {
      console.log("Auth: Too many redirect attempts, stopping redirect loop");
      toast.error("Navigation error detected. Please try refreshing the page.");
      return;
    }
    
    // Update redirect tracking
    setRedirectAttempts(prev => prev + 1);
    setLastRedirectTime(now);
    
    console.log("Auth: User has complete authentication, redirecting to:", from);
    navigate(from, { replace: true });
  }, [session, user, authComplete, location.state, navigate, isLoading, redirectAttempts, lastRedirectTime]);

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
  
  // If already authenticated (all pieces are present), mark as complete for redirect
  if (session && user && profile && !authComplete) {
    console.log("Auth: Already authenticated, will redirect");
    setAuthComplete(true);
  }

  const onSubmit = async (values: AuthFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isLogin) {
        console.log("Auth: Attempting sign in");
        await signIn(values.email, values.password);
        
        // Mark as complete to trigger redirect
        setAuthComplete(true);
      } else {
        console.log("Auth: Attempting sign up");
        await signUp(values.email, values.password);
        // Show success message but stay on page
        toast.success("Please check your email to verify your account!");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.reset();
  };

  // Show redirect message when authentication is complete
  if (authComplete && !isLoading && user && session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Authentication successful, redirecting...</p>
        </div>
      </div>
    );
  }

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
            <Button variant="link" className="ml-1 p-0" onClick={toggleAuthMode} disabled={isSubmitting || authComplete}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Auth;
