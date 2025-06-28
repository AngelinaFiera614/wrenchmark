
-- Create security audit log table for tracking admin actions and security events
CREATE TABLE public.admin_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admin audit log (only admins can view)
CREATE POLICY "Admins can view audit logs" 
    ON public.admin_audit_log 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Create enhanced user activity log for general security events
CREATE TABLE public.user_activity_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user activity log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity, admins can view all
CREATE POLICY "Users can view their own activity" 
    ON public.user_activity_log 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" 
    ON public.user_activity_log 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Create email verification tracking table
CREATE TABLE public.email_verification_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    verification_type TEXT NOT NULL, -- 'signup', 'email_change', 'password_reset'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'expired', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on email verification log
ALTER TABLE public.email_verification_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification logs
CREATE POLICY "Users can view their own verification logs" 
    ON public.email_verification_log 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Admins can view all verification logs
CREATE POLICY "Admins can view all verification logs" 
    ON public.email_verification_log 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_activity_log (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_details
    );
END;
$$;

-- Create function to clean up expired verification logs
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.email_verification_log 
    WHERE status = 'pending' AND expires_at < now();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Add email verification status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;
