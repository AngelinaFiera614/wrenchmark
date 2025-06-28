
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'welcome' | 'password_reset' | 'email_change' | 'magic_link';
  confirmationUrl?: string;
  token?: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmationUrl, token, userName }: AuthEmailRequest = await req.json();

    let emailHtml = '';
    let subject = '';

    switch (type) {
      case 'welcome':
        subject = 'Welcome to Wrenchmark!';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090C0E; color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00D2B4; font-size: 32px; font-weight: bold; margin: 0;">WRENCHMARK</h1>
              <p style="color: #00D2B4; font-size: 18px; margin: 10px 0 0 0;">Ride Farther. Build Smarter.</p>
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; border-radius: 8px; border-left: 4px solid #00D2B4;">
              <h2 style="color: #ffffff; margin-top: 0;">Welcome ${userName || 'Rider'}!</h2>
              <p style="color: #cccccc; line-height: 1.6;">
                Thanks for joining the Wrenchmark community! You now have access to comprehensive motorcycle specs, 
                maintenance guides, and learning resources to help you ride farther and build smarter.
              </p>
              
              ${confirmationUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}" style="background: #00D2B4; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Confirm Your Email
                  </a>
                </div>
              ` : ''}
              
              <p style="color: #cccccc; line-height: 1.6;">
                Get started by exploring our motorcycle database, creating comparison lists, or diving into our learning modules.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
              <p>Happy riding!</p>
              <p>The Wrenchmark Team</p>
            </div>
          </div>
        `;
        break;

      case 'password_reset':
        subject = 'Reset Your Wrenchmark Password';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090C0E; color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00D2B4; font-size: 32px; font-weight: bold; margin: 0;">WRENCHMARK</h1>
              <p style="color: #00D2B4; font-size: 18px; margin: 10px 0 0 0;">Ride Farther. Build Smarter.</p>
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; border-radius: 8px; border-left: 4px solid #00D2B4;">
              <h2 style="color: #ffffff; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #cccccc; line-height: 1.6;">
                We received a request to reset your Wrenchmark password. Click the button below to create a new password.
              </p>
              
              ${confirmationUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}" style="background: #00D2B4; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </div>
              ` : ''}
              
              <p style="color: #cccccc; line-height: 1.6; font-size: 14px;">
                If you didn't request this password reset, you can safely ignore this email. This link will expire in 24 hours.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
              <p>Stay secure on the road!</p>
              <p>The Wrenchmark Team</p>
            </div>
          </div>
        `;
        break;

      case 'magic_link':
        subject = 'Your Wrenchmark Magic Link';
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090C0E; color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #00D2B4; font-size: 32px; font-weight: bold; margin: 0;">WRENCHMARK</h1>
              <p style="color: #00D2B4; font-size: 18px; margin: 10px 0 0 0;">Ride Farther. Build Smarter.</p>
            </div>
            
            <div style="background: #1a1a1a; padding: 30px; border-radius: 8px; border-left: 4px solid #00D2B4;">
              <h2 style="color: #ffffff; margin-top: 0;">Sign In to Wrenchmark</h2>
              <p style="color: #cccccc; line-height: 1.6;">
                Click the button below to securely sign in to your Wrenchmark account.
              </p>
              
              ${confirmationUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}" style="background: #00D2B4; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Sign In
                  </a>
                </div>
              ` : ''}
              
              <p style="color: #cccccc; line-height: 1.6; font-size: 14px;">
                This link will expire in 1 hour for your security. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
              <p>Ready to ride!</p>
              <p>The Wrenchmark Team</p>
            </div>
          </div>
        `;
        break;
    }

    // Log the email attempt
    await supabase.from('email_verification_log').insert({
      email,
      verification_type: type,
      status: 'pending'
    });

    const emailResponse = await resend.emails.send({
      from: "Wrenchmark <noreply@wrenchmark.app>",
      to: [email],
      subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
