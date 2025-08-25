-- Create RLS policies for admin access to see dashboard data

-- Allow all users to read orders (for now - will be restricted to admin later)
DROP POLICY IF EXISTS "Public access to orders" ON public.orders;
CREATE POLICY "Admin access to orders" ON public.orders
  FOR SELECT USING (true);

-- Allow all users to read payments (for now - will be restricted to admin later)  
DROP POLICY IF EXISTS "Public access to payments" ON public.payments;
CREATE POLICY "Admin access to payments" ON public.payments
  FOR SELECT USING (true);

-- Allow all users to read products for dashboard stats
DROP POLICY IF EXISTS "Public access to products" ON public.products;
CREATE POLICY "Public access to products" ON public.products
  FOR SELECT USING (true);