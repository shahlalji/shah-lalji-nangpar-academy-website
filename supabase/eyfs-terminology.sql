-- Run once in Supabase Dashboard > SQL Editor after deploying the EYFS update.
-- Keeps existing dashboard content and uploaded image replacements in sync.

begin;

update public.stories
set
  category = case when category = 'Early Years' then 'EYFS' else category end,
  hero_alt = replace(hero_alt, 'Early Years', 'EYFS'),
  body_json = replace(body_json::text, 'Early Years', 'EYFS')::jsonb
where
  category = 'Early Years'
  or hero_alt like '%Early Years%'
  or body_json::text like '%Early Years%';

update public.leadership_profiles
set
  role = case when role = 'Head of Early Years' then 'Head of EYFS' else role end,
  area = case when area = 'Early Years' then 'EYFS' else area end
where role = 'Head of Early Years' or area = 'Early Years';

insert into public.site_images (
  key,
  label,
  group_name,
  default_url,
  current_url,
  alt_text,
  updated_by,
  updated_at
)
select
  'content.education.eyfs.hero',
  'EYFS hero',
  group_name,
  default_url,
  current_url,
  replace(alt_text, 'Early Years', 'EYFS'),
  updated_by,
  updated_at
from public.site_images
where key = 'content.education.nursery.hero'
on conflict (key) do update
set
  label = excluded.label,
  group_name = excluded.group_name,
  default_url = excluded.default_url,
  current_url = coalesce(public.site_images.current_url, excluded.current_url),
  alt_text = case
    when public.site_images.alt_text = '' then excluded.alt_text
    else public.site_images.alt_text
  end;

delete from public.site_images
where key = 'content.education.nursery.hero';

commit;
