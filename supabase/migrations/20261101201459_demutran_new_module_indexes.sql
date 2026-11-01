create index if not exists rental_vehicles_created_by_idx on public.rental_vehicles(created_by);
create index if not exists rental_vehicles_placa_idx on public.rental_vehicles(placa);
create index if not exists rental_vehicles_status_idx on public.rental_vehicles(status);
create index if not exists traffic_accident_reports_created_by_idx on public.traffic_accident_reports(created_by);
create index if not exists traffic_accident_reports_occurred_at_idx on public.traffic_accident_reports(data_ocorrencia desc);
create index if not exists traffic_accident_reports_status_idx on public.traffic_accident_reports(status);
create index if not exists institutional_settings_updated_by_idx on public.institutional_settings(updated_by);

drop trigger if exists set_updated_at on public.institutional_settings;
create trigger set_updated_at before update on public.institutional_settings for each row execute function public.set_updated_at();
