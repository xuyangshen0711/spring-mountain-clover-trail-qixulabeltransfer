-- Existing preview DBs already applied 0002, so a later 0003 file may
-- not have been picked up. Make assets + current styles columns idempotent.

create table if not exists style_assets (
  id         text primary key,
  mime       text not null default 'image/jpeg',
  body       text not null,
  created_at timestamptz not null default now()
);

alter table styles add column if not exists original_sku text;
alter table styles add column if not exists factory text not null default '冠乔';
alter table styles add column if not exists list_month text not null default '';
alter table styles add column if not exists colors jsonb not null default '[]'::jsonb;
alter table styles add column if not exists fabric text not null default '';
alter table styles add column if not exists factory_sizes jsonb not null default '[]'::jsonb;
alter table styles add column if not exists qixu_sizes jsonb not null default '[]'::jsonb;
alter table styles add column if not exists rule_label text not null default '';
alter table styles add column if not exists extra_note text not null default '';
alter table styles add column if not exists image_front text;
alter table styles add column if not exists image_side text;
alter table styles add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'styles' and column_name = 'colors_json'
  ) then
    update styles
      set colors = case
        when colors_json is null then colors
        else colors_json::jsonb
      end
      where colors = '[]'::jsonb;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'styles' and column_name = 'factory_sizes_json'
  ) then
    update styles
      set factory_sizes = case
        when factory_sizes_json is null then factory_sizes
        else factory_sizes_json::jsonb
      end
      where factory_sizes = '[]'::jsonb;
  end if;
exception
  when others then
    null;
end $$;
