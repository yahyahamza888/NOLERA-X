insert into public.nolera_platform_settings
  (setting_key, setting_value)
values
  (
    'section_order',
    '["home","wallet","transfers","services","store","ads","paradise","directory","logistics","ai","markets"]'::jsonb
  )
on conflict (setting_key) do nothing;
