-- NOLERA X — Directory preflight check

select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and (
    table_name ilike '%compan%'
    or table_name ilike '%business%'
    or table_name ilike '%director%'
    or table_name ilike '%provider%'
  )
order by table_name;

select
  routine_schema,
  routine_name
from information_schema.routines
where routine_schema = 'public'
  and (
    routine_name ilike '%compan%'
    or routine_name ilike '%business%'
    or routine_name ilike '%director%'
    or routine_name ilike '%provider%'
  )
order by routine_name;
