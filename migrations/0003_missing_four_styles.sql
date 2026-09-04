-- Upsert the 4 styles missing from the first import (26C013/018/022/032).
-- Column names match 0002_styles.sql: colors_json, not colors.

insert into styles (
  id, original_sku, factory, list_month, colors_json, kind, rule_label,
  factory_sizes_json, extra_note, image_front, image_side, updated_at
) values
(
  '26C013', '886C066', '冠乔', '26年-9月',
  '[{"name":"英伦卡","fabric":"面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维"},{"name":"布拉格灰","fabric":"面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维"}]',
  'unchanged', '不变', '["S","M","L"]', null,
  '/catalog/26C013-front.jpg', null, now()
),
(
  '26C018', '886C095', '冠乔', '26年-9月',
  '[{"name":"焦糖咖","fabric":"面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维"}]',
  's_to_xs', 'S变XS（整体降码）', '["S","M","L","XL"]', null,
  '/catalog/26C018-front.jpg', null, now()
),
(
  '26C022', '886C108', '冠乔', '26年-9月',
  '[{"name":"黑色","fabric":"面料表层：聚氨酯（PU）面料基布：72.5%粘纤 16.4%聚酯纤维 7.4%检 3.7%金属纤维（含胶）\n里料：100%聚酯纤维"}]',
  'unchanged', '不变', '["S","M","L","XL"]', null,
  '/catalog/26C022-front.jpg', null, now()
),
(
  '26C032', '886C361T', '冠乔', '26年-9月',
  '[{"name":"茶褐色","fabric":"面料：38.0%粘纤 29.5%检 27.1%腊纶 5.4%氨纶"},{"name":"深卡其","fabric":"面料：38.0%粘纤 29.5%检 27.1%腊纶 5.4%氨纶"},{"name":"藏青","fabric":"面料：38.0%粘纤 29.5%检 27.1%腊纶 5.4%氨纶"}]',
  'unchanged', '不变', '["S","M","L","XL"]', null,
  '/catalog/26C032-front.jpg', null, now()
)
on conflict (id) do update set
  original_sku = excluded.original_sku,
  factory = excluded.factory,
  list_month = excluded.list_month,
  colors_json = excluded.colors_json,
  kind = excluded.kind,
  rule_label = excluded.rule_label,
  factory_sizes_json = excluded.factory_sizes_json,
  extra_note = excluded.extra_note,
  image_front = excluded.image_front,
  image_side = excluded.image_side,
  updated_at = now();
