create table if not exists styles (
  id             text primary key,
  original_sku   text,
  factory        text not null,
  list_month     text not null,
  colors         jsonb not null default '[]'::jsonb,
  fabric         text not null default '',
  factory_sizes  jsonb not null default '[]'::jsonb,
  qixu_sizes     jsonb not null default '[]'::jsonb,
  rule_label     text not null default '',
  extra_note     text not null default '',
  image_front    text,
  image_side     text,
  updated_at     timestamptz not null default now()
);

create table if not exists app_meta (
  key   text primary key,
  value text not null
);

create index if not exists styles_month_idx on styles (list_month);
create index if not exists styles_original_idx on styles (original_sku);
