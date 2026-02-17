create table friday_customers (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  droplet_id text,
  customer_name text,
  business_name text,
  telegram_username text,
  bot_token text,
  agent_name text,
  use_cases text[],
  status text default 'pending', -- pending | configuring | active
  created_at timestamp default now(),
  configured_at timestamp
);

-- Index for fast token lookups
create index idx_friday_customers_token on friday_customers(token);
create index idx_friday_customers_droplet_id on friday_customers(droplet_id);
create index idx_friday_customers_status on friday_customers(status);
