-- Fix kv_store table - add admin-only access policy
-- This table appears to be for internal application configuration

CREATE POLICY "Only admins can manage KV store" 
ON public.kv_store_32ef3d78
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Add policies to user_roles table for security
CREATE POLICY "Users can view own roles" 
ON public.user_roles
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can view all roles" 
ON public.user_roles
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can assign roles (INSERT/UPDATE/DELETE)
CREATE POLICY "Only admins can manage roles" 
ON public.user_roles
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));