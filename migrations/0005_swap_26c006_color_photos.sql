-- 26C006: c0 是深焙棕，c1 是英伦卡。之前 colors 指针反了。
update styles
set
  colors = (
    select jsonb_agg(
      case
        when c->>'name' = '英伦卡' then c || jsonb_build_object('image', '/catalog/26C006-c1.jpg')
        when c->>'name' = '深焙棕' then c || jsonb_build_object('image', '/catalog/26C006-c0.jpg')
        else c
      end
    )
    from jsonb_array_elements(colors) as c
  ),
  image_front = '/catalog/26C006-c1.jpg',
  updated_at = now()
where id = '26C006';
