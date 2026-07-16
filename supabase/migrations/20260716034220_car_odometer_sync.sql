-- Logging a service at a higher odometer reading than the car currently has
-- should bump the car's odometer automatically. Doing this with a database
-- trigger instead of client code means it can never be forgotten or raced:
-- every insert/update goes through it, no matter which app version wrote it.
--
-- The car row update runs as the requesting user, so RLS still applies —
-- users can only ever bump their own cars.

create function public.sync_car_odometer()
returns trigger
language plpgsql
as $$
begin
  update public.cars
    set odometer_km = new.odometer_km
    where id = new.car_id
      and odometer_km < new.odometer_km;
  return new;
end;
$$;

create trigger service_records_sync_odometer
  after insert or update of odometer_km on public.service_records
  for each row execute function public.sync_car_odometer();
