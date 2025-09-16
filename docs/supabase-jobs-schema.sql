-- Jobs table for processing briefs
-- This replaces Redis/Bull with a Supabase-based job queue
-- NOTE: This works with the existing briefs table structure

-- Add analysis column to existing briefs table (safe operation)
alter table briefs add column if not exists analysis jsonb;

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs(id) on delete cascade,
  type text not null check (type in ('analysis', 'asset_prep', 'storyboard', 'render', 'video_generation', 'image_processing', 'text_analysis')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  priority int not null default 0, -- Higher numbers = higher priority
  attempts int not null default 0,
  max_attempts int not null default 3,
  error text,
  result jsonb,
  metadata jsonb, -- Additional job-specific data
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for efficient querying
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_jobs_type on jobs(type);
create index if not exists idx_jobs_brief_id on jobs(brief_id);
create index if not exists idx_jobs_priority_created on jobs(priority desc, created_at asc);
create index if not exists idx_jobs_pending on jobs(status, priority desc, created_at asc) where status = 'pending';

-- Update timestamp automatically
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_jobs_updated_at
before update on jobs
for each row
execute procedure update_updated_at_column();

-- Function to safely claim a job (prevents race conditions)
create or replace function claim_job(job_id uuid, worker_id text default null)
returns boolean as $$
declare
  job_record jobs%rowtype;
begin
  -- Try to update the job to processing status
  update jobs 
  set 
    status = 'processing',
    attempts = attempts + 1,
    started_at = now(),
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('worker_id', worker_id)
  where id = job_id 
    and status = 'pending'
    and attempts < max_attempts;
  
  -- Check if the update was successful
  get diagnostics job_record = row_count;
  return job_record > 0;
end;
$$ language plpgsql;

-- Function to complete a job
create or replace function complete_job(job_id uuid, job_result jsonb default null)
returns boolean as $$
begin
  update jobs 
  set 
    status = 'completed',
    result = job_result,
    completed_at = now()
  where id = job_id 
    and status = 'processing';
  
  return found;
end;
$$ language plpgsql;

-- Function to fail a job
create or replace function fail_job(job_id uuid, error_message text default null)
returns boolean as $$
begin
  update jobs 
  set 
    status = case 
      when attempts >= max_attempts then 'failed'
      else 'pending'
    end,
    error = error_message,
    completed_at = case 
      when attempts >= max_attempts then now()
      else null
    end
  where id = job_id 
    and status = 'processing';
  
  return found;
end;
$$ language plpgsql;

-- View for monitoring job statistics
create or replace view job_stats as
select 
  type,
  status,
  count(*) as count,
  avg(extract(epoch from (completed_at - started_at))) as avg_duration_seconds,
  max(attempts) as max_attempts_used
from jobs 
where started_at is not null
group by type, status;

-- View for active jobs (currently processing)
create or replace view active_jobs as
select 
  j.*,
  b.title as brief_title,
  b.user_id
from jobs j
left join briefs b on j.brief_id = b.id
where j.status = 'processing'
order by j.priority desc, j.started_at asc;

-- View for pending jobs queue
create or replace view pending_jobs_queue as
select 
  j.*,
  b.title as brief_title,
  b.user_id
from jobs j
left join briefs b on j.brief_id = b.id
where j.status = 'pending'
  and j.attempts < j.max_attempts
order by j.priority desc, j.created_at asc;

-- RLS (Row Level Security) policies
alter table jobs enable row level security;

-- Policy: Users can view jobs for their own briefs
create policy "Users can view their own jobs" on jobs
  for select using (
    brief_id in (
      select id from briefs where user_id = auth.uid()
    )
  );

-- Policy: Service role can do everything (for workers)
create policy "Service role full access" on jobs
  for all using (auth.role() = 'service_role');

-- Grant permissions
grant all on jobs to service_role;
grant select on jobs to authenticated;
grant select on job_stats to authenticated;
grant select on active_jobs to authenticated;
grant select on pending_jobs_queue to authenticated;
