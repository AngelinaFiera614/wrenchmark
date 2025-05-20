
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
import { Loader, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authTimeout, setAuthTimeout] = useState(false);
  const [authInitFailed, setAuthInitFailed] = useState(false);
  const [showFallbackAuth, setShowFallbackAuth] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, isLoading, authInitError } = auth;
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check for auth initialization errors
  useEffect(() => {
    if (authInitError) {
      console.error("Auth initialization error:", authInitError);
      setAuthInitFailed(true);
    }
  }, [authInitError]);

  // Add a timeout to detect auth initialization issues
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.error("Auth: Authentication initialization is taking too long");
        setAuthTimeout(true);
      }, 3000); // 3 seconds timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  // Automatic fallback if auth is still loading after a longer time
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading || authTimeout || authInitFailed) {
        console.log("Auth: Showing fallback auth form due to loading issues");
        setShowFallbackAuth(true);
      }
    }, 5000); // Show fallback after 5 seconds
    
    return () => clearTimeout(fallbackTimeout);
  }, [isLoading, authTimeout, authInitFailed]);

  // Auto reset timeout state after it's been shown for a while
  useEffect(() => {
    if (authTimeout) {
      const resetTimeout = setTimeout(() => {
        setAuthTimeout(false);
      }, 10000); // Reset after 10 seconds
      
      return () => clearTimeout(resetTimeout);
    }
  }, [authTimeout]);

  // Force fallback after critical time
  useEffect(() => {
    const criticalTimeout = setTimeout(() => {
      if (isLoading) {
        console.error("Auth: CRITICAL - Auth initialization stuck in loading state");
        setShowFallbackAuth(true);
        setAuthTimeout(true);
      }
    }, 8000); // Critical timeout after 8 seconds
    
    return () => clearTimeout(criticalTimeout);
  }, [isLoading]);

  // If user is already authenticated, redirect to desired location or home
  useEffect(() => {
    if (user && !isLoading) {
      console.log("Auth: User is authenticated, redirecting");
      // Navigate to the location they tried to visit or default to home page
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location.state]);

  const handleContinueAnyway = () => {
    setAuthTimeout(false);
    setAuthInitFailed(false);
    setShowFallbackAuth(true);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  // Show loading while auth is initializing (unless we've hit a timeout)
  if (isLoading && !authTimeout && !showFallbackAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Checking authentication...</p>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleContinueAnyway}
            className="mt-4"
          >
            Continue to login form
          </Button>
        </div>
      </div>
    );
  }
  
  // Show error if auth is taking too long or failed
  if ((authTimeout || authInitFailed) && !showFallbackAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background px-4">
        <Card className="w-full max-w-md shadow-lg border-border/60">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center text-xl text-red-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Authentication Issue
            </CardTitle>
            <CardDescription>
              {authInitFailed 
                ? "There was an error initializing authentication."
                : "Authentication is taking longer than expected."}
              You can try to reload or continue anyway.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-red-900/20">
              <AlertDescription>
                {authInitError 
                  ? `Error details: ${authInitError.message || 'Unknown error'}`
                  : "The application may be experiencing connectivity issues with the authentication service."}
              </AlertDescription>
            </Alert>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleRefreshPage}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button 
                onClick={handleContinueAnyway}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                Continue to Login Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (values: AuthFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      if (isLogin) {
        console.log("Auth: Attempting sign in");
        await auth.signIn(values.email, values.password);
      } else {
        console.log("Auth: Attempting sign up");
        await auth.signUp(values.email, values.password);
        toast.success("Please check your email to verify your account!");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed. Please try again.");
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
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
          {authError && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20">
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
              <Button type="submit" className="w-full bg-accent-teal text-black hover:bg-accent-teal/80" disabled={isSubmitting}>
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
            <Button variant="link" className="ml-1 p-0" onClick={toggleAuthMode} disabled={isSubmitting}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
          
          {/* Add debug action */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-foreground mt-4"
            onClick={handleRefreshPage}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Refresh page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Auth;
