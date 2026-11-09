-- Run once in Supabase Dashboard > SQL Editor after deploying this update.
-- Builds the five-level editable leadership hierarchy requested by the school.

begin;

alter table public.leadership_profiles
  add column if not exists hierarchy_group text not null default 'operations';
alter table public.leadership_profiles
  drop constraint if exists leadership_profiles_hierarchy_group_check;

-- Move records created by the earlier three-level version before the new
-- constraint is applied.
update public.leadership_profiles
set hierarchy_group = case
  when slug = 'school-administrator' then 'administration'
  when slug in ('senior-school-head', 'junior-school-head', 'head-of-early-years') then 'heads'
  else 'operations'
end
where hierarchy_group = 'executive';

alter table public.leadership_profiles
  add constraint leadership_profiles_hierarchy_group_check
  check (hierarchy_group in ('governance', 'administration', 'heads', 'deputies', 'operations'));

insert into public.leadership_profiles (
  slug, name, role, area, description, confirmed, hierarchy_group, sort_order
)
values
  (
    'board-chair',
    'Mr Rajen Shah',
    'Chair, Board of Governors',
    'Governance',
    'Provides governance, stewardship and long-term direction for the academy.',
    true,
    'governance',
    1
  ),
  (
    'deputy-head-senior-school',
    'Profile to be confirmed',
    'Deputy Head Senior School',
    'Senior School',
    'Supports Senior School leadership, academic coordination, student progress and pastoral care.',
    false,
    'deputies',
    1
  ),
  (
    'deputy-head-junior-school',
    'Profile to be confirmed',
    'Deputy Head Junior School',
    'Junior School',
    'Supports Junior School leadership, teaching quality, learner development and daily coordination.',
    false,
    'deputies',
    2
  ),
  (
    'head-co-curricular',
    'Profile to be confirmed',
    'Head Co-curricular',
    'Whole-school enrichment',
    'Coordinates sport, clubs, arts and enrichment opportunities across the academy.',
    false,
    'deputies',
    3
  ),
  (
    'human-resources-manager',
    'Profile to be confirmed',
    'Human Resources',
    'People and culture',
    'Supports staff wellbeing, recruitment, professional practice and the academy''s people operations.',
    false,
    'operations',
    1
  ),
  (
    'head-of-information-technology',
    'Profile to be confirmed',
    'Head of Information Technology',
    'Digital systems',
    'Oversees technology infrastructure, digital learning systems, data security and school-wide IT support.',
    false,
    'operations',
    2
  ),
  (
    'facilities-manager',
    'Profile to be confirmed',
    'Facilities Manager',
    'Campus operations',
    'Coordinates campus facilities, maintenance, safety, utilities and the readiness of learning spaces.',
    false,
    'operations',
    3
  )
on conflict (slug) do update
set
  hierarchy_group = excluded.hierarchy_group,
  sort_order = excluded.sort_order;

update public.leadership_profiles
set hierarchy_group = 'administration',
    sort_order = 1
where slug = 'school-administrator';

update public.leadership_profiles
set hierarchy_group = 'heads',
    sort_order = case slug
      when 'senior-school-head' then 1
      when 'junior-school-head' then 2
      when 'head-of-early-years' then 3
      else sort_order
    end
where slug in (
  'senior-school-head',
  'junior-school-head',
  'head-of-early-years'
);

update public.leadership_profiles
set hierarchy_group = 'operations',
    sort_order = case slug
      when 'head-of-information-technology' then 2
      when 'facilities-manager' then 3
      else sort_order
    end
where slug in (
  'head-of-information-technology',
  'facilities-manager'
);

update public.leadership_profiles
set role = 'Head Senior School'
where slug = 'senior-school-head' and role = 'Senior School Head';

update public.leadership_profiles
set role = 'Head Junior School'
where slug = 'junior-school-head' and role = 'Junior School Head';

-- Remove only the untouched placeholder from the previous default structure.
-- A real accountant profile edited by an administrator is preserved.
delete from public.leadership_profiles
where slug = 'school-accountant'
  and name = 'Profile to be confirmed'
  and confirmed = false;

commit;

notify pgrst, 'reload schema';
