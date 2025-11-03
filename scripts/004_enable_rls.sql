-- Enable Row Level Security on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Tenants: Users can only see their own tenant
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Users: Users can see users in their tenant
CREATE POLICY "Users can view users in their tenant"
  ON users FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- WhatsApp Accounts: Users can see accounts in their tenant
CREATE POLICY "Users can view accounts in their tenant"
  ON whatsapp_accounts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Contacts: Users can see contacts in their tenant
CREATE POLICY "Users can view contacts in their tenant"
  ON contacts FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert contacts in their tenant"
  ON contacts FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update contacts in their tenant"
  ON contacts FOR UPDATE
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Conversations: Users can see conversations in their tenant
CREATE POLICY "Users can view conversations in their tenant"
  ON conversations FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert conversations in their tenant"
  ON conversations FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Messages: Users can see messages for conversations they can see
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
  ));

-- Campaigns: Users can see campaigns in their tenant
CREATE POLICY "Users can view campaigns in their tenant"
  ON campaigns FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert campaigns in their tenant"
  ON campaigns FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Flows: Users can see flows in their tenant
CREATE POLICY "Users can view flows in their tenant"
  ON flows FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert flows in their tenant"
  ON flows FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Tickets: Users can see tickets in their tenant
CREATE POLICY "Users can view tickets in their tenant"
  ON tickets FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Analytics: Users can see analytics for their tenant
CREATE POLICY "Users can view analytics for their tenant"
  ON analytics_daily FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Subscriptions: Users can see their own subscription
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());
