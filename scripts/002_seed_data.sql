-- Seed Subscription Plans
INSERT INTO subscription_plans (name, description, price_monthly, price_annual, trial_days, features, is_active, sort_order) VALUES
(
  'Starter',
  'Perfect for solo entrepreneurs',
  49.00,
  470.00,
  14,
  '{"whatsapp_accounts": 1, "max_contacts": 5000, "ai_chatbot": false, "webhooks": false, "analytics": "basic", "mobile_apps": false}'::jsonb,
  true,
  1
),
(
  'Professional',
  'For growing businesses',
  89.00,
  854.00,
  14,
  '{"whatsapp_accounts": 5, "max_contacts": 50000, "ai_chatbot": true, "webhooks": true, "analytics": "advanced", "mobile_apps": false}'::jsonb,
  true,
  2
),
(
  'Agency',
  'For digital agencies',
  149.00,
  1430.00,
  14,
  '{"whatsapp_accounts": 999, "max_contacts": 999999, "ai_chatbot": true, "webhooks": true, "analytics": "advanced", "mobile_apps": true}'::jsonb,
  true,
  3
),
(
  'Enterprise',
  'Custom enterprise solution',
  499.00,
  4990.00,
  30,
  '{"whatsapp_accounts": 999, "max_contacts": 999999, "ai_chatbot": true, "webhooks": true, "analytics": "custom", "mobile_apps": true, "sso": true}'::jsonb,
  true,
  4
);

-- Seed Default Tenant
INSERT INTO tenants (name, slug, description, show_powered_by) VALUES
('Demo Tenant', 'demo', 'Demonstration tenant for testing', true);

-- Get tenant ID for seed data
-- Note: In a real migration, you might need to use DO block to handle this dynamically
