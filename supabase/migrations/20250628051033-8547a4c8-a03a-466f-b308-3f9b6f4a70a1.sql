
-- Create user motorcycle favorites table
CREATE TABLE public.user_motorcycle_favorites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    motorcycle_id UUID REFERENCES public.motorcycle_models(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    UNIQUE(user_id, motorcycle_id)
);

-- Enable RLS
ALTER TABLE public.user_motorcycle_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own favorites" 
    ON public.user_motorcycle_favorites 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
    ON public.user_motorcycle_favorites 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
    ON public.user_motorcycle_favorites 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create user comparison lists table
CREATE TABLE public.user_comparison_lists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    motorcycle_ids UUID[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for comparison lists
ALTER TABLE public.user_comparison_lists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comparison lists
CREATE POLICY "Users can view their own comparison lists" 
    ON public.user_comparison_lists 
    FOR SELECT 
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own comparison lists" 
    ON public.user_comparison_lists 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparison lists" 
    ON public.user_comparison_lists 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparison lists" 
    ON public.user_comparison_lists 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_comparison_lists_updated_at
    BEFORE UPDATE ON public.user_comparison_lists
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_timestamp();
