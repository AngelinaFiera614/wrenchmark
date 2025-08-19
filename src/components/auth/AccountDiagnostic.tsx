import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AccountInfo {
  exists: boolean;
  confirmed: boolean;
  lastSignIn?: string;
  createdAt?: string;
}

export function AccountDiagnostic() {
  const [email, setEmail] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkAccount = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsChecking(true);
    setAccountInfo(null);

    try {
      console.log("[AccountDiagnostic] Checking account for:", email);
      
      // Fallback: Try to sign up with a test to see if user exists
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: "test123456789!" // This will fail but tell us if user exists
      });
      
      console.log("[AccountDiagnostic] Sign up test result:", signUpError);
      
      if (signUpError?.message?.includes("already registered") || 
          signUpError?.message?.includes("User already registered")) {
        console.log("[AccountDiagnostic] User exists but may need verification");
        setAccountInfo({
          exists: true,
          confirmed: false // We can't determine confirmation status this way
        });
      } else if (!signUpError) {
        console.log("[AccountDiagnostic] User does not exist");
        setAccountInfo({
          exists: false,
          confirmed: false
        });
      } else {

        console.log("[AccountDiagnostic] Unknown error during account check:", signUpError);
        setAccountInfo({
          exists: false,
          confirmed: false
        });
      }

    } catch (error: any) {
      console.error("[AccountDiagnostic] Unexpected error:", error);
      toast.error("Unable to check account status");
    } finally {
      setIsChecking(false);
    }
  };

  const createAccount = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const password = prompt("Enter a password (min 12 characters with uppercase, lowercase, number, and special character):");
    if (!password) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created! Please check your email to verify your account.");
      checkAccount(); // Refresh status
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const resendConfirmation = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Confirmation email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send confirmation email");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Account Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={checkAccount} disabled={isChecking}>
            {isChecking ? "Checking..." : "Check"}
          </Button>
        </div>

        {accountInfo && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Account Status:</span>
              {accountInfo.exists ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>{accountInfo.exists ? "Exists" : "Not Found"}</span>
            </div>

            {accountInfo.exists && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email Verified:</span>
                {accountInfo.confirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <span>{accountInfo.confirmed ? "Yes" : "No"}</span>
              </div>
            )}

            {accountInfo.createdAt && (
              <div className="text-sm text-muted-foreground">
                Created: {new Date(accountInfo.createdAt).toLocaleDateString()}
              </div>
            )}

            {accountInfo.lastSignIn && (
              <div className="text-sm text-muted-foreground">
                Last sign in: {new Date(accountInfo.lastSignIn).toLocaleDateString()}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {!accountInfo.exists && (
                <Button onClick={createAccount} variant="teal" size="sm">
                  Create Account
                </Button>
              )}
              
              {accountInfo.exists && !accountInfo.confirmed && (
                <Button onClick={resendConfirmation} variant="outline" size="sm">
                  Resend Confirmation
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}