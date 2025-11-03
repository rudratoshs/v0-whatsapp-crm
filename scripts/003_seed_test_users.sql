-- Insert test users with their Supabase Auth IDs
-- Note: These auth users need to be created via Supabase Auth API first
-- Then insert their profiles here with the IDs returned

-- Get or create demo tenant first
WITH demo_tenant AS (
  SELECT id FROM tenants WHERE slug = 'demo' LIMIT 1
)
INSERT INTO users (
  id, tenant_id, email, full_name, role, status, password_hash
) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM demo_tenant), 'admin@whatsapp-crm.com', 'Admin User', 'super_admin', 'active', '$2a$10$hash_placeholder_admin'),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM demo_tenant), 'business@whatsapp-crm.com', 'Business Owner', 'user', 'active', '$2a$10$hash_placeholder_business'),
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM demo_tenant), 'agent@whatsapp-crm.com', 'Support Agent', 'agent', 'active', '$2a$10$hash_placeholder_agent')
ON CONFLICT (email) DO NOTHING;
