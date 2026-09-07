create table if not exists style_assets (
  id         text primary key,
  mime       text not null default 'image/jpeg',
  body       text not null,
  created_at timestamptz not null default now()
);
