-- Create ENUM types
CREATE TYPE user_role_enum AS ENUM ('super_admin', 'admin', 'user', 'agent', 'manager');
CREATE TYPE account_status_enum AS ENUM ('connected', 'disconnected', 'error', 'pending');
CREATE TYPE message_status_enum AS ENUM ('queued', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE conversation_status_enum AS ENUM ('open', 'pending', 'closed', 'archived');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'scheduled', 'running', 'completed', 'paused', 'failed');
CREATE TYPE ticket_status_enum AS ENUM ('open', 'in_progress', 'pending', 'resolved', 'closed', 'reopened');
CREATE TYPE template_status_enum AS ENUM ('pending', 'approved', 'rejected', 'disabled');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'trial', 'cancelled', 'expired', 'suspended');
CREATE TYPE segment_type_enum AS ENUM ('dynamic', 'static');

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  font_family VARCHAR(100),
  custom_css TEXT,
  show_powered_by BOOLEAN DEFAULT true,
  custom_domain VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID,
  subscription_status subscription_status_enum DEFAULT 'trial'
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role user_role_enum DEFAULT 'user',
  team_id UUID,
  department_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  profile_picture_url VARCHAR(500),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

-- WhatsApp Accounts
CREATE TABLE whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  account_type VARCHAR(50), -- 'qr_code' or 'cloud_api'
  status account_status_enum DEFAULT 'pending',
  health_score INTEGER DEFAULT 100,
  message_quota INTEGER DEFAULT 1000,
  message_quota_remaining INTEGER DEFAULT 1000,
  credentials_encrypted JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(tenant_id, phone_number)
);

-- Account Health History
CREATE TABLE account_health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id) ON DELETE CASCADE,
  health_score INTEGER,
  uptime_percentage DECIMAL(5, 2),
  latency_ms INTEGER,
  error_rate DECIMAL(5, 2),
  factors JSONB,
  recorded_at TIMESTAMP DEFAULT now()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  company VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255),
  custom_fields JSONB DEFAULT '{}'::jsonb,
  engagement_score INTEGER DEFAULT 0,
  source VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  UNIQUE(tenant_id, phone_number)
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- Contact Tags junction table
CREATE TABLE contact_tags (
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (contact_id, tag_id)
);

-- Segments
CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  conditions JSONB,
  segment_type segment_type_enum DEFAULT 'dynamic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- Contact Timeline
CREATE TABLE contact_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  event_type VARCHAR(50), -- 'message', 'tag_added', 'field_updated', etc.
  event_data JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  status conversation_status_enum DEFAULT 'open',
  assigned_agent_id UUID REFERENCES users(id),
  last_message_at TIMESTAMP,
  unread_count INTEGER DEFAULT 0,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(50), -- 'user', 'contact', 'system'
  sender_id UUID,
  content TEXT,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'video', 'document', 'audio', 'template'
  media_url VARCHAR(500),
  media_type VARCHAR(50),
  status message_status_enum DEFAULT 'queued',
  whatsapp_message_id VARCHAR(255),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Canned Responses
CREATE TABLE canned_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  shortcut_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50), -- 'marketing', 'utility', 'authentication'
  language VARCHAR(10) DEFAULT 'en',
  header_type VARCHAR(50), -- 'text', 'image', 'video', 'document'
  header_content TEXT,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB DEFAULT '[]'::jsonb,
  variables JSONB DEFAULT '[]'::jsonb,
  status template_status_enum DEFAULT 'pending',
  meta_template_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(tenant_id, account_id, name, language)
);

-- Flows (Automation)
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB, -- Flow builder nodes
  edges JSONB, -- Flow builder connections
  is_active BOOLEAN DEFAULT false,
  trigger_type VARCHAR(50), -- 'message_received', 'contact_tagged', 'schedule', etc.
  trigger_conditions JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Flow Executions
CREATE TABLE flow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id),
  current_node_id VARCHAR(255),
  variables JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed', 'paused'
  started_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  message_type VARCHAR(50), -- 'template' or 'text'
  template_id UUID REFERENCES templates(id),
  message_content TEXT,
  audience_type VARCHAR(50), -- 'all', 'segment', 'tag', 'csv'
  target_segment_id UUID REFERENCES segments(id),
  target_tags JSONB, -- Array of tag IDs
  schedule_type VARCHAR(50), -- 'now', 'scheduled', 'recurring'
  scheduled_at TIMESTAMP,
  recurring_pattern VARCHAR(100),
  status campaign_status_enum DEFAULT 'draft',
  throttle_messages_per_hour INTEGER,
  messages_sent INTEGER DEFAULT 0,
  messages_delivered INTEGER DEFAULT 0,
  messages_read INTEGER DEFAULT 0,
  messages_failed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  conversation_id UUID REFERENCES conversations(id),
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status ticket_status_enum DEFAULT 'open',
  category VARCHAR(100),
  assigned_agent_id UUID REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  due_date TIMESTAMP,
  first_response_at TIMESTAMP,
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Ticket Comments
CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Analytics Daily Stats
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  contacts_added INTEGER DEFAULT 0,
  campaigns_sent INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER,
  conversations_opened INTEGER DEFAULT 0,
  conversations_closed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(tenant_id, date)
);

-- Subscription Plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10, 2),
  price_annual DECIMAL(10, 2),
  trial_days INTEGER DEFAULT 14,
  features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status subscription_status_enum DEFAULT 'trial',
  started_at TIMESTAMP DEFAULT now(),
  trial_ends_at TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  gateway VARCHAR(50), -- 'stripe', 'paypal', etc.
  gateway_transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  last_used_at TIMESTAMP
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_whatsapp_accounts_tenant_id ON whatsapp_accounts(tenant_id);
CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_conversations_tenant_id ON conversations(tenant_id);
CREATE INDEX idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_campaigns_tenant_id ON campaigns(tenant_id);
CREATE INDEX idx_flows_tenant_id ON flows(tenant_id);
CREATE INDEX idx_templates_tenant_id ON templates(tenant_id);
CREATE INDEX idx_tickets_tenant_id ON tickets(tenant_id);
