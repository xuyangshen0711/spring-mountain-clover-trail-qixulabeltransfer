create table if not exists styles (
  id text primary key,
  original_sku text,
  factory text not null,
  list_month text not null,
  colors_json text not null,
  kind text not null,
  rule_label text not null,
  factory_sizes_json text not null,
  extra_note text,
  image_front text,
  image_side text,
  updated_at timestamptz not null default now()
);
