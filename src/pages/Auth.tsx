
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
import { PasswordStrengthMeter } from "@/components/security/PasswordStrengthMeter";
import { validatePassword } from "@/services/security/inputSanitizer";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters")
    .refine((password) => {
      const validation = validatePassword(password);
      return validation.isValid;
    }, "Password must contain uppercase, lowercase, number, and special character"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, authError: contextAuthError } = useAuth();
  
  // Determine if we're on signup page or login page
  const isSignupPage = location.pathname === '/signup';
  const [isLogin, setIsLogin] = useState(!isSignupPage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  
  const currentSchema = isLogin ? signInSchema : signUpSchema;
  
  const form = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Update form mode based on URL
  useEffect(() => {
    const shouldBeLogin = location.pathname !== '/signup';
    if (isLogin !== shouldBeLogin) {
      setIsLogin(shouldBeLogin);
      form.reset();
      setPasswordValue("");
      setAuthError(null);
    }
  }, [location.pathname, isLogin, form]);

  // If user is already authenticated, redirect to desired location or home
  useEffect(() => {
    if (user && !isLoading) {
      console.log("Auth: User is authenticated, redirecting");
      // Navigate to the location they tried to visit or default to home page
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location.state]);

  // Set error from context if available
  useEffect(() => {
    if (contextAuthError) {
      setAuthError(contextAuthError.message);
    }
  }, [contextAuthError]);

  // Reset form when switching between login/signup
  useEffect(() => {
    form.reset();
    setPasswordValue("");
    setAuthError(null);
  }, [isLogin, form]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const { signIn, signUp } = useAuth();

  const onSubmit = async (values: SignInFormValues | SignUpFormValues) => {
    if (isSubmitting) return;
    
    console.log("[Auth] Form submitted with email:", values.email);
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      if (isLogin) {
        console.log("[Auth] Attempting sign in");
        const result = await signIn(values.email, values.password);
        console.log("[Auth] Sign in result:", result);
      } else {
        console.log("[Auth] Attempting sign up");
        const result = await signUp(values.email, values.password);
        console.log("[Auth] Sign up result:", result);
        toast.success("Please check your email to verify your account!");
      }
    } catch (error: any) {
      console.error("[Auth] Authentication error:", error);
      setAuthError(error.message || "Authentication failed. Please try again.");
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    const newPath = isLogin ? '/signup' : '/login';
    navigate(newPath);
  };

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Checking authentication...</p>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefreshPage}
            className="mt-4"
          >
            Refresh page
          </Button>
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
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordValue(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {!isLogin && passwordValue && (
                      <PasswordStrengthMeter 
                        password={passwordValue}
                        className="mt-2"
                      />
                    )}
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
