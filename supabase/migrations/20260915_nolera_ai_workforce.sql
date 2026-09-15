-- NOLERA X AI Workforce
-- AI agents are NOT human admins/employees.
-- They are operational agents assigned to platform modules.

create table if not exists public.nolera_ai_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  description text,
  description_ar text,
  category text not null default 'general',
  module text not null default 'ai',
  icon text not null default 'Bot',
  status text not null default 'active'
    check (status in ('active', 'paused', 'disabled')),
  agent_type text not null default 'native'
    check (agent_type in ('native', 'api', 'hybrid', 'external')),
  capabilities jsonb not null default '[]'::jsonb,
  commands jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  priority integer not null default 50,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nolera_ai_agents_module_idx
  on public.nolera_ai_agents(module);

create index if not exists nolera_ai_agents_status_idx
  on public.nolera_ai_agents(status);

create index if not exists nolera_ai_agents_category_idx
  on public.nolera_ai_agents(category);


create table if not exists public.nolera_ai_agent_assignments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.nolera_ai_agents(id) on delete cascade,
  module text not null,
  enabled boolean not null default true,
  permissions jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(agent_id, module)
);

create index if not exists nolera_ai_agent_assignments_module_idx
  on public.nolera_ai_agent_assignments(module);


create table if not exists public.nolera_ai_agent_commands (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.nolera_ai_agents(id) on delete set null,
  module text not null,
  command text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed')),
  requested_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  error text
);

create index if not exists nolera_ai_agent_commands_agent_idx
  on public.nolera_ai_agent_commands(agent_id);

create index if not exists nolera_ai_agent_commands_module_idx
  on public.nolera_ai_agent_commands(module);

create index if not exists nolera_ai_agent_commands_status_idx
  on public.nolera_ai_agent_commands(status);


create or replace function public.nolera_ai_agents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists nolera_ai_agents_updated_at
on public.nolera_ai_agents;

create trigger nolera_ai_agents_updated_at
before update on public.nolera_ai_agents
for each row
execute function public.nolera_ai_agents_updated_at();


create or replace function public.nolera_ai_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role::text
      from public.profiles
      where id = auth.uid()
      limit 1
    ),
    'user'
  );
$$;


alter table public.nolera_ai_agents enable row level security;
alter table public.nolera_ai_agent_assignments enable row level security;
alter table public.nolera_ai_agent_commands enable row level security;


drop policy if exists "AI agents readable by authenticated users"
on public.nolera_ai_agents;

create policy "AI agents readable by authenticated users"
on public.nolera_ai_agents
for select
to authenticated
using (true);


drop policy if exists "AI agents managed by super admin"
on public.nolera_ai_agents;

create policy "AI agents managed by super admin"
on public.nolera_ai_agents
for all
to authenticated
using (public.nolera_ai_current_role() = 'super_admin')
with check (public.nolera_ai_current_role() = 'super_admin');


drop policy if exists "AI assignments readable by authenticated users"
on public.nolera_ai_agent_assignments;

create policy "AI assignments readable by authenticated users"
on public.nolera_ai_agent_assignments
for select
to authenticated
using (true);


drop policy if exists "AI assignments managed by super admin"
on public.nolera_ai_agent_assignments;

create policy "AI assignments managed by super admin"
on public.nolera_ai_agent_assignments
for all
to authenticated
using (public.nolera_ai_current_role() = 'super_admin')
with check (public.nolera_ai_current_role() = 'super_admin');


drop policy if exists "AI commands readable by requester or super admin"
on public.nolera_ai_agent_commands;

create policy "AI commands readable by requester or super admin"
on public.nolera_ai_agent_commands
for select
to authenticated
using (
  requested_by = auth.uid()
  or public.nolera_ai_current_role() = 'super_admin'
);


drop policy if exists "AI commands created by authenticated users"
on public.nolera_ai_agent_commands;

create policy "AI commands created by authenticated users"
on public.nolera_ai_agent_commands
for insert
to authenticated
with check (requested_by = auth.uid());


drop policy if exists "AI commands managed by super admin"
on public.nolera_ai_agent_commands;

create policy "AI commands managed by super admin"
on public.nolera_ai_agent_commands
for update
to authenticated
using (public.nolera_ai_current_role() = 'super_admin')
with check (public.nolera_ai_current_role() = 'super_admin');


-- Initial NOLERA AI Workforce.
-- These are AI operational roles, not human employee roles.

insert into public.nolera_ai_agents
  (name, name_ar, description, description_ar, category, module, icon, agent_type, capabilities, commands, priority)
values
  (
    'NOLERA General Assistant',
    'المساعد العام',
    'General AI assistant for NOLERA X.',
    'المساعد العام لمنصة NOLERA X.',
    'general',
    'ai',
    'Bot',
    'native',
    '["assistant","research","support"]'::jsonb,
    '["assist","research","summarize"]'::jsonb,
    100
  ),
  (
    'Store AI Manager',
    'مدير المتجر الذكي',
    'AI operations for Store.',
    'إدارة وتحليل عمليات المتجر بالذكاء الاصطناعي.',
    'commerce',
    'store',
    'ShoppingBag',
    'hybrid',
    '["products","reviews","profit_loss","recommendations"]'::jsonb,
    '["analyze_store","review_product","profit_report"]'::jsonb,
    90
  ),
  (
    'ADS AI Manager',
    'مدير الإعلانات الذكي',
    'AI manager for NOLERA ADS.',
    'مدير ذكي لمنظومة NOLERA ADS.',
    'marketing',
    'ads',
    'Megaphone',
    'hybrid',
    '["ads","campaigns","analytics","optimization"]'::jsonb,
    '["create_campaign","analyze_campaign","optimize_ads"]'::jsonb,
    90
  ),
  (
    'Paradise AI',
    'ذكاء NOLERA PARADISE',
    'AI content and community assistant for Paradise.',
    'مساعد المحتوى والمجتمع في NOLERA PARADISE.',
    'content',
    'paradise',
    'Sparkles',
    'hybrid',
    '["stories","posts","community","creative"]'::jsonb,
    '["create_story","create_post","analyze_content"]'::jsonb,
    80
  ),
  (
    'Logistics AI Manager',
    'مدير الخدمات اللوجستية الذكي',
    'AI manager for global logistics services.',
    'مدير ذكي للخدمات اللوجستية العالمية.',
    'operations',
    'logistics',
    'Truck',
    'hybrid',
    '["logistics","requests","routing","operations"]'::jsonb,
    '["analyze_request","estimate","optimize"]'::jsonb,
    90
  ),
  (
    'Directory AI',
    'ذكاء دليل الشركات',
    'AI assistant for company directory.',
    'مساعد ذكي لدليل الشركات والخدمات.',
    'business',
    'directory',
    'Building2',
    'native',
    '["companies","search","classification"]'::jsonb,
    '["classify_company","improve_listing","search"]'::jsonb,
    80
  ),
  (
    'Content AI',
    'وكيل المحتوى',
    'AI content creation and management.',
    'وكيل إنشاء وإدارة المحتوى.',
    'content',
    'content',
    'FileText',
    'hybrid',
    '["writing","editing","seo","social"]'::jsonb,
    '["create_content","rewrite","seo"]'::jsonb,
    80
  ),
  (
    'Digital Product AI',
    'وكيل المنتجات الرقمية',
    'AI factory for digital products.',
    'وكيل إنشاء المنتجات الرقمية.',
    'products',
    'create-product',
    'Package',
    'hybrid',
    '["products","generation","pricing"]'::jsonb,
    '["create_product","improve_product","pricing"]'::jsonb,
    85
  ),
  (
    'Business Intelligence AI',
    'ذكاء الأعمال',
    'Business analytics and performance intelligence.',
    'تحليل الأعمال والأداء.',
    'business',
    'business',
    'BarChart3',
    'hybrid',
    '["analytics","profit_loss","forecasting"]'::jsonb,
    '["business_report","forecast","profit_loss"]'::jsonb,
    95
  ),
  (
    'Automation AI',
    'وكيل الأتمتة',
    'Automation and workflow management.',
    'وكيل الأتمتة وإدارة سير العمل.',
    'automation',
    'automation',
    'Workflow',
    'hybrid',
    '["automation","workflows","tasks"]'::jsonb,
    '["create_workflow","run_workflow","optimize"]'::jsonb,
    85
  ),
  (
    'Research AI',
    'وكيل البحث',
    'Research and intelligence assistant.',
    'مساعد البحث وجمع المعلومات.',
    'research',
    'research',
    'Search',
    'api',
    '["research","analysis","summaries"]'::jsonb,
    '["research","summarize","compare"]'::jsonb,
    75
  ),
  (
    'Security AI',
    'وكيل الأمن',
    'Security monitoring and anomaly analysis.',
    'وكيل مراقبة الأمن وتحليل الحالات غير الطبيعية.',
    'security',
    'security',
    'ShieldCheck',
    'hybrid',
    '["security","anomaly_detection","monitoring"]'::jsonb,
    '["security_scan","anomaly_report","monitor"]'::jsonb,
    100
  )
on conflict do nothing;


insert into public.nolera_ai_agent_assignments
  (agent_id, module, enabled, permissions)
select
  id,
  module,
  true,
  capabilities
from public.nolera_ai_agents
on conflict (agent_id, module) do update
set
  enabled = excluded.enabled,
  permissions = excluded.permissions,
  updated_at = now();


comment on table public.nolera_ai_agents is
  'NOLERA X AI Workforce. AI agents are operational agents and are not human admins or employees.';

comment on table public.nolera_ai_agent_assignments is
  'Assignments of AI agents to NOLERA X modules.';

comment on table public.nolera_ai_agent_commands is
  'Command history and execution state for NOLERA X AI agents.';
